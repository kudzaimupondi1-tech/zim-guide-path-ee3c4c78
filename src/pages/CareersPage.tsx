import { useState } from "react";
import { Search, Briefcase, TrendingUp, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const careerPaths = [
  {
    id: 1,
    title: "Medicine & Healthcare",
    description: "Become a doctor, nurse, pharmacist, or healthcare professional",
    icon: "🏥",
    subjects: ["Biology", "Chemistry", "Mathematics"],
    universities: ["UZ", "NUST", "BUSE"],
    salaryRange: "$800 - $3,000+",
    demand: "High",
  },
  {
    id: 2,
    title: "Engineering",
    description: "Design, build, and innovate in various engineering fields",
    icon: "⚙️",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    universities: ["UZ", "NUST", "HIT", "CUT"],
    salaryRange: "$600 - $2,500+",
    demand: "High",
  },
  {
    id: 3,
    title: "Information Technology",
    description: "Software development, cybersecurity, and digital innovation",
    icon: "💻",
    subjects: ["Mathematics", "Computer Science", "Physics"],
    universities: ["UZ", "NUST", "HIT", "MSU"],
    salaryRange: "$500 - $3,000+",
    demand: "Very High",
  },
  {
    id: 4,
    title: "Business & Finance",
    description: "Accounting, banking, marketing, and business management",
    icon: "📊",
    subjects: ["Accounting", "Economics", "Business Studies"],
    universities: ["UZ", "NUST", "MSU", "AU"],
    salaryRange: "$400 - $2,000+",
    demand: "High",
  },
  {
    id: 5,
    title: "Law & Legal Services",
    description: "Legal practice, corporate law, and judicial services",
    icon: "⚖️",
    subjects: ["History", "English", "Divinity"],
    universities: ["UZ", "MSU", "GZU"],
    salaryRange: "$600 - $2,500+",
    demand: "Medium",
  },
  {
    id: 6,
    title: "Education & Teaching",
    description: "Shape future generations as a teacher or education specialist",
    icon: "📚",
    subjects: ["Any relevant subjects"],
    universities: ["UZ", "BUSE", "GZU", "MSU"],
    salaryRange: "$300 - $800+",
    demand: "Stable",
  },
  {
    id: 7,
    title: "Agriculture & Environment",
    description: "Farming, agribusiness, and environmental conservation",
    icon: "🌾",
    subjects: ["Agriculture", "Biology", "Chemistry"],
    universities: ["UZ", "CUT", "BUSE", "LSU"],
    salaryRange: "$400 - $1,500+",
    demand: "Growing",
  },
  {
    id: 8,
    title: "Media & Communications",
    description: "Journalism, broadcasting, and digital media",
    icon: "📺",
    subjects: ["English", "History", "Literature"],
    universities: ["NUST", "MSU", "UZ"],
    salaryRange: "$350 - $1,200+",
    demand: "Medium",
  },
];

const CareersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCareers = careerPaths.filter((career) =>
    career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    career.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
              <Briefcase className="w-4 h-4 inline mr-1" />
              Career Paths
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Explore Career Opportunities
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover rewarding career paths available in Zimbabwe and the subjects you need to pursue them
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-12">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search careers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Careers Grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {filteredCareers.map((career, index) => (
              <div
                key={career.id}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 opacity-0 animate-fadeUp"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                    {career.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {career.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {career.description}
                    </p>

                    {/* Required Subjects */}
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                        Required Subjects:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {career.subjects.map((subject) => (
                          <span key={subject} className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                      <div>
                        <span className="text-xs text-muted-foreground">Salary Range</span>
                        <p className="text-sm font-semibold text-foreground">{career.salaryRange}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Demand</span>
                        <p className={`text-sm font-semibold ${
                          career.demand === "Very High" ? "text-accent" :
                          career.demand === "High" ? "text-accent" :
                          career.demand === "Growing" ? "text-secondary" :
                          "text-foreground"
                        }`}>{career.demand}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Universities</span>
                        <p className="text-sm font-semibold text-foreground">{career.universities.length}+</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCareers.length === 0 && (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                No careers found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center mt-16 p-8 rounded-2xl bg-muted">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              Not sure which career is right for you?
            </h2>
            <p className="text-muted-foreground mb-6">
              Let our AI-powered guidance system help you find the perfect career path based on your interests and abilities.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/guidance" className="group">
                Get Personalized Guidance
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CareersPage;
