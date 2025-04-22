import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { ContactForm } from "@/components/ui/contact-form";
import { QuotationDisplay } from "@/components/ui/quotation-display";
import { RecentQuotations } from "@/components/ui/recent-quotations";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

export default function Quotation() {
  const [generatedQuote, setGeneratedQuote] = useState<string | null>(null);
  const [recentQuotations, setRecentQuotations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("create");
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);

  // Load recent quotations from localStorage
  useEffect(() => {
    const savedQuotations = localStorage.getItem("recentQuotations");
    if (savedQuotations) {
      try {
        const parsed = JSON.parse(savedQuotations);
        console.log("Loaded quotations:", parsed);
        setRecentQuotations(parsed);
      } catch (error) {
        console.error("Error parsing saved quotations:", error);
        toast({
          title: "Error",
          description: "Failed to load recent quotations",
          variant: "destructive",
        });
      }
    }
  }, []);

  // Save generated quotation to recent list
  useEffect(() => {
    if (generatedQuote && !isLoadingRecent) {
      const newQuotation = {
        id: Date.now(),
        date: new Date().toISOString(),
        content: generatedQuote,
        preview:
          generatedQuote.split("\n").slice(0, 3).join(" ").substring(0, 80) +
          "...",
      };

      const newQuotations = [newQuotation, ...recentQuotations].slice(0, 10); // Keep only the 10 most recent
      console.log("Saving new quotation:", newQuotation);
      console.log("Updated quotations list:", newQuotations);

      setRecentQuotations(newQuotations);
      localStorage.setItem("recentQuotations", JSON.stringify(newQuotations));
    }
  }, [generatedQuote, isLoadingRecent]);

  const handleQuotationGenerated = (quote: string) => {
    console.log("New quotation generated");
    setIsLoadingRecent(false);
    setGeneratedQuote(quote);
  };

  const loadSavedQuotation = (content: string) => {
    console.log("Loading saved quotation");
    setIsLoadingRecent(true);
    setGeneratedQuote(content);
    setActiveTab("create");
    toast({
      title: "Quotation Loaded",
      description: "The selected quotation has been loaded",
    });
  };

  const handleDeleteQuotation = (id: number) => {
    console.log("Deleting quotation:", id);
    const updated = recentQuotations.filter((q) => q.id !== id);
    setRecentQuotations(updated);
    localStorage.setItem("recentQuotations", JSON.stringify(updated));
    toast({
      title: "Quotation Deleted",
      description: "The quotation has been removed from recent list",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6 md:py-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AI-Powered Price Quotation
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6">
                Get an instant price estimate for Century Cleaning Agency's
                services
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 transform transition-all hover:scale-105 duration-300">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-semibold mb-4">
                    1
                  </span>
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Fill Client Details
                  </h3>
                  <p className="text-sm text-blue-600">
                    Enter client information or use AI to find existing clients
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 transform transition-all hover:scale-105 duration-300">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white font-semibold mb-4">
                    2
                  </span>
                  <h3 className="font-semibold text-green-800 mb-2">
                    Add Services
                  </h3>
                  <p className="text-sm text-green-600">
                    Add services with AI-recommended pricing or customize
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 transform transition-all hover:scale-105 duration-300">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-500 text-white font-semibold mb-4">
                    3
                  </span>
                  <h3 className="font-semibold text-purple-800 mb-2">
                    Generate & Share
                  </h3>
                  <p className="text-sm text-purple-600">
                    Create professional quotation to print, download or email
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="mt-4"
              >
                <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
                  <TabsTrigger
                    value="create"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Create New Quotation
                  </TabsTrigger>
                  <TabsTrigger
                    value="recent"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Recent Quotations
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="space-y-6">
                  <ContactForm
                    onQuotationGenerated={handleQuotationGenerated}
                  />
                </TabsContent>

                <TabsContent value="recent" className="space-y-6">
                  <RecentQuotations
                    quotations={recentQuotations}
                    onSelect={loadSavedQuotation}
                    onDelete={handleDeleteQuotation}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <QuotationDisplay generatedQuote={generatedQuote} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
