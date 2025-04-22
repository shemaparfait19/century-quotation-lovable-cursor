
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface CTASectionProps {
  className?: string;
  title: string;
  subtitle: string;
  primaryAction: {
    text: string;
    href: string;
  };
  secondaryAction?: {
    text: string;
    href: string;
  };
}

export function CTASection({ className, title, subtitle, primaryAction, secondaryAction }: CTASectionProps) {
  return (
    <section className={cn("py-20", className)}>
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">{title}</h2>
          <p className="text-xl text-muted-foreground mb-8">{subtitle}</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="text-base" asChild>
              {primaryAction.href.startsWith('/') ? (
                <Link to={primaryAction.href}>{primaryAction.text}</Link>
              ) : (
                <a href={primaryAction.href}>{primaryAction.text}</a>
              )}
            </Button>
            
            {secondaryAction && (
              <Button variant="outline" size="lg" className="text-base" asChild>
                {secondaryAction.href.startsWith('/') ? (
                  <Link to={secondaryAction.href}>{secondaryAction.text}</Link>
                ) : (
                  <a href={secondaryAction.href}>{secondaryAction.text}</a>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
