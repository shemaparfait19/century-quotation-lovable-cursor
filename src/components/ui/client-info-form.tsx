import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, Calendar } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ClientInfoFormProps {
  form: UseFormReturn<any>;
}

export function ClientInfoForm({ form }: ClientInfoFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="client"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client Name</FormLabel>
            <FormControl>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-muted-foreground" />
                <Input placeholder="Client name" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="Location" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <Input type="date" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
