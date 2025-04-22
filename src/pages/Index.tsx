
import { Header } from "@/components/ui/header";
import { HeroSection } from "@/components/ui/hero-section";
import { FeatureSection } from "@/components/ui/feature-section";
import { TestimonialSection } from "@/components/ui/testimonial-section";
import { CTASection } from "@/components/ui/cta-section";
import { Footer } from "@/components/ui/footer";
import { 
  Zap, 
  Shield, 
  BarChart, 
  Smartphone, 
  Code, 
  Sparkles 
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for performance with optimized components that render quickly and efficiently."
  },
  {
    icon: Shield,
    title: "Secure By Design",
    description: "Enterprise-grade security baked in at every level to keep your data and users safe."
  },
  {
    icon: Smartphone,
    title: "Fully Responsive",
    description: "Looks and works great on devices of all sizes, from phones to large desktop monitors."
  },
  {
    icon: BarChart,
    title: "Data Driven",
    description: "Make better decisions with comprehensive analytics and visualization tools."
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "Clean APIs and comprehensive documentation make integration a breeze."
  },
  {
    icon: Sparkles,
    title: "Beautiful UI",
    description: "Stunning interfaces that delight users and enhance the overall experience."
  }
];

const testimonials = [
  {
    content: "This platform completely transformed our workflow. We've seen a 40% increase in productivity since implementing it.",
    author: {
      name: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      avatar: "https://i.pravatar.cc/150?img=1"
    }
  },
  {
    content: "The intuitive design and powerful features make this the best solution we've found. Our team was up and running in minutes.",
    author: {
      name: "Mark Williams",
      role: "CTO at StartupX",
      avatar: "https://i.pravatar.cc/150?img=2"
    }
  },
  {
    content: "Customer support is outstanding. Any questions we had were answered promptly and thoroughly. Highly recommend!",
    author: {
      name: "Emily Chen",
      role: "Operations Director",
      avatar: "https://i.pravatar.cc/150?img=3"
    }
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        <FeatureSection 
          title="Powerful Features" 
          subtitle="Everything you need to build amazing products"
          features={features} 
        />
        
        <TestimonialSection 
          title="What Our Customers Say" 
          subtitle="Join thousands of satisfied users worldwide"
          testimonials={testimonials} 
        />
        
        <CTASection 
          title="Ready to Get Started?" 
          subtitle="Join thousands of companies already using our platform"
          primaryAction={{
            text: "Start Free Trial",
            href: "#"
          }}
          secondaryAction={{
            text: "Contact Sales",
            href: "#"
          }}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
