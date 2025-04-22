import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { FileText, Wand } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ClientInfoForm } from "./client-info-form";
import { ServicesTable } from "./services-table";
import { QuotationDisplay } from "./quotation-display";

const formSchema = z.object({
  client: z.string().min(2, {
    message: "Client name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  date: z.string().min(1, {
    message: "Please select a date.",
  }),
  items: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      unity: z.string().optional(),
      qty: z.number().min(1, "Quantity must be at least 1"),
      pricePerUnit: z.number().min(0, "Price must be positive"),
    })
  ),
  includeEBM: z.boolean().default(true),
  specialInstructions: z.string().optional(),
});

// Sample client data for AI suggestions
const sampleClients = [
  { client: "Kigali Heights", location: "Kigali, Rwanda" },
  { client: "Marriott Hotel", location: "Kigali, Rwanda" },
  { client: "Radisson Blu", location: "Kigali, Rwanda" },
  { client: "Bank of Kigali", location: "Nyarugenge, Kigali" },
  { client: "MTN Rwanda", location: "Nyarutarama, Kigali" },
  { client: "RwandAir", location: "Kigali, Rwanda" },
];

// Update the props interface to include onQuotationGenerated
interface ContactFormProps {
  onQuotationGenerated: (quote: string) => void;
}

export function ContactForm({ onQuotationGenerated }: ContactFormProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuote, setGeneratedQuote] = useState<string | null>(null);
  const [editableDescriptions, setEditableDescriptions] = useState<{
    [key: number]: string;
  }>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: "",
      location: "",
      date: new Date().toISOString().split("T")[0],
      items: [
        {
          description: "",
          unity: "-",
          qty: 1,
          pricePerUnit: 0,
        },
      ],
      includeEBM: true,
      specialInstructions: "",
    },
  });

  const fieldArray = useFieldArray({
    name: "items",
    control: form.control,
  });

  // AI suggestion for creating a complete quotation from minimal input
  const generateAIQuotation = () => {
    // Get common cleaning services and pre-fill the form
    const recommendedServices = [
      {
        description: "General Cleaning - Office Space",
        unity: "sq.m",
        qty: 200,
        pricePerUnit: 500,
      },
      {
        description: "Window Cleaning",
        unity: "window",
        qty: 15,
        pricePerUnit: 2500,
      },
      {
        description: "Carpet Cleaning",
        unity: "sq.m",
        qty: 100,
        pricePerUnit: 3500,
      },
    ];

    // Update form with recommended values
    form.setValue("client", form.getValues("client") || "Sample Client");
    form.setValue("location", form.getValues("location") || "Kigali, Rwanda");

    // Remove existing items and add recommended ones
    fieldArray.remove();
    recommendedServices.forEach((service) => {
      fieldArray.append(service);
    });

    toast({
      title: "AI Quotation Template Generated",
      description:
        "We've added recommended services based on typical office cleaning needs.",
    });
  };

  // AI client suggestion
  const suggestClientInfo = () => {
    const clientName = form.getValues("client");

    if (clientName.length > 2) {
      // Find matching client
      const match = sampleClients.find((c) =>
        c.client.toLowerCase().includes(clientName.toLowerCase())
      );

      if (match) {
        form.setValue("client", match.client);
        form.setValue("location", match.location);

        toast({
          title: "Client Information Updated",
          description: "We've found matching client details in our database.",
        });
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);

    try {
      // Get service descriptions for each item
      const items = await Promise.all(
        values.items.map(async (item, index) => {
          const description = await new Promise<string>((resolve) => {
            // Simulated AI response based on service type
            const descriptions: { [key: string]: string } = {
              window:
                "Professional window cleaning service using advanced techniques.",
              carpet: "Deep carpet cleaning using hot water extraction method.",
              office: "Comprehensive office cleaning service.",
              // ... more predefined descriptions
            };

            const match = Object.keys(descriptions).find((key) =>
              item.description.toLowerCase().includes(key)
            );

            setTimeout(() => {
              resolve(match ? descriptions[match] : "");
            }, 100);
          });

          // Use edited description if available, otherwise use AI-generated one
          const finalDescription = editableDescriptions[index] || description;

          return {
            ...item,
            id: index + 1,
            totalPrice: item.pricePerUnit * item.qty,
            aiDescription: finalDescription,
          };
        })
      );

      const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
      const tax = values.includeEBM ? subtotal * 0.18 : 0;
      const total = subtotal + tax;

      // Generate quote number
      const quoteId = `CCQ-${Math.floor(1000 + Math.random() * 9000)}`;

      const quotation = {
        quotationId: quoteId,
        client: values.client,
        location: values.location,
        date: values.date,
        items,
        subtotal,
        tax,
        totalAmount: total,
        includeEBM: values.includeEBM,
        specialInstructions:
          values.specialInstructions ||
          "Payment is required upon completion of the service.",
      };

      const formattedQuote = formatQuotation(quotation);
      setGeneratedQuote(formattedQuote);
      onQuotationGenerated(formattedQuote);

      toast({
        title: "Quotation Generated",
        description:
          "Your quotation has been successfully generated with AI descriptions.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate quotation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  // Add function to handle description edits
  const handleDescriptionEdit = (index: number, newDescription: string) => {
    setEditableDescriptions((prev) => ({
      ...prev,
      [index]: newDescription,
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Client Information</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={suggestClientInfo}
              className="flex items-center"
            >
              <Wand className="w-4 h-4 mr-2" />
              Find Client
            </Button>
          </div>

          <ClientInfoForm form={form} />
          <ServicesTable
            form={form}
            fieldArray={fieldArray}
            onDescriptionEdit={handleDescriptionEdit}
            editableDescriptions={editableDescriptions}
          />

          <FormField
            control={form.control}
            name="specialInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any special instructions or notes for this quotation"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  These instructions will be included in the quotation.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="includeEBM"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Include 18% EBM Tax</FormLabel>
                  <FormDescription>
                    The EBM tax is a Rwandan value-added tax.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={generateAIQuotation}
              className="flex-1"
            >
              <Wand className="mr-2 h-4 w-4" />
              AI Template
            </Button>

            <Button type="submit" disabled={isGenerating} className="flex-1">
              {isGenerating ? (
                "Generating..."
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" /> Generate Quotation
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {generatedQuote && <QuotationDisplay generatedQuote={generatedQuote} />}
    </div>
  );
}

function formatQuotation(quotation: any) {
  const formatter = new Intl.NumberFormat("en-RW", {
    style: "decimal",
    minimumFractionDigits: 0,
  });

  const formatCurrency = (amount: number) => {
    return `RWF ${amount.toLocaleString("en-US")}`;
  };

  return `
CENTURY CLEANING AGENCY
TIN: 120240444
Tel: 0783500312

Quotation ID: ${quotation.quotationId}                    Date: ${
    quotation.date
  }

CLIENT: ${quotation.client}
Location: ${quotation.location}

${quotation.items
  .map(
    (item: any, index: number) => `
${(index + 1).toString().padStart(2, "0")}. ${item.description}
   ${item.aiDescription ? `AI Description: ${item.aiDescription}` : ""}
   Unity: ${item.unity}   QTY: ${
      item.qty
    }   Price/Unit: RWF ${item.pricePerUnit.toLocaleString()}   Total: ${formatCurrency(
      item.totalPrice
    )}
`
  )
  .join("\n")}

${"-".repeat(80)}
Subtotal:         ${formatCurrency(quotation.subtotal)}
${
  quotation.includeEBM
    ? `EBM Tax (18%):    ${formatCurrency(quotation.tax)}`
    : ""
}
${"-".repeat(80)}
Grand Total:      ${formatCurrency(quotation.totalAmount)}

Grand Total Equals To ${numberToWords(quotation.totalAmount)} Rwandan Francs ${
    quotation.includeEBM ? "18% VAT included" : "VAT excluded"
  }.

Comment or Special Instructions:
${quotation.specialInstructions}

Our Services:
General Cleaning / Deep Cleaning / Window Cleaning / Sofa Cleaning / Tile And Grout Cleaning
Carpert cleaning / Janitors Cleaning / Fumigation And Pest Control / Event Cleanup
`;
}

function numberToWords(num: number): string {
  return num.toLocaleString("en-US", { style: "decimal" });
}
