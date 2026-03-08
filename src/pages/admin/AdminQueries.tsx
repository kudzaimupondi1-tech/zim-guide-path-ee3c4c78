import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageSquare, Send, User, ArrowLeft } from "lucide-react";

interface Query {
  id: string;
  user_id: string;
  query_text: string;
  status: string;
  admin_response: string | null;
  created_at: string;
  responded_at: string | null;
}

interface StudentThread {
  user_id: string;
  full_name: string | null;
  email: string | null;
  queries: Query[];
  pendingCount: number;
  lastMessageAt: string;
}

export default function AdminQueries() {
  const [threads, setThreads] = useState<StudentThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState<StudentThread | null>(null);
  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchQueries();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedThread]);

  const fetchQueries = async () => {
    try {
      const { data, error } = await supabase
        .from("student_queries")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      const userIds = [...new Set((data || []).map((q: any) => q.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", userIds);

      const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));

      // Group by user_id
      const grouped = new Map<string, Query[]>();
      for (const q of (data || []) as Query[]) {
        if (!grouped.has(q.user_id)) grouped.set(q.user_id, []);
        grouped.get(q.user_id)!.push(q);
      }

      const threadList: StudentThread[] = Array.from(grouped.entries()).map(([userId, queries]) => {
        const profile = profileMap.get(userId);
        return {
          user_id: userId,
          full_name: profile?.full_name || null,
          email: profile?.email || null,
          queries,
          pendingCount: queries.filter(q => q.status === "pending").length,
          lastMessageAt: queries[queries.length - 1].created_at,
        };
      });

      // Sort by last message, most recent first
      threadList.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

      setThreads(threadList);

      // Update selected thread if open
      if (selectedThread) {
        const updated = threadList.find(t => t.user_id === selectedThread.user_id);
        if (updated) setSelectedThread(updated);
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
      toast.error("Failed to load queries");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (queryId: string) => {
    if (!response.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("student_queries")
        .update({
          admin_response: response.trim(),
          status: "responded",
          responded_at: new Date().toISOString(),
        } as any)
        .eq("id", queryId);

      if (error) throw error;
      toast.success("Response sent");
      setResponse("");
      fetchQueries();
    } catch {
      toast.error("Failed to send response");
    } finally {
      setSubmitting(false);
    }
  };

  const totalPending = threads.reduce((sum, t) => sum + t.pendingCount, 0);

  // Find the latest pending query for the selected thread
  const latestPendingQuery = selectedThread?.queries.filter(q => q.status === "pending").pop();

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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedThread && (
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSelectedThread(null)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {selectedThread ? (selectedThread.full_name || "Unknown Student") : "Student Queries"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {selectedThread ? selectedThread.email : `${threads.length} conversations`}
              </p>
            </div>
          </div>
          {!selectedThread && totalPending > 0 && (
            <Badge variant="destructive">{totalPending} pending</Badge>
          )}
        </div>

        {!selectedThread ? (
          /* Thread List */
          threads.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-muted-foreground">No queries yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {threads.map(thread => {
                const lastQuery = thread.queries[thread.queries.length - 1];
                const lastText = lastQuery.admin_response || lastQuery.query_text;
                return (
                  <Card
                    key={thread.user_id}
                    className={`cursor-pointer hover:bg-muted/40 transition-colors ${thread.pendingCount > 0 ? "border-yellow-300 dark:border-yellow-700" : ""}`}
                    onClick={() => setSelectedThread(thread)}
                  >
                    <CardContent className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-sm text-foreground truncate">
                              {thread.full_name || "Unknown Student"}
                            </p>
                            <span className="text-[11px] text-muted-foreground flex-shrink-0">
                              {new Date(thread.lastMessageAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            <p className="text-xs text-muted-foreground truncate pr-4">{lastText}</p>
                            {thread.pendingCount > 0 && (
                              <span className="w-5 h-5 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                {thread.pendingCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )
        ) : (
          /* Chat View */
          <Card className="overflow-hidden">
            <div ref={scrollRef} className="max-h-[500px] overflow-y-auto p-4 space-y-3 bg-secondary/20">
              {selectedThread.queries.map((q) => (
                <div key={q.id} className="space-y-2">
                  {/* Student message - left */}
                  <div className="flex justify-start">
                    <div className="max-w-[75%] bg-muted border border-border rounded-2xl rounded-bl-md px-3.5 py-2.5">
                      <p className="text-sm text-foreground">{q.query_text}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(q.created_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  {/* Admin response - right */}
                  {q.admin_response && (
                    <div className="flex justify-end">
                      <div className="max-w-[75%] bg-primary text-primary-foreground rounded-2xl rounded-br-md px-3.5 py-2.5">
                        <p className="text-sm">{q.admin_response}</p>
                        {q.responded_at && (
                          <p className="text-[10px] opacity-70 mt-1 text-right">
                            {new Date(q.responded_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Reply input - only if there's a pending query */}
            {latestPendingQuery && (
              <div className="p-3 border-t border-border bg-card">
                <div className="flex items-end gap-2">
                  <Textarea
                    placeholder="Type your response..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && latestPendingQuery) {
                        e.preventDefault();
                        handleRespond(latestPendingQuery.id);
                      }
                    }}
                    rows={2}
                    className="resize-none text-sm rounded-xl"
                  />
                  <Button
                    size="icon"
                    onClick={() => handleRespond(latestPendingQuery.id)}
                    disabled={!response.trim() || submitting}
                    className="h-10 w-10 rounded-xl flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
