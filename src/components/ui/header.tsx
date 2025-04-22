import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-lg shadow-sm"
          : "bg-transparent",
        className
      )}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between">
          <a href="/" className="text-2xl font-bold">
            Century <span className="text-primary">Quotation sys</span>
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden sm:inline-flex">
              Log in
            </Button>
            <Button>Sign up</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
