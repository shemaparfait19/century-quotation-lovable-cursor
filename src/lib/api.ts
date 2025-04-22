import { toast } from "@/hooks/use-toast";

interface EmailData {
  to: string;
  subject: string;
  content: string;
  attachment?: string;
}

export async function sendEmail(data: EmailData): Promise<void> {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send email");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
