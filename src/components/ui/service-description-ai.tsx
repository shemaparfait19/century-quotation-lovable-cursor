import { useState, useEffect } from "react";
import { Loader2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ServiceDescriptionAIProps {
  serviceTitle: string;
  onDescriptionEdit?: (description: string) => void;
  initialDescription?: string;
}

export function ServiceDescriptionAI({
  serviceTitle,
  onDescriptionEdit,
  initialDescription,
}: ServiceDescriptionAIProps) {
  const [description, setDescription] = useState(initialDescription || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");

  useEffect(() => {
    const generateDescription = async () => {
      if (!serviceTitle || serviceTitle.length < 3) return;

      setIsLoading(true);
      const descriptions: { [key: string]: string } = {
        door: "Cleaning of Doors - Dusting, polishing, and removal of stains or paint residues from all house doors.",
        window:
          "Window Cleaning - Professional cleaning of all windows, frames, and sills, removing dirt, streaks, and built-up grime.",
        carpet:
          "Carpet Deep Cleaning - Thorough cleaning using hot water extraction, removing deep-seated dirt, stains, and allergens.",
        office:
          "Office Space Cleaning - Complete cleaning of workstations, meeting rooms, and common areas, including dusting and sanitization.",
        residential:
          "Residential Cleaning - Comprehensive house cleaning including all rooms, bathrooms, and kitchen areas.",
        sofa: "Upholstery Cleaning - Deep cleaning of sofas and furniture, removing stains and refreshing fabric.",
        floor:
          "Floor Maintenance - Professional cleaning and polishing of different floor types including hardwood, tile, and vinyl.",
        bathroom:
          "Bathroom Deep Clean - Thorough cleaning and sanitization of all bathroom fixtures, tiles, and surfaces.",
        kitchen:
          "Kitchen Cleaning - Deep cleaning of all kitchen surfaces, appliances, and cabinets, removing grease and food residue.",
        tile: "Tile and Grout Cleaning - Restoring tiles to their original appearance, cleaning and sealing grout lines.",
        general:
          "General Cleaning - Standard cleaning service including dusting, vacuuming, and surface sanitization.",
      };

      const match = Object.keys(descriptions).find((key) =>
        serviceTitle.toLowerCase().includes(key)
      );

      setTimeout(() => {
        const newDescription = match ? descriptions[match] : "";
        setDescription(newDescription);
        setEditedDescription(newDescription);
        setIsLoading(false);
      }, 500);
    };

    if (!initialDescription) {
      generateDescription();
    }
  }, [serviceTitle, initialDescription]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedDescription(description);
  };

  const handleSave = () => {
    setDescription(editedDescription);
    if (onDescriptionEdit) {
      onDescriptionEdit(editedDescription);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDescription(description);
    setIsEditing(false);
  };

  if (!description && !isLoading) return null;

  return (
    <div className="mt-2 text-sm">
      {isLoading ? (
        <div className="flex items-center text-muted-foreground">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Analyzing service...
        </div>
      ) : isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Edit AI description"
            className="min-h-[100px]"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleSave}>
              <Check className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-100 rounded p-2 mt-1">
          <div className="flex justify-between items-start">
            <p className="text-blue-700">{description}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className="h-6 w-6"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
