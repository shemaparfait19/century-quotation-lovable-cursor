import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface QuotationEntry {
  id: number;
  date: string;
  content: string;
  preview: string;
}

interface RecentQuotationsProps {
  quotations: QuotationEntry[];
  onSelect: (content: string) => void;
  onDelete: (id: number) => void;
}

export function RecentQuotations({
  quotations,
  onSelect,
  onDelete,
}: RecentQuotationsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (itemToDelete !== null) {
      onDelete(itemToDelete);
      setOpenDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  const handleSelect = (content: string) => {
    console.log("Selecting quotation:", content.substring(0, 100) + "...");
    onSelect(content);
  };

  const filteredQuotations = quotations.filter(
    (quote) =>
      quote.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(quote.date).toLocaleDateString().includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="space-y-6">
      {quotations.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h3 className="text-lg font-medium">No Recent Quotations</h3>
          <p className="text-muted-foreground mt-2">
            Your recently created quotations will appear here
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Quotations</h3>
            <div className="w-1/3">
              <Input
                placeholder="Search quotations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-primary/10">
                <TableRow>
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold">Preview</TableHead>
                  <TableHead className="text-right font-bold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotations.map((quote) => (
                  <TableRow key={quote.id} className="hover:bg-gray-50">
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatDate(quote.date)}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {quote.preview}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelect(quote.content)}
                          className="border-2 border-gray-300 hover:border-primary hover:bg-primary/5"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(quote.id)}
                          className="border-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              quotation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
