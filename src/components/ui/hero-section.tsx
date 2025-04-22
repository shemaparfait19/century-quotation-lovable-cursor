
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 hero-gradient opacity-30" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20" />
      
      <div className="container px-4 py-24 sm:py-32 md:py-40 mx-auto">
        <div className="flex flex-col items-center text-center animate-fade-in-up">
          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6">
            Century <span className="highlight-text">Cleaning</span> Agency
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8">
            Professional cleaning services for homes and offices with instant AI-powered price quotations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="text-base" asChild>
              <Link to="/quotation">Get a Quote</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
