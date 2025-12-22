import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    title: "Select Your Level",
    description: "Choose whether you're an O-Level or A-Level student to get tailored guidance.",
  },
  {
    number: "02",
    title: "Input Your Subjects",
    description: "Enter your current subjects, grades, and areas of interest for analysis.",
  },
  {
    number: "03",
    title: "Get Recommendations",
    description: "Receive personalized subject combinations, university matches, and career paths.",
  },
  {
    number: "04",
    title: "Plan Your Future",
    description: "Explore detailed information about universities, programs, and career outcomes.",
  },
];

const benefits = [
  "Aligned with ZIMSEC curriculum",
  "Updated university requirements",
  "Local career opportunities",
  "Expert AI guidance",
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
              How It Works
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Your Path to Success in{" "}
              <span className="text-gradient">4 Simple Steps</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Our intelligent system analyzes your academic profile and matches you with 
              the best opportunities available in Zimbabwe's education landscape.
            </p>

            {/* Benefits List */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <Button variant="hero" size="lg" asChild>
              <Link to="/guidance" className="group">
                Start Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Right Content - Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="flex gap-6 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 opacity-0 animate-slideInRight"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">{step.number}</span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
