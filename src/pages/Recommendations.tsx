import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Target, 
  MapPin,
  Clock,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Filter,
  Search,
  Star,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Tables } from "@/integrations/supabase/types";

type Program = Tables<"programs"> & { 
  universities?: Tables<"universities">;
  program_subjects?: Array<{ subjects?: Tables<"subjects">; is_required?: boolean; minimum_grade?: string }>;
};

const Recommendations = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [studentSubjects, setStudentSubjects] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [universityFilter, setUniversityFilter] = useState<string>("all");
  const [universities, setUniversities] = useState<Tables<"universities">[]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchData = async (userId: string) => {
    try {
      // Fetch student's subjects
      const { data: subjectsData } = await supabase
        .from("student_subjects")
        .select("subject_id")
        .eq("user_id", userId);
      
      const subjectIds = subjectsData?.map(s => s.subject_id) || [];
      setStudentSubjects(subjectIds);

      // Fetch all programs with universities and required subjects
      const { data: programsData } = await supabase
        .from("programs")
        .select(`
          *,
          universities(*),
          program_subjects(*, subjects(*))
        `)
        .eq("is_active", true)
        .order("name");
      
      setPrograms(programsData || []);

      // Fetch universities for filter
      const { data: universitiesData } = await supabase
        .from("universities")
        .select("*")
        .eq("is_active", true)
        .order("name");
      
      setUniversities(universitiesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  const calculateMatchScore = (program: Program): number => {
    if (!program.program_subjects?.length || studentSubjects.length === 0) return 0;
    
    const requiredSubjects = program.program_subjects.filter(ps => ps.is_required);
    const matchedRequired = requiredSubjects.filter(ps => 
      studentSubjects.includes(ps.subjects?.id || "")
    );
    
    if (requiredSubjects.length === 0) return 50;
    return Math.round((matchedRequired.length / requiredSubjects.length) * 100);
  };

  const filteredPrograms = programs
    .map(program => ({
      ...program,
      matchScore: calculateMatchScore(program)
    }))
    .filter(program => {
      const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.universities?.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesUniversity = universityFilter === "all" || program.university_id === universityFilter;
      return matchesSearch && matchesUniversity;
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div>
                <h1 className="font-display text-lg font-bold text-foreground">Recommendations</h1>
                <p className="text-sm text-muted-foreground">Programs matched to your subjects</p>
              </div>
            </div>
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {studentSubjects.length === 0 ? (
          <Card className="bg-hero-gradient text-primary-foreground">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-10 h-10 text-secondary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-display text-2xl font-bold mb-2">Add Your Subjects First</h3>
                  <p className="text-primary-foreground/80 mb-4">
                    To get personalized program recommendations, please add your O-Level or A-Level subjects first.
                  </p>
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/my-subjects">
                      Add Your Subjects
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search programs or universities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={universityFilter} onValueChange={setUniversityFilter}>
                <SelectTrigger className="w-full md:w-64">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by University" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {universities.map((uni) => (
                    <SelectItem key={uni.id} value={uni.id}>
                      {uni.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results */}
            <div className="mb-4">
              <p className="text-muted-foreground">
                Found <span className="font-semibold text-foreground">{filteredPrograms.length}</span> programs matching your criteria
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPrograms.map((program) => (
                <Card 
                  key={program.id} 
                  className={`group hover:shadow-lg transition-all ${
                    program.matchScore >= 80 
                      ? 'border-accent/50 bg-accent/5' 
                      : program.matchScore >= 50 
                        ? 'border-secondary/30' 
                        : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {program.matchScore >= 80 && (
                            <Badge className="bg-accent text-accent-foreground">
                              <Star className="w-3 h-3 mr-1" />
                              Best Match
                            </Badge>
                          )}
                          {program.degree_type && (
                            <Badge variant="outline">{program.degree_type}</Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{program.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <GraduationCap className="w-4 h-4" />
                          {program.universities?.name}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${
                          program.matchScore >= 80 
                            ? 'bg-accent text-accent-foreground' 
                            : program.matchScore >= 50 
                              ? 'bg-secondary text-secondary-foreground' 
                              : 'bg-muted text-muted-foreground'
                        }`}>
                          {program.matchScore}%
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">Match</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {program.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {program.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      {program.universities?.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {program.universities.location}
                        </div>
                      )}
                      {program.duration_years && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {program.duration_years} years
                        </div>
                      )}
                      {program.faculty && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {program.faculty}
                        </div>
                      )}
                    </div>

                    {program.program_subjects && program.program_subjects.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-foreground mb-2">Required Subjects:</p>
                        <div className="flex flex-wrap gap-1">
                          {program.program_subjects.filter(ps => ps.is_required).slice(0, 5).map((ps, idx) => (
                            <Badge 
                              key={idx} 
                              variant={studentSubjects.includes(ps.subjects?.id || "") ? "default" : "outline"}
                              className="text-xs"
                            >
                              {ps.subjects?.name}
                              {ps.minimum_grade && ` (${ps.minimum_grade})`}
                            </Badge>
                          ))}
                          {program.program_subjects.filter(ps => ps.is_required).length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{program.program_subjects.filter(ps => ps.is_required).length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link to={`/universities`}>
                          View University
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                      <Button size="sm" className="flex-1">
                        Learn More
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPrograms.length === 0 && (
              <Card className="py-12">
                <CardContent className="text-center">
                  <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    No Programs Found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button variant="outline" onClick={() => { setSearchQuery(""); setUniversityFilter("all"); }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Recommendations;
