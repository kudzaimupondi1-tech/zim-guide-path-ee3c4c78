import { BookOpen, GraduationCap, Compass, Building2, TrendingUp, MessageSquare } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "O-Level Guidance",
    description: "Input your O-Level subjects and interests to get personalized A-Level subject recommendations.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: GraduationCap,
    title: "A-Level Matching",
    description: "Match your A-Level subjects and grades to find the perfect university programs in Zimbabwe.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Building2,
    title: "University Database",
    description: "Explore 15+ public and private universities across Zimbabwe with detailed program information.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Compass,
    title: "Career Pathways",
    description: "Discover career outcomes linked to your chosen subjects and degree programs.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: TrendingUp,
    title: "ZIMSEC Aligned",
    description: "All recommendations follow ZIMSEC requirements and Zimbabwean university entry standards.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot",
    description: "Get instant answers to your academic questions with our intelligent guidance assistant.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Features
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need for Academic Success
          </h2>
          <p className="text-muted-foreground text-lg">
            Comprehensive guidance tools designed specifically for Zimbabwean students
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 opacity-0 animate-fadeUp"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
