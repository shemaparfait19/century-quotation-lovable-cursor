import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash, Wand } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ServiceDescriptionAI } from "./service-description-ai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServiceItemFormProps {
  index: number;
  form: UseFormReturn<any>;
  onRemove: () => void;
  showRemoveButton: boolean;
  onDescriptionEdit?: (index: number, description: string) => void;
  editableDescriptions?: { [key: number]: string };
}

const commonServices = [
  {
    description: "General Cleaning - Office Space",
    unity: "sq.m",
    pricePerUnit: 500,
  },
  {
    description: "Deep Cleaning - Residential",
    unity: "room",
    pricePerUnit: 12000,
  },
  { description: "Window Cleaning", unity: "window", pricePerUnit: 2500 },
  { description: "Carpet Cleaning", unity: "sq.m", pricePerUnit: 3500 },
  { description: "Sofa Cleaning", unity: "seat", pricePerUnit: 8000 },
  { description: "Tile and Grout Cleaning", unity: "sq.m", pricePerUnit: 4500 },
  { description: "Janitor Service", unity: "day", pricePerUnit: 15000 },
  {
    description: "Fumigation and Pest Control",
    unity: "treatment",
    pricePerUnit: 25000,
  },
  { description: "Event Cleanup", unity: "event", pricePerUnit: 35000 },
];

export function ServiceItemForm({
  index,
  form,
  onRemove,
  showRemoveButton,
  onDescriptionEdit,
  editableDescriptions,
}: ServiceItemFormProps) {
  const [suggestions, setSuggestions] = useState<
    Array<(typeof commonServices)[0]>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleDescriptionChange = (value: string) => {
    if (value.length > 2) {
      const matches = commonServices.filter((service) =>
        service.description.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    form.setValue(`items.${index}.description`, value);
  };

  const applySuggestion = (suggestion: (typeof commonServices)[0]) => {
    form.setValue(`items.${index}.description`, suggestion.description);
    form.setValue(`items.${index}.unity`, suggestion.unity);
    form.setValue(`items.${index}.pricePerUnit`, suggestion.pricePerUnit);
    setShowSuggestions(false);
  };

  const recommendPrice = () => {
    const description = form.getValues(`items.${index}.description`);
    const match = commonServices.find(
      (service) =>
        service.description.toLowerCase() === description.toLowerCase() ||
        service.description.toLowerCase().includes(description.toLowerCase())
    );

    if (match) {
      form.setValue(`items.${index}.pricePerUnit`, match.pricePerUnit);
      form.setValue(`items.${index}.unity`, match.unity);
    }
  };

  const handleDescriptionEdit = (description: string) => {
    if (onDescriptionEdit) {
      onDescriptionEdit(index, description);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name={`items.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Service description"
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ServiceDescriptionAI
            serviceTitle={form.getValues(`items.${index}.description`)}
            onDescriptionEdit={handleDescriptionEdit}
            initialDescription={editableDescriptions?.[index]}
          />
          {showSuggestions && (
            <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 border border-gray-200 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, i) => (
                <div
                  key={i}
                  className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                  onClick={() => applySuggestion(suggestion)}
                >
                  {suggestion.description}
                </div>
              ))}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`items.${index}.unity`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sq.m">Square Meter</SelectItem>
                    <SelectItem value="hour">Hour</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="room">Room</SelectItem>
                    <SelectItem value="window">Window</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`items.${index}.qty`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <FormField
            control={form.control}
            name={`items.${index}.pricePerUnit`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={recommendPrice}
            title="AI Price Recommendation"
          >
            <Wand className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
      <TableCell>
        {showRemoveButton && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
