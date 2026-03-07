import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Star, GraduationCap, MapPin, Loader2, Building, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface FavouriteProgram {
    id: string;
    program_id: string;
    program_name: string;
    university_name: string;
    match_percentage: number;
}

const FavoredPrograms = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [profileName, setProfileName] = useState<string>("Student");
    const [loading, setLoading] = useState(true);
    const [favourites, setFavourites] = useState<FavouriteProgram[]>([]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session?.user) navigate("/auth");
            else {
                setUser(session.user);
                fetchData(session.user.id);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            if (!session?.user) navigate("/auth");
            else {
                setUser(session.user);
                fetchData(session.user.id);
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const fetchData = async (userId: string) => {
        try {
            setLoading(true);
            const [profileRes, favouritesRes] = await Promise.all([
                supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle(),
                supabase.from("favourite_programs").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
            ]);

            if (profileRes.data?.full_name) {
                setProfileName(profileRes.data.full_name);
            }

            setFavourites((favouritesRes.data as any[]) || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load your favoured programs");
        } finally {
            setLoading(false);
        }
    };

    const currentDateTime = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handlePrint = () => {
        if (favourites.length === 0) {
            toast.error("No programs available to download.");
            return;
        }
        window.print();
    };

    const handleClearAll = async () => {
        if (!user) return;
        if (!window.confirm("Are you sure you want to remove all starred programs? This cannot be undone.")) return;

        try {
            const { error } = await supabase
                .from("favourite_programs")
                .delete()
                .eq("user_id", user.id);

            if (error) throw error;

            setFavourites([]);
            toast.success("All starred programs cleared");
        } catch (error) {
            console.error("Error clearing favourites:", error);
            toast.error("Failed to clear programs");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary/30 pb-12">
            {/* 
        Print specific styles to ensure the document looks very clean and professional when saved to PDF
        All .no-print elements are hidden. The page breaks are managed.
      */}
            <style>
                {`
          @media print {
            body { background: white !important; }
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            .print-container { padding: 0 !important; max-width: 100% !important; border: none !important; box-shadow: none !important; }
            @page { margin: 2cm; }
          }
          .print-only { display: none; }
        `}
            </style>

            {/* Header - Not visible during print */}
            <header className="no-print sticky top-0 z-50 bg-card border-b border-border">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate("/dashboard")}>
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h1 className="text-sm font-bold text-foreground">Favoured Programs</h1>
                                <p className="text-[11px] text-muted-foreground">Your starred recommendations</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {favourites.length > 0 && (
                                <Button onClick={handleClearAll} size="sm" variant="destructive" className="hidden sm:flex gap-2">
                                    <Trash2 className="w-4 h-4" /> Clear All
                                </Button>
                            )}
                            <Button onClick={handlePrint} size="sm" className="hidden sm:flex gap-2">
                                <Download className="w-4 h-4" /> Download PDF
                            </Button>
                            {favourites.length > 0 && (
                                <Button onClick={handleClearAll} size="icon" variant="ghost" className="sm:hidden text-destructive">
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            )}
                            <Button onClick={handlePrint} size="icon" variant="ghost" className="sm:hidden">
                                <Download className="w-5 h-5 text-primary" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl print-container">

                {/* Print-specific Document Header */}
                <div className="print-only mb-10 text-center border-b pb-6">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">EduGuide Favoured Programs</h1>
                    <p className="text-slate-600 mb-4">Official Personalized Recommendations Report</p>
                    <div className="flex justify-between items-end mt-8 text-sm font-medium text-slate-800">
                        <div className="text-left">
                            <p className="text-slate-500 uppercase text-[10px] tracking-wider mb-1">Student Name</p>
                            <p className="text-base">{profileName}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-500 uppercase text-[10px] tracking-wider mb-1">Date Generated</p>
                            <p className="text-base">{currentDateTime}</p>
                        </div>
                    </div>
                </div>

                {/* On-Screen Title Row */}
                <div className="no-print flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                            Your Favoured Programs
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">Review your saved programs before making your final university choices.</p>
                    </div>
                </div>

                {favourites.length === 0 ? (
                    <Card className="no-print border-dashed border-2 bg-transparent shadow-none">
                        <CardContent className="py-16 text-center">
                            <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                            <h2 className="text-lg font-semibold text-foreground mb-2">No programs starred yet</h2>
                            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                                Any programs you star from your recommendations list will appear here for easy access and PDF export.
                            </p>
                            <Button asChild>
                                <Link to="/my-subjects">Get Recommendations</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {favourites.map((fav, i) => (
                            <Card key={fav.id} className="overflow-hidden border-border/60 shadow-sm print:shadow-none print:border-slate-300 print:mb-4">
                                <CardContent className="p-0">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center">

                                        {/* Number block (Left) */}
                                        <div className="hidden sm:flex self-stretch w-12 bg-muted/40 print:bg-slate-50 items-center justify-center border-r border-border/60 print:border-slate-200">
                                            <span className="font-bold text-muted-foreground">{i + 1}</span>
                                        </div>

                                        {/* Content Block */}
                                        <div className="flex-1 p-5 w-full">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                                                <div>
                                                    <h3 className="text-lg font-bold text-foreground print:text-slate-900 mb-1 leading-tight">
                                                        {fav.program_name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground print:text-slate-600">
                                                        <Building className="w-4 h-4" />
                                                        <span>{fav.university_name}</span>
                                                    </div>
                                                </div>

                                                {/* Match Badge */}
                                                <div className="flex items-center self-start bg-blue-50 text-blue-700 print:border print:border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-900/50">
                                                    <span className="text-xs font-semibold uppercase tracking-wider mr-2 opacity-80">Match</span>
                                                    <span className="font-bold text-base">{fav.match_percentage}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

            </main>
        </div>
    );
};

export default FavoredPrograms;
