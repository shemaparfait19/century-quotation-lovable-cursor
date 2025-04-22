
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function Feature({ icon: Icon, title, description, delay = 0 }: FeatureProps) {
  const animationDelay = `${delay * 0.1}s`;
  
  return (
    <div 
      className="p-6 rounded-xl animate-fade-in-up"
      style={{ animationDelay }}
    >
      <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

interface FeatureSectionProps {
  className?: string;
  features: FeatureProps[];
  title: string;
  subtitle: string;
}

export function FeatureSection({ className, features, title, subtitle }: FeatureSectionProps) {
  return (
    <section className={cn("py-20", className)}>
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">{title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} delay={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
