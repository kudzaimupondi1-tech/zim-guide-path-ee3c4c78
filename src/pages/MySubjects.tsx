import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  BookOpen,
  ArrowLeft,
  Save,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Tables } from "@/integrations/supabase/types";

type Subject = Tables<"subjects">;
type StudentSubject = Tables<"student_subjects"> & { subjects?: Subject };

const grades = ["A*", "A", "B", "C", "D", "E", "U"];

const MySubjects = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<"O-Level" | "A-Level">("O-Level");
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [studentSubjects, setStudentSubjects] = useState<StudentSubject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");

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
      // Fetch available subjects
      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("*")
        .eq("is_active", true)
        .order("name");
      
      setAvailableSubjects(subjectsData || []);

      // Fetch student's subjects
      const { data: studentSubjectsData } = await supabase
        .from("student_subjects")
        .select("*, subjects(*)")
        .eq("user_id", userId);
      
      setStudentSubjects(studentSubjectsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async () => {
    if (!selectedSubjectId || !user) return;
    
    // Check if subject already added
    if (studentSubjects.some(s => s.subject_id === selectedSubjectId)) {
      toast.error("Subject already added");
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("student_subjects")
        .insert({
          user_id: user.id,
          subject_id: selectedSubjectId,
          level: selectedLevel,
          grade: selectedGrade || null,
        })
        .select("*, subjects(*)")
        .single();

      if (error) throw error;
      
      setStudentSubjects([...studentSubjects, data]);
      setSelectedSubjectId("");
      setSelectedGrade("");
      toast.success("Subject added");
    } catch (error: any) {
      toast.error(error.message || "Failed to add subject");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSubject = async (id: string) => {
    try {
      const { error } = await supabase
        .from("student_subjects")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setStudentSubjects(studentSubjects.filter(s => s.id !== id));
      toast.success("Subject removed");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove subject");
    }
  };

  const handleUpdateGrade = async (id: string, grade: string) => {
    try {
      const { error } = await supabase
        .from("student_subjects")
        .update({ grade })
        .eq("id", id);

      if (error) throw error;
      
      setStudentSubjects(studentSubjects.map(s => 
        s.id === id ? { ...s, grade } : s
      ));
    } catch (error: any) {
      toast.error(error.message || "Failed to update grade");
    }
  };

  const filteredSubjects = availableSubjects.filter(s => s.level === selectedLevel);
  const oLevelSubjects = studentSubjects.filter(s => s.level === "O-Level");
  const aLevelSubjects = studentSubjects.filter(s => s.level === "A-Level");

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
                <h1 className="font-display text-lg font-bold text-foreground">My Subjects</h1>
                <p className="text-sm text-muted-foreground">Manage your academic subjects</p>
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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Add Subject Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Subject
            </CardTitle>
            <CardDescription>Select your academic level and add subjects with grades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedLevel} onValueChange={(v) => setSelectedLevel(v as "O-Level" | "A-Level")}>
                <SelectTrigger>
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="O-Level">O-Level</SelectItem>
                  <SelectItem value="A-Level">A-Level</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                <SelectTrigger className="md:col-span-1">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Grade (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleAddSubject} disabled={!selectedSubjectId || saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* O-Level Subjects */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  O-Level Subjects
                </CardTitle>
                <CardDescription>{oLevelSubjects.length} subjects added</CardDescription>
              </div>
              <Badge variant="outline" className="text-primary border-primary">
                {oLevelSubjects.length} / 8 recommended
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {oLevelSubjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No O-Level subjects added yet</p>
                <p className="text-sm">Add your subjects above to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {oLevelSubjects.map((studentSubject) => (
                  <div 
                    key={studentSubject.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">
                          {studentSubject.subjects?.name || "Unknown Subject"}
                        </h4>
                        {studentSubject.subjects?.code && (
                          <p className="text-sm text-muted-foreground">{studentSubject.subjects.code}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Select 
                        value={studentSubject.grade || ""} 
                        onValueChange={(grade) => handleUpdateGrade(studentSubject.id, grade)}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {grades.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveSubject(studentSubject.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* A-Level Subjects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-accent" />
                  A-Level Subjects
                </CardTitle>
                <CardDescription>{aLevelSubjects.length} subjects added</CardDescription>
              </div>
              <Badge variant="outline" className="text-accent border-accent">
                {aLevelSubjects.length} / 3 recommended
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {aLevelSubjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No A-Level subjects added yet</p>
                <p className="text-sm">Add your subjects above to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {aLevelSubjects.map((studentSubject) => (
                  <div 
                    key={studentSubject.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">
                          {studentSubject.subjects?.name || "Unknown Subject"}
                        </h4>
                        {studentSubject.subjects?.code && (
                          <p className="text-sm text-muted-foreground">{studentSubject.subjects.code}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Select 
                        value={studentSubject.grade || ""} 
                        onValueChange={(grade) => handleUpdateGrade(studentSubject.id, grade)}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {grades.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveSubject(studentSubject.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link to="/recommendations">
              View Recommendations
              <GraduationCap className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default MySubjects;
