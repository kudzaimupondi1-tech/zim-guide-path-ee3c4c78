import { useState } from "react";
import { Search, MapPin, ExternalLink, Filter, GraduationCap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const allUniversities = [
  {
    id: 1,
    name: "University of Zimbabwe",
    shortName: "UZ",
    type: "Public",
    location: "Harare",
    programs: 85,
    description: "Zimbabwe's oldest and most prestigious university, offering a wide range of undergraduate and postgraduate programs.",
    faculties: ["Arts", "Commerce", "Engineering", "Law", "Medicine", "Science", "Education"],
  },
  {
    id: 2,
    name: "National University of Science and Technology",
    shortName: "NUST",
    type: "Public",
    location: "Bulawayo",
    programs: 62,
    description: "A leading institution focused on science, technology, and innovation in Zimbabwe.",
    faculties: ["Applied Sciences", "Built Environment", "Commerce", "Communication", "Industrial Technology", "Medicine"],
  },
  {
    id: 3,
    name: "Midlands State University",
    shortName: "MSU",
    type: "Public",
    location: "Gweru",
    programs: 54,
    description: "One of Zimbabwe's largest universities with diverse academic programs.",
    faculties: ["Arts", "Commerce", "Education", "Law", "Science & Technology", "Social Sciences"],
  },
  {
    id: 4,
    name: "Africa University",
    shortName: "AU",
    type: "Private",
    location: "Mutare",
    programs: 38,
    description: "A Pan-African institution founded by the United Methodist Church.",
    faculties: ["Agriculture", "Education", "Health Sciences", "Humanities", "Management & Administration", "Theology"],
  },
  {
    id: 5,
    name: "Chinhoyi University of Technology",
    shortName: "CUT",
    type: "Public",
    location: "Chinhoyi",
    programs: 42,
    description: "Specialized in technology and agricultural sciences.",
    faculties: ["Agricultural Sciences", "Commerce", "Engineering Sciences", "Hospitality & Tourism", "Natural Sciences"],
  },
  {
    id: 6,
    name: "Harare Institute of Technology",
    shortName: "HIT",
    type: "Public",
    location: "Harare",
    programs: 35,
    description: "Focused on technology, engineering, and industrial sciences.",
    faculties: ["Engineering & Technology", "Industrial Sciences", "Information Technology"],
  },
  {
    id: 7,
    name: "Bindura University of Science Education",
    shortName: "BUSE",
    type: "Public",
    location: "Bindura",
    programs: 32,
    description: "Specialized in science education and teacher training.",
    faculties: ["Agriculture", "Commerce", "Education", "Science"],
  },
  {
    id: 8,
    name: "Great Zimbabwe University",
    shortName: "GZU",
    type: "Public",
    location: "Masvingo",
    programs: 40,
    description: "A comprehensive university serving the southern region.",
    faculties: ["Arts", "Commerce", "Education", "Natural Sciences", "Social Sciences"],
  },
  {
    id: 9,
    name: "Lupane State University",
    shortName: "LSU",
    type: "Public",
    location: "Lupane",
    programs: 28,
    description: "Serving the Matabeleland North region with diverse programs.",
    faculties: ["Agriculture", "Commerce", "Humanities", "Science & Technology"],
  },
  {
    id: 10,
    name: "Solusi University",
    shortName: "SU",
    type: "Private",
    location: "Bulawayo",
    programs: 30,
    description: "A Seventh-day Adventist institution with strong academic traditions.",
    faculties: ["Business", "Education", "Science", "Theology"],
  },
  {
    id: 11,
    name: "Women's University in Africa",
    shortName: "WUA",
    type: "Private",
    location: "Harare",
    programs: 25,
    description: "Dedicated to women's education and empowerment.",
    faculties: ["Commerce", "Gender Studies", "Humanities", "Management"],
  },
  {
    id: 12,
    name: "Catholic University of Zimbabwe",
    shortName: "CUZ",
    type: "Private",
    location: "Harare",
    programs: 22,
    description: "A Catholic institution offering quality education with moral values.",
    faculties: ["Business", "Education", "Social Sciences", "Theology"],
  },
];

const UniversitiesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "public" | "private">("all");

  const filteredUniversities = allUniversities.filter((uni) => {
    const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || uni.type.toLowerCase() === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <Building2 className="w-4 h-4 inline mr-1" />
              Universities
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Zimbabwean Universities
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore degree programs from {allUniversities.length} public and private universities across Zimbabwe
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search universities or locations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterType === "public" ? "default" : "outline"}
                onClick={() => setFilterType("public")}
                size="sm"
              >
                Public
              </Button>
              <Button
                variant={filterType === "private" ? "default" : "outline"}
                onClick={() => setFilterType("private")}
                size="sm"
              >
                Private
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-muted-foreground mb-6">
            Showing {filteredUniversities.length} {filteredUniversities.length === 1 ? "university" : "universities"}
          </p>

          {/* Universities Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((uni, index) => (
              <div
                key={uni.id}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 opacity-0 animate-scaleIn"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
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

                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{uni.location}</span>
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {uni.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {uni.faculties.slice(0, 3).map((faculty) => (
                    <span key={faculty} className="px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                      {faculty}
                    </span>
                  ))}
                  {uni.faculties.length > 3 && (
                    <span className="px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                      +{uni.faculties.length - 3} more
                    </span>
                  )}
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

          {filteredUniversities.length === 0 && (
            <div className="text-center py-16">
              <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                No universities found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UniversitiesPage;
