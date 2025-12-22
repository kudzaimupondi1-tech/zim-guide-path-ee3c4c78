import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const universities = [
  {
    name: "University of Zimbabwe",
    shortName: "UZ",
    type: "Public",
    location: "Harare",
    programs: 85,
    color: "bg-primary",
  },
  {
    name: "National University of Science and Technology",
    shortName: "NUST",
    type: "Public",
    location: "Bulawayo",
    programs: 62,
    color: "bg-accent",
  },
  {
    name: "Midlands State University",
    shortName: "MSU",
    type: "Public",
    location: "Gweru",
    programs: 54,
    color: "bg-secondary",
  },
  {
    name: "Africa University",
    shortName: "AU",
    type: "Private",
    location: "Mutare",
    programs: 38,
    color: "bg-primary",
  },
  {
    name: "Chinhoyi University of Technology",
    shortName: "CUT",
    type: "Public",
    location: "Chinhoyi",
    programs: 42,
    color: "bg-accent",
  },
  {
    name: "Harare Institute of Technology",
    shortName: "HIT",
    type: "Public",
    location: "Harare",
    programs: 35,
    color: "bg-secondary",
  },
];

const UniversitiesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-semibold mb-4">
            Universities
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Top Zimbabwean Universities
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore degree programs from leading public and private universities across the country
          </p>
        </div>

        {/* Universities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((uni, index) => (
            <div
              key={uni.name}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden opacity-0 animate-scaleIn"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              {/* Accent Bar */}
              <div className={`absolute top-0 left-0 w-full h-1 ${uni.color}`} />
              
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl ${uni.color} flex items-center justify-center`}>
                  <span className="text-lg font-bold text-primary-foreground">{uni.shortName}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  uni.type === "Public" 
                    ? "bg-accent/10 text-accent" 
                    : "bg-secondary/20 text-secondary-foreground"
                }`}>
                  {uni.type}
                </span>
              </div>

              <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {uni.name}
              </h3>

              <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                <MapPin className="w-4 h-4" />
                <span>{uni.location}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{uni.programs}</span> programs
                </span>
                <Button variant="ghost" size="sm" className="group/btn">
                  View Details
                  <ExternalLink className="w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to="/universities">
              View All Universities
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UniversitiesSection;
