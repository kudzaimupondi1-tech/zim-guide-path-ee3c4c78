import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  User,
  LogOut,
  Bell,
  X,
  Plus,
  Star,
  Download,
  Building2
} from "lucide-react";
import { StudentRating } from "@/components/StudentRating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface FavouriteProgram {
  id: string;
  program_name: string;
  university_name: string;
  match_percentage: number;
  program_id: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const [subjectCount, setSubjectCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [favourites, setFavourites] = useState<FavouriteProgram[]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) navigate("/auth");
      else setUser(session.user);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) navigate("/auth");
      else { setUser(session.user); fetchUserData(session.user.id); }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    try {
      supabase.from("profiles").update({ last_active_at: new Date().toISOString() }).eq("user_id", userId).then();
      const [profileRes, subjectCountRes, notificationsRes, favouritesRes] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("user_id", userId).single(),
        supabase.from("student_subjects").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("student_notifications").select("*").eq("user_id", userId).eq("is_read", false).order("created_at", { ascending: false }).limit(10),
        supabase.from("favourite_programs").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      ]);
      setProfile(profileRes.data);
      setSubjectCount(subjectCountRes.count || 0);
      setNotifications(notificationsRes.data || []);
      setFavourites((favouritesRes.data as any[]) || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const markNotificationRead = async (id: string) => {
    await supabase.from("student_notifications").update({ is_read: true }).eq("id", id);
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const removeFavourite = async (id: string) => {
    await supabase.from("favourite_programs").delete().eq("id", id);
    setFavourites(prev => prev.filter(f => f.id !== id));
    toast.success("Removed from favourites");
  };

  const downloadPDF = () => {
    if (favourites.length === 0) { toast.error("No programmes to download"); return; }
    const studentName = profile?.full_name || user?.user_metadata?.full_name || "Student";
    const date = new Date().toLocaleDateString();
    
    // Generate simple HTML-based PDF content
    const content = `
      <html><head><title>Favoured Programs</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #333; font-size: 24px; }
        .info { color: #666; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #f0f0f0; padding: 12px; text-align: left; border: 1px solid #ddd; }
        td { padding: 10px; border: 1px solid #ddd; }
        .match { font-weight: bold; }
      </style></head><body>
      <h1>🎓 EduGuide Zimbabwe - Favoured Programs</h1>
      <div class="info"><p><strong>Student:</strong> ${studentName}</p><p><strong>Date:</strong> ${date}</p></div>
      <table>
        <thead><tr><th>#</th><th>Program</th><th>University</th><th>Match %</th></tr></thead>
        <tbody>${favourites.map((f, i) => `<tr><td>${i + 1}</td><td>${f.program_name}</td><td>${f.university_name}</td><td class="match">${f.match_percentage}%</td></tr>`).join("")}</tbody>
      </table>
      </body></html>
    `;
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, "_blank");
    if (printWindow) {
      printWindow.onload = () => { printWindow.print(); };
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getUserName = () => {
    if (profile?.full_name) return profile.full_name.split(" ")[0];
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name.split(" ")[0];
    return "Student";
  };

  const profileCompleteness = Math.min(100, (subjectCount > 0 ? 50 : 0) + (profile?.full_name ? 50 : 25));
  const unreadCount = notifications.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-sm font-bold text-foreground leading-none">EduGuide</span>
                <span className="text-[10px] text-muted-foreground block -mt-0.5">Zimbabwe</span>
              </div>
            </Link>
            <div className="flex items-center gap-1">
              <div className="relative">
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setShowNotifications(!showNotifications)}>
                  <Bell className="w-[18px] h-[18px]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-medium">{unreadCount}</span>
                  )}
                </Button>
                {showNotifications && (
                  <div className="absolute right-0 mt-1 w-80 bg-card border border-border rounded-xl shadow-lg z-50">
                    <div className="p-3 border-b border-border"><h3 className="font-semibold text-sm text-foreground">Notifications</h3></div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground text-sm">No new notifications</div>
                      ) : notifications.map((n) => (
                        <div key={n.id} className="p-3 border-b border-border last:border-0 hover:bg-muted/50">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm text-foreground">{n.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => markNotificationRead(n.id)}><X className="w-3.5 h-3.5" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link to="/profile"><User className="w-[18px] h-[18px]" /></Link>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleSignOut}>
                <LogOut className="w-[18px] h-[18px]" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <section className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{getGreeting()}, {getUserName()} 👋</h1>
          <p className="text-muted-foreground mt-1 text-sm">A clear path to your university journey.</p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Profile completion</span>
              <span className="font-medium text-foreground">{profileCompleteness}%</span>
            </div>
            <Progress value={profileCompleteness} className="h-2" />
          </div>
        </section>

        {/* 2 Action Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {/* Card 1: Add Subjects */}
          <Card className="border border-border shadow-sm hover:shadow-md transition-all group">
            <CardContent className="pt-6 pb-5 px-5 flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-1.5">Add Subjects</h3>
              <p className="text-sm text-muted-foreground flex-1 mb-4">
                Add your O-Level or A-Level subjects to get personalised programme recommendations.
              </p>
              <Button size="sm" asChild className="w-full">
                <Link to="/my-subjects">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card 2: Favoured Programs */}
          <Card className="border border-border shadow-sm hover:shadow-md transition-all group">
            <CardContent className="pt-6 pb-5 px-5 flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-4 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/50 transition-colors">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-1.5">Favoured Programs</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {favourites.length === 0 
                  ? "Star up to 5 programs from recommendations to save them here."
                  : `You have ${favourites.length} starred program${favourites.length > 1 ? "s" : ""}.`
                }
              </p>
              {favourites.length > 0 && (
                <Button variant="outline" size="sm" className="w-full mb-2" onClick={downloadPDF}>
                  <Download className="w-4 h-4 mr-1.5" /> Download as PDF
                </Button>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Favoured Programs List */}
        {favourites.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" /> Your Starred Programs
            </h2>
            <div className="space-y-3">
              {favourites.map((fav) => (
                <Card key={fav.id} className="border border-border shadow-sm hover:shadow-md transition-all">
                  <CardContent className="py-4 px-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          fav.match_percentage >= 80 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                          : fav.match_percentage >= 50 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-muted text-muted-foreground"
                        }`}>
                          {fav.match_percentage}%
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm text-foreground truncate">{fav.program_name}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" /> {fav.university_name}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-yellow-500 hover:text-destructive flex-shrink-0" onClick={() => removeFavourite(fav.id)}>
                        <Star className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Rating */}
        <Card className="border border-border shadow-sm">
          <CardContent className="py-5 px-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground text-sm">How do you find EduGuide?</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Your feedback helps us improve</p>
            </div>
            <StudentRating />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
