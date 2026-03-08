import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageSquare, Send, Clock, CheckCircle, User } from "lucide-react";

interface StudentQuery {
  id: string;
  user_id: string;
  query_text: string;
  status: string;
  admin_response: string | null;
  created_at: string;
  responded_at: string | null;
  profile?: { full_name: string | null; email: string | null };
}

export default function AdminQueries() {
  const [queries, setQueries] = useState<StudentQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "responded">("all");

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const { data, error } = await supabase
        .from("student_queries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles for each unique user_id
      const userIds = [...new Set((data || []).map((q: any) => q.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", userIds);

      const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));
      const enriched = (data || []).map((q: any) => ({
        ...q,
        profile: profileMap.get(q.user_id) || null,
      }));

      setQueries(enriched);
    } catch (error) {
      console.error("Error fetching queries:", error);
      toast.error("Failed to load queries");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (queryId: string) => {
    const response = responses[queryId]?.trim();
    if (!response) return;

    setSubmitting(queryId);
    try {
      const { error } = await supabase
        .from("student_queries")
        .update({
          admin_response: response,
          status: "responded",
          responded_at: new Date().toISOString(),
        } as any)
        .eq("id", queryId);

      if (error) throw error;
      toast.success("Response sent successfully");
      setResponses(prev => ({ ...prev, [queryId]: "" }));
      fetchQueries();
    } catch (error) {
      toast.error("Failed to send response");
    } finally {
      setSubmitting(null);
    }
  };

  const filtered = queries.filter(q => {
    if (filter === "pending") return q.status === "pending";
    if (filter === "responded") return q.status === "responded";
    return true;
  });

  const pendingCount = queries.filter(q => q.status === "pending").length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Student Queries</h1>
            <p className="text-muted-foreground mt-1">View and respond to student questions</p>
          </div>
          {pendingCount > 0 && (
            <Badge variant="destructive" className="text-sm px-3 py-1">
              {pendingCount} pending
            </Badge>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(["all", "pending", "responded"] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f} {f === "all" ? `(${queries.length})` : f === "pending" ? `(${pendingCount})` : `(${queries.length - pendingCount})`}
            </Button>
          ))}
        </div>

        {/* Queries List */}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-muted-foreground">No queries found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map(query => (
              <Card key={query.id} className={query.status === "pending" ? "border-yellow-300 dark:border-yellow-700" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">
                          {query.profile?.full_name || "Unknown Student"}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">{query.profile?.email || ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={query.status === "pending" ? "secondary" : "default"} className="text-xs">
                        {query.status === "pending" ? (
                          <><Clock className="w-3 h-3 mr-1" /> Pending</>
                        ) : (
                          <><CheckCircle className="w-3 h-3 mr-1" /> Responded</>
                        )}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(query.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-foreground">{query.query_text}</p>
                  </div>

                  {query.admin_response && (
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-xs font-medium text-primary mb-1">Admin Response:</p>
                      <p className="text-sm text-foreground">{query.admin_response}</p>
                      {query.responded_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(query.responded_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  {query.status === "pending" && (
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type your response..."
                        value={responses[query.id] || ""}
                        onChange={(e) => setResponses(prev => ({ ...prev, [query.id]: e.target.value }))}
                        rows={2}
                        className="resize-none text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleRespond(query.id)}
                        disabled={!responses[query.id]?.trim() || submitting === query.id}
                        className="self-end"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
