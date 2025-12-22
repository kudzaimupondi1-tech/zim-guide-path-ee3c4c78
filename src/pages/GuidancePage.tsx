import { useState } from "react";
import { ArrowRight, BookOpen, GraduationCap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

type Level = "o-level" | "a-level" | null;

const GuidancePage = () => {
  const [selectedLevel, setSelectedLevel] = useState<Level>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              Academic Guidance
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Select Your Education Level
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose your current level to receive personalized academic guidance aligned with ZIMSEC requirements
            </p>
          </div>

          {/* Level Selection */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* O-Level Card */}
            <button
              onClick={() => setSelectedLevel("o-level")}
              className={`group relative p-8 rounded-2xl border-2 text-left transition-all duration-300 ${
                selectedLevel === "o-level"
                  ? "bg-primary border-primary"
                  : "bg-card border-border hover:border-primary/50 hover:shadow-lg"
              }`}
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                selectedLevel === "o-level"
                  ? "bg-secondary"
                  : "bg-primary/10 group-hover:bg-primary/20"
              }`}>
                <BookOpen className={`w-8 h-8 ${
                  selectedLevel === "o-level" ? "text-secondary-foreground" : "text-primary"
                }`} />
              </div>
              
              <h2 className={`font-display text-2xl font-bold mb-3 ${
                selectedLevel === "o-level" ? "text-primary-foreground" : "text-foreground"
              }`}>
                O-Level Student
              </h2>
              
              <p className={`mb-6 ${
                selectedLevel === "o-level" ? "text-primary-foreground/80" : "text-muted-foreground"
              }`}>
                Get recommendations for A-Level subject combinations based on your interests and career goals
              </p>

              <ul className={`space-y-2 ${
                selectedLevel === "o-level" ? "text-primary-foreground/80" : "text-muted-foreground"
              }`}>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Input your O-Level subjects
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Share your career interests
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Get A-Level recommendations
                </li>
              </ul>

              {selectedLevel === "o-level" && (
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <svg className="w-5 h-5 text-secondary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>

            {/* A-Level Card */}
            <button
              onClick={() => setSelectedLevel("a-level")}
              className={`group relative p-8 rounded-2xl border-2 text-left transition-all duration-300 ${
                selectedLevel === "a-level"
                  ? "bg-primary border-primary"
                  : "bg-card border-border hover:border-primary/50 hover:shadow-lg"
              }`}
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                selectedLevel === "a-level"
                  ? "bg-secondary"
                  : "bg-accent/10 group-hover:bg-accent/20"
              }`}>
                <GraduationCap className={`w-8 h-8 ${
                  selectedLevel === "a-level" ? "text-secondary-foreground" : "text-accent"
                }`} />
              </div>
              
              <h2 className={`font-display text-2xl font-bold mb-3 ${
                selectedLevel === "a-level" ? "text-primary-foreground" : "text-foreground"
              }`}>
                A-Level Student
              </h2>
              
              <p className={`mb-6 ${
                selectedLevel === "a-level" ? "text-primary-foreground/80" : "text-muted-foreground"
              }`}>
                Find matching universities and degree programs based on your A-Level subjects and grades
              </p>

              <ul className={`space-y-2 ${
                selectedLevel === "a-level" ? "text-primary-foreground/80" : "text-muted-foreground"
              }`}>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Input your A-Level subjects
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Add your expected grades
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Get university matches
                </li>
              </ul>

              {selectedLevel === "a-level" && (
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <svg className="w-5 h-5 text-secondary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          </div>

          {/* Continue Button */}
          {selectedLevel && (
            <div className="text-center mt-12 animate-fadeUp">
              <Button variant="hero" size="xl" asChild>
                <Link 
                  to={selectedLevel === "o-level" ? "/guidance/o-level" : "/guidance/a-level"}
                  className="group"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GuidancePage;
