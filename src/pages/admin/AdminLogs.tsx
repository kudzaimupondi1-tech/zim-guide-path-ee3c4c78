import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2, Activity } from "lucide-react";
import { format } from "date-fns";

interface LogEntry {
  id: string;
  event_type: string;
  event_data: any;
  user_id: string | null;
  session_id: string | null;
  created_at: string;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await supabase.from("analytics_logs").select("*").order("created_at", { ascending: false }).limit(200);
        setLogs(data || []);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filtered = logs.filter(l => 
    searchQuery === "" || 
    l.event_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.user_id?.includes(searchQuery)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold text-foreground">System Logs</h1><p className="text-muted-foreground mt-1">View system activity and events</p></div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by event type or user ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        <Card><CardContent className="p-0">
          {loading ? <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No logs found</div>
          ) : (
            <Table>
              <TableHeader><TableRow>
                <TableHead>Event</TableHead><TableHead>User ID</TableHead><TableHead>Data</TableHead><TableHead>Date</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map(l => (
                  <TableRow key={l.id}>
                    <TableCell><Badge variant="outline" className="text-xs">{l.event_type}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{l.user_id ? l.user_id.substring(0, 8) + "..." : "—"}</TableCell>
                    <TableCell className="max-w-[300px]"><p className="text-xs text-muted-foreground truncate">{l.event_data ? JSON.stringify(l.event_data) : "—"}</p></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{format(new Date(l.created_at), "MMM d, HH:mm:ss")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent></Card>
      </div>
    </AdminLayout>
  );
}
