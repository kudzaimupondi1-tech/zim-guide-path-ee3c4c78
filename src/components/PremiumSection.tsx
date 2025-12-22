import { Check, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Basic guidance to get you started",
    features: [
      "O-Level to A-Level guidance",
      "Basic career exploration",
      "Limited university search",
      "Community support",
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Premium",
    price: "$2",
    period: "one-time",
    description: "Complete academic guidance package",
    features: [
      "Full subject combination analysis",
      "Detailed career pathways",
      "Complete university matching",
      "AI chatbot assistance",
      "Priority recommendations",
      "Entry requirement details",
    ],
    cta: "Upgrade Now",
    variant: "hero" as const,
    popular: true,
  },
];

const PremiumSection = () => {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-semibold mb-4">
            <Zap className="w-4 h-4 inline mr-1" />
            Premium Access
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Unlock Your Full Potential
          </h2>
          <p className="text-muted-foreground text-lg">
            Get comprehensive academic guidance for just $2 via EcoCash
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${
                plan.popular
                  ? "bg-card border-secondary shadow-glow"
                  : "bg-card border-border hover:border-primary/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground ml-2">/{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      plan.popular ? "text-secondary" : "text-accent"
                    }`} />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant={plan.variant} size="lg" className="w-full" asChild>
                <Link to={plan.popular ? "/premium" : "/guidance"}>
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Payment Note */}
        <p className="text-center text-muted-foreground mt-8">
          Secure payment via EcoCash • Instant access after payment
        </p>
      </div>
    </section>
  );
};

export default PremiumSection;
