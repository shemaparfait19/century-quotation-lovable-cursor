
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

interface TestimonialProps {
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  className?: string;
}

export function Testimonial({ content, author, className }: TestimonialProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-4">
        <div className="w-10 h-10 text-4xl opacity-20">"</div>
      </CardHeader>
      <CardContent className="pb-6">
        <p className="text-lg">{content}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{author.name}</p>
            <p className="text-sm text-muted-foreground">{author.role}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

interface TestimonialSectionProps {
  className?: string;
  testimonials: TestimonialProps[];
  title: string;
  subtitle: string;
}

export function TestimonialSection({ className, testimonials, title, subtitle }: TestimonialSectionProps) {
  return (
    <section className={cn("py-20 bg-muted/50", className)}>
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">{title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="animate-fade-in-up" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Testimonial {...testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
