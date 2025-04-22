import { Button } from "@/components/ui/button";
import { Plus, Wand } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServiceItemForm } from "./service-item-form";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

interface ServicesTableProps {
  form: UseFormReturn<any>;
  fieldArray: UseFieldArrayReturn<any>;
  onDescriptionEdit?: (index: number, description: string) => void;
  editableDescriptions?: { [key: number]: string };
}

export function ServicesTable({
  form,
  fieldArray,
  onDescriptionEdit,
  editableDescriptions,
}: ServicesTableProps) {
  const { fields, append, remove } = fieldArray;

  // Calculate the current subtotal
  const calculateSubtotal = () => {
    const items = form.getValues("items");
    return items.reduce((sum: number, item: any) => {
      return sum + item.qty * item.pricePerUnit;
    }, 0);
  };

  // AI optimization for services
  const optimizeServices = () => {
    const currentSubtotal = calculateSubtotal();
    const items = form.getValues("items");

    if (items.length === 0) {
      toast({
        title: "Cannot optimize",
        description: "Please add at least one service first.",
        variant: "destructive",
      });
      return;
    }

    // If there are more than 3 items, offer a "package deal" with a discount
    if (items.length >= 2) {
      const discountedItems = items.map((item: any) => ({
        ...item,
        // Apply a small discount to each service (5%)
        pricePerUnit: Math.round(item.pricePerUnit * 0.95),
      }));

      // Update each item with the discounted price
      discountedItems.forEach((item: any, index: number) => {
        form.setValue(`items.${index}.pricePerUnit`, item.pricePerUnit);
      });

      // Add a cleanup service as a bonus
      if (
        !items.some((item: any) =>
          item.description.toLowerCase().includes("cleanup")
        )
      ) {
        append({
          description: "Post-Service Cleanup (Complimentary)",
          unity: "service",
          qty: 1,
          pricePerUnit: 0,
        });
      }

      toast({
        title: "Package Optimized!",
        description:
          "We've applied a 5% discount to all services and added a complimentary cleanup service.",
      });
    } else {
      // Recommend adding more services
      toast({
        title: "Add more services",
        description: "Add at least 2 services to get a package discount!",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Services</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={optimizeServices}
            className="bg-blue-50 border-blue-200 hover:bg-blue-100"
          >
            <Wand className="w-4 h-4 mr-2 text-blue-500" />
            Optimize Package
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                description: "",
                unity: "-",
                qty: 1,
                pricePerUnit: 0,
              })
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px]">Unity</TableHead>
            <TableHead className="w-[100px]">QTY</TableHead>
            <TableHead className="w-[150px]">Price/Unit</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <ServiceItemForm
              key={field.id}
              index={index}
              form={form}
              onRemove={() => remove(index)}
              showRemoveButton={fields.length > 1}
              onDescriptionEdit={onDescriptionEdit}
              editableDescriptions={editableDescriptions}
            />
          ))}
        </TableBody>
      </Table>

      {/* Realtime calculation */}
      {fields.length > 0 && (
        <div className="text-right text-sm text-muted-foreground">
          Current Subtotal:{" "}
          {new Intl.NumberFormat("en-RW", {
            style: "currency",
            currency: "RWF",
            minimumFractionDigits: 0,
          }).format(calculateSubtotal())}
        </div>
      )}
    </div>
  );
}
