import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Download, FileDown, Mail, Printer, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePDF } from "react-to-pdf";
import { sendEmail } from "@/lib/api";

interface QuotationDisplayProps {
  generatedQuote: string | null;
}

export function QuotationDisplay({ generatedQuote }: QuotationDisplayProps) {
  const [isSending, setIsSending] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const { toPDF, targetRef } = usePDF({
    filename: "Century_Cleaning_Quotation.pdf",
    page: { margin: 20 },
  });

  if (!generatedQuote) return null;

  const handleEmailQuotation = async () => {
    if (!emailTo && !isSending) {
      toast({
        title: "Enter email",
        description: "Please enter an email address to send the quotation.",
      });
      return;
    }

    setIsSending(true);

    try {
      // Generate PDF
      const pdfBlob = await toPDF();

      // Convert PDF to base64
      const reader = new FileReader();
      const pdfBase64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64data = reader.result as string;
          resolve(base64data.split(",")[1]);
        };
        reader.readAsDataURL(pdfBlob as unknown as Blob);
      });

      // Send email
      await sendEmail({
        to: emailTo,
        subject: "Century Cleaning Agency - Your Quotation",
        content: generatedQuote,
        attachment: pdfBase64,
      });

      toast({
        title: "Success",
        description: `Quotation has been sent to ${emailTo}`,
      });

      setEmailTo("");
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getParsedContent = () => {
    const lines = generatedQuote.split("\n");

    const companyInfo = lines.slice(0, 3).join("\n");
    const quotationInfo = lines.slice(4, 6).join("\n");
    const clientInfo = lines.slice(7, 9).join("\n");

    const itemStartIndex = lines.findIndex((line) =>
      line.trim().startsWith("01.")
    );
    const dashLineIndex = lines.findIndex((line) =>
      line.includes("-".repeat(10))
    );

    if (itemStartIndex === -1 || dashLineIndex === -1) {
      return null;
    }

    const items = [];
    for (let i = itemStartIndex; i < dashLineIndex; i++) {
      const line = lines[i].trim();
      if (line.match(/^\d{2}\./)) {
        const itemMatch = line.match(/^(\d{2})\.\s+(.+)/);
        if (itemMatch) {
          const [, num, description] = itemMatch;

          let aiDescription = "";
          let detailsLine = "";

          if (lines[i + 1]?.trim().startsWith("AI Description:")) {
            aiDescription = lines[i + 1].replace("AI Description:", "").trim();
            detailsLine = lines[i + 2]?.trim() || "";
          } else {
            detailsLine = lines[i + 1]?.trim() || "";
          }

          const unityMatch = detailsLine.match(/Unity:\s+(.+?)\s+QTY:/);
          const qtyMatch = detailsLine.match(/QTY:\s+(\d+)/);
          const priceMatch = detailsLine.match(
            /Price\/Unit:\s+RWF\s+(\d+(?:,\d{3})*)/
          );
          const totalMatch = detailsLine.match(/Total:\s+(.+)/);

          items.push({
            num,
            description,
            aiDescription,
            unity: unityMatch ? unityMatch[1] : "",
            qty: qtyMatch ? qtyMatch[1] : "",
            pricePerUnit: priceMatch ? priceMatch[1].replace(/,/g, "") : "",
            total: totalMatch ? totalMatch[1] : "",
          });
        }
      }
    }

    const totals = lines.slice(dashLineIndex + 1, dashLineIndex + 4);
    const grandTotal =
      lines.find((line) => line.includes("Grand Total:"))?.trim() || "";
    const totalInWords =
      lines.find((line) => line.includes("Grand Total Equals To"))?.trim() ||
      "";

    const commentIndex = lines.findIndex((line) =>
      line.includes("Comment or Special Instructions:")
    );
    const comment =
      commentIndex !== -1
        ? lines.slice(commentIndex + 1, commentIndex + 3).join("\n")
        : "";

    const servicesIndex = lines.findIndex((line) =>
      line.includes("Our Services:")
    );
    const services =
      servicesIndex !== -1 ? lines.slice(servicesIndex + 1).join("\n") : "";

    return {
      companyInfo,
      quotationInfo,
      clientInfo,
      items,
      totals,
      grandTotal,
      totalInWords,
      comment,
      services,
    };
  };

  const content = getParsedContent();

  if (!content) {
    return (
      <div className="p-6 bg-muted rounded-lg border mt-8">
        <div className="text-center p-8">
          <h3 className="text-xl font-bold">Unable to parse quotation data</h3>
          <p className="mt-2">The quotation format is not recognized.</p>
        </div>

        <div className="whitespace-pre-line font-mono text-sm mt-4 print:hidden">
          {generatedQuote}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 animate-fade-in">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border-2 border-gray-200 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Your Quotation
          </h3>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="w-full md:w-[300px]">
              <Input
                type="email"
                placeholder="Enter email (optional)"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                className="w-full h-12 text-base border-2 border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg shadow-sm hover:border-gray-500 transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="text-sm flex-1 md:flex-none h-12 border-2 border-gray-400 hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Printer className="mr-2 h-5 w-5" /> Print
              </Button>
              <Button
                variant="secondary"
                onClick={handleEmailQuotation}
                disabled={isSending}
                className="text-sm flex-1 md:flex-none h-12 bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all"
              >
                <Mail className="mr-2 h-5 w-5" />
                {isSending ? "Sending..." : "Email"}
              </Button>
              <Button
                onClick={() => toPDF()}
                variant="default"
                className="text-sm flex-1 md:flex-none h-12 bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all"
              >
                <FileDown className="mr-2 h-5 w-5" /> PDF
              </Button>
            </div>
          </div>
        </div>

        <div
          ref={targetRef}
          className="bg-white p-4 md:p-8 rounded-xl border-2 border-gray-200 shadow-sm print:shadow-none"
        >
          <div className="text-center mb-6 md:mb-8">
            <img
              src="/header.jpg"
              alt="Century Cleaning Agency Header"
              className="max-w-full h-auto mx-auto"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-gray-50 p-4 md:p-6 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg mb-2 text-primary">CLIENT:</h3>
              <p className="whitespace-pre-line text-sm md:text-base">
                {content.clientInfo.replace("CLIENT:", "").trim()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 md:p-6 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow text-right">
              <p className="font-bold text-lg mb-2 text-primary">
                {content.quotationInfo.split("Date:")[0].trim()}
              </p>
              <p className="text-sm md:text-base">
                Date:{" "}
                <span className="font-semibold">
                  {content.quotationInfo.split("Date:")[1]?.trim()}
                </span>
              </p>
            </div>
          </div>

          <div className="overflow-x-auto mb-6 md:mb-8">
            <Table>
              <TableHeader className="bg-primary/10 border-2 border-gray-200">
                <TableRow>
                  <TableHead className="font-bold w-12 md:w-16 text-base border-r border-gray-200">
                    #
                  </TableHead>
                  <TableHead className="font-bold text-base border-r border-gray-200">
                    Description
                  </TableHead>
                  <TableHead className="font-bold hidden md:table-cell text-base border-r border-gray-200">
                    Details
                  </TableHead>
                  <TableHead className="font-bold text-base border-r border-gray-200">
                    Unity
                  </TableHead>
                  <TableHead className="font-bold text-base border-r border-gray-200">
                    QTY
                  </TableHead>
                  <TableHead className="font-bold text-base border-r border-gray-200">
                    Price/Unit
                  </TableHead>
                  <TableHead className="font-bold text-right text-base">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {content.items.map((item, index) => (
                  <TableRow
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : ""
                    } hover:bg-gray-100 transition-colors border-b border-gray-200`}
                  >
                    <TableCell className="text-sm md:text-base font-medium border-r border-gray-200">
                      {item.num}
                    </TableCell>
                    <TableCell className="font-medium text-sm md:text-base border-r border-gray-200">
                      {item.description}
                      {item.aiDescription && (
                        <p className="text-xs text-muted-foreground md:hidden mt-1">
                          {item.aiDescription}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden md:table-cell border-r border-gray-200">
                      {item.aiDescription}
                    </TableCell>
                    <TableCell className="text-sm md:text-base font-medium border-r border-gray-200">
                      {item.unity}
                    </TableCell>
                    <TableCell className="text-sm md:text-base font-medium border-r border-gray-200">
                      {item.qty}
                    </TableCell>
                    <TableCell className="text-sm md:text-base font-medium border-r border-gray-200">
                      {Number(item.pricePerUnit).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm md:text-base">
                      {item.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end mb-6">
            <div className="w-full md:w-1/2">
              {content.totals.map((total, index) => {
                const [label, value] = total.split(":").map((s) => s.trim());
                return (
                  <div
                    key={index}
                    className={`flex justify-between py-3 px-4 text-sm md:text-base border-b-2 border-gray-200 ${
                      index === content.totals.length - 1
                        ? "bg-primary/10 font-bold rounded"
                        : ""
                    }`}
                  >
                    <span className="font-medium">{label}:</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                );
              })}
              <div className="flex justify-between py-4 px-4 bg-primary text-white font-bold rounded mt-2 text-sm md:text-base shadow-md">
                <span>Grand Total:</span>
                <span>{content.grandTotal.split(":")[1]?.trim()}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 mb-6 rounded-xl border-2 border-gray-200 shadow-sm">
            <p className="font-medium text-center text-sm md:text-base">
              {content.totalInWords}
            </p>
          </div>

          <div className="mb-6 border-2 border-gray-200 p-4 rounded-xl shadow-sm">
            <h4 className="font-bold mb-2 text-primary text-sm md:text-base">
              Comment or Special Instructions:
            </h4>
            <p className="text-sm md:text-base">{content.comment}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200 shadow-sm">
            <h4 className="font-bold mb-2 text-primary text-sm md:text-base">
              Our Services:
            </h4>
            <div className="flex flex-wrap gap-2">
              {content.services.split("/").map((service, index) => (
                <span
                  key={index}
                  className="bg-primary/10 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium hover:bg-primary/20 transition-colors border border-primary/20"
                >
                  {service.trim()}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-gray-200 text-center">
            <p className="font-semibold text-primary text-sm md:text-base">
              Thank you for choosing Century Cleaning Agency.
            </p>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              This quotation is valid for 30 days from the date of issue.
            </p>
          </div>
        </div>
      </div>

      <div className="whitespace-pre-line font-mono text-xs md:text-sm mt-6 p-4 bg-gray-100 rounded-xl border-2 border-gray-200 print:hidden">
        <h4 className="font-bold mb-2">Raw Quotation Data:</h4>
        {generatedQuote}
      </div>
    </div>
  );
}
