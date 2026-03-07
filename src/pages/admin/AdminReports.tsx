import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, TrendingUp, GraduationCap, Building2, Users, BarChart3 } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

export default function AdminReports() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    totalPayments: 0,
    totalStudents: 0,
    topPrograms: [] as { name: string; count: number }[],
    topUniversities: [] as { name: string; count: number }[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const today = new Date();
        const [paymentsRes, profilesRes, favouritesRes] = await Promise.all([
          supabase.from("payments").select("amount, status, created_at"),
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase.from("favourite_programs").select("program_name, university_name"),
        ]);

        const payments = paymentsRes.data || [];
        const completed = payments.filter(p => p.status === "completed");
        const totalRevenue = completed.reduce((s, p) => s + p.amount, 0);
        const todayPayments = completed.filter(p => {
          const d = new Date(p.created_at);
          return d >= startOfDay(today) && d <= endOfDay(today);
        });
        const todayRevenue = todayPayments.reduce((s, p) => s + p.amount, 0);

        const favourites = favouritesRes.data || [];
        const programCounts = new Map<string, number>();
        const uniCounts = new Map<string, number>();
        favourites.forEach((f: any) => {
          if (f.program_name) programCounts.set(f.program_name, (programCounts.get(f.program_name) || 0) + 1);
          if (f.university_name) uniCounts.set(f.university_name, (uniCounts.get(f.university_name) || 0) + 1);
        });

        setStats({
          totalRevenue,
          todayRevenue,
          totalPayments: payments.length,
          totalStudents: profilesRes.count || 0,
          topPrograms: Array.from(programCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count })),
          topUniversities: Array.from(uniCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count })),
        });
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1><p className="text-muted-foreground mt-1">Revenue, usage, and performance insights</p></div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Revenue</p><p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p></div><DollarSign className="w-8 h-8 text-green-500" /></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Today's Revenue</p><p className="text-2xl font-bold">${stats.todayRevenue.toFixed(2)}</p></div><TrendingUp className="w-8 h-8 text-primary" /></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Payments</p><p className="text-2xl font-bold">{stats.totalPayments}</p></div><BarChart3 className="w-8 h-8 text-primary" /></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Students</p><p className="text-2xl font-bold">{stats.totalStudents}</p></div><Users className="w-8 h-8 text-primary" /></div></CardContent></Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary" /> Most Favoured Programs</CardTitle></CardHeader><CardContent>
            {stats.topPrograms.length === 0 ? <p className="text-sm text-muted-foreground">No data yet</p> : (
              <div className="space-y-3">{stats.topPrograms.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{i + 1}</span><span className="text-sm font-medium">{p.name}</span></div>
                  <span className="text-sm font-bold text-foreground">{p.count} ⭐</span>
                </div>
              ))}</div>
            )}
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5 text-primary" /> Most Selected Universities</CardTitle></CardHeader><CardContent>
            {stats.topUniversities.length === 0 ? <p className="text-sm text-muted-foreground">No data yet</p> : (
              <div className="space-y-3">{stats.topUniversities.map((u, i) => (
                <div key={u.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{i + 1}</span><span className="text-sm font-medium">{u.name}</span></div>
                  <span className="text-sm font-bold text-foreground">{u.count}</span>
                </div>
              ))}</div>
            )}
          </CardContent></Card>
        </div>
      </div>
    </AdminLayout>
  );
}
