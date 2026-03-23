import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Building2,
  Briefcase,
  Users,
  Settings,
  LogOut,
  Brain,
  Megaphone,
  Calendar,
  BarChart3,
  Layers,
  Hash,
  MessageSquare,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const REVIEWED_KEY = "admin_reviewed_modules";

const getReviewed = (): Record<string, string> => {
  try { return JSON.parse(localStorage.getItem(REVIEWED_KEY) || "{}"); } catch { return {}; }
};

const markReviewed = (url: string) => {
  const r = getReviewed();
  r[url] = new Date().toISOString();
  localStorage.setItem(REVIEWED_KEY, JSON.stringify(r));
};

const dataMenuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, countKey: null },
  { title: "Universities", url: "/admin/universities", icon: Building2, countKey: "universities" },
  { title: "Programs", url: "/admin/programs", icon: GraduationCap, countKey: "programs" },
  { title: "Subjects", url: "/admin/subjects", icon: BookOpen, countKey: "subjects" },
  { title: "Combinations", url: "/admin/combinations", icon: Layers, countKey: "combinations" },
  { title: "Grading", url: "/admin/grading", icon: Hash, countKey: "grading" },
  { title: "Careers", url: "/admin/careers", icon: Briefcase, countKey: "careers" },
  { title: "Diplomas", url: "/admin/diplomas", icon: GraduationCap, countKey: null },
];

const systemMenuItems = [
  { title: "AI Config", url: "/admin/ai-config", icon: Brain, countKey: null },
  { title: "Announcements", url: "/admin/announcements", icon: Megaphone, countKey: "announcements" },
  { title: "Payments", url: "/admin/payments", icon: Hash, countKey: "payments" },
  { title: "Reports", url: "/admin/reports", icon: BarChart3, countKey: null },
  { title: "Student Queries", url: "/admin/queries", icon: MessageSquare, countKey: "queries" },
  { title: "System Logs", url: "/admin/logs", icon: Layers, countKey: null },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3, countKey: null },
  { title: "Users", url: "/admin/users", icon: Users, countKey: "users" },
  { title: "Settings", url: "/admin/settings", icon: Settings, countKey: null },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchCounts();
  }, []);

  // Mark current module as reviewed when navigating
  useEffect(() => {
    const allItems = [...dataMenuItems, ...systemMenuItems];
    const current = allItems.find(i => i.url === location.pathname);
    if (current?.countKey) {
      markReviewed(current.url);
      setCounts(prev => ({ ...prev, [current.countKey!]: 0 }));
    }
  }, [location.pathname]);

  const fetchCounts = async () => {
    const reviewed = getReviewed();
    const newCounts: Record<string, number> = {};

    try {
      // Pending queries
      const { count: pendingQueries } = await supabase
        .from("student_queries")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      newCounts.queries = pendingQueries || 0;

      // Pending payments
      const { count: pendingPayments } = await supabase
        .from("payments")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      newCounts.payments = pendingPayments || 0;

      // New users since last review
      const usersReviewedAt = reviewed["/admin/users"];
      if (usersReviewedAt) {
        const { count: newUsers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gt("created_at", usersReviewedAt);
        newCounts.users = newUsers || 0;
      } else {
        const { count: totalUsers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });
        newCounts.users = totalUsers || 0;
      }

      // Clear counts for currently viewed module
      const allItems = [...dataMenuItems, ...systemMenuItems];
      const current = allItems.find(i => i.url === location.pathname);
      if (current?.countKey) {
        newCounts[current.countKey] = 0;
      }

      setCounts(newCounts);
    } catch (error) {
      console.error("Error fetching sidebar counts:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const renderMenuItem = (item: { title: string; url: string; icon: any; countKey: string | null }) => {
    const isActive = location.pathname === item.url;
    const count = item.countKey ? counts[item.countKey] || 0 : 0;
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <Link
            to={item.url}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="flex-1">{item.title}</span>
            {count > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-sidebar-foreground">EduGuide</h1>
            <p className="text-[10px] text-sidebar-foreground/50">Admin Panel</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-xs uppercase tracking-wide">Data Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dataMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-xs uppercase tracking-wide">System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex flex-col gap-1">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground">
              <GraduationCap className="w-4 h-4 mr-2" />
              Student View
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}