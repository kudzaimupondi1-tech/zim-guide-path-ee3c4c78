import { Check, Star, Zap, Shield, MessageSquare, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const premiumFeatures = [
  {
    icon: TrendingUp,
    title: "Full Subject Analysis",
    description: "Get comprehensive analysis of your subject combinations and how they align with your career goals.",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot Access",
    description: "Unlimited access to our AI-powered guidance assistant for personalized advice.",
  },
  {
    icon: Shield,
    title: "Priority Support",
    description: "Get priority responses and dedicated support for your academic queries.",
  },
];

const comparisonFeatures = [
  { feature: "O-Level to A-Level guidance", free: true, premium: true },
  { feature: "Basic career exploration", free: true, premium: true },
  { feature: "University search", free: "Limited", premium: true },
  { feature: "Subject combination analysis", free: false, premium: true },
  { feature: "Detailed career pathways", free: false, premium: true },
  { feature: "AI chatbot assistance", free: false, premium: true },
  { feature: "Entry requirement details", free: false, premium: true },
  { feature: "Priority recommendations", free: false, premium: true },
];

const PremiumPage = () => {
  const handlePayment = () => {
    toast.info("EcoCash payment integration coming soon! For now, please contact us directly.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-semibold mb-4">
              <Zap className="w-4 h-4" />
              Premium Access
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Unlock Your Full Potential
            </h1>
            <p className="text-muted-foreground text-lg">
              Get comprehensive academic guidance and unlock all features for just $2 via EcoCash
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-lg mx-auto mb-16">
            <div className="relative p-8 rounded-2xl bg-card border-2 border-secondary shadow-glow">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold">
                  <Star className="w-4 h-4" />
                  Best Value
                </span>
              </div>

              <div className="text-center mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Premium Plan
                </h2>
                <p className="text-muted-foreground">Complete academic guidance package</p>
              </div>

              <div className="text-center mb-8">
                <span className="text-6xl font-bold text-foreground">$2</span>
                <span className="text-muted-foreground ml-2">USD</span>
                <p className="text-muted-foreground mt-2">One-time payment</p>
              </div>

              <ul className="space-y-4 mb-8">
                {comparisonFeatures.filter(f => f.premium === true).map((item) => (
                  <li key={item.feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-foreground">{item.feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant="hero" 
                size="xl" 
                className="w-full"
                onClick={handlePayment}
              >
                Pay with EcoCash
              </Button>

              <p className="text-center text-muted-foreground text-sm mt-4">
                Secure payment • Instant access
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">
              What's Included
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {premiumFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 opacity-0 animate-fadeUp"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">
              Free vs Premium
            </h2>
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="grid grid-cols-3 bg-muted p-4 font-semibold">
                <div className="text-foreground">Feature</div>
                <div className="text-center text-foreground">Free</div>
                <div className="text-center text-foreground">Premium</div>
              </div>
              {comparisonFeatures.map((item, index) => (
                <div 
                  key={item.feature} 
                  className={`grid grid-cols-3 p-4 ${index % 2 === 0 ? "bg-card" : "bg-muted/30"}`}
                >
                  <div className="text-foreground">{item.feature}</div>
                  <div className="text-center">
                    {item.free === true ? (
                      <Check className="w-5 h-5 text-accent mx-auto" />
                    ) : item.free === false ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">{item.free}</span>
                    )}
                  </div>
                  <div className="text-center">
                    <Check className="w-5 h-5 text-secondary mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto mt-16">
            <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-2">How do I pay?</h3>
                <p className="text-muted-foreground">
                  We accept payments via EcoCash. Simply click the payment button and follow the prompts to complete your payment.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-2">Is this a one-time payment?</h3>
                <p className="text-muted-foreground">
                  Yes! The $2 USD payment gives you lifetime access to all premium features.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-2">When do I get access?</h3>
                <p className="text-muted-foreground">
                  Access is instant! Once your EcoCash payment is confirmed, premium features are unlocked immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PremiumPage;
