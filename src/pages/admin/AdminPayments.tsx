import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, CreditCard, RefreshCw, Loader2, DollarSign, Users, TrendingUp, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  university_count: number;
  phone_number: string;
  status: string;
  ecocash_reference: string | null;
  client_correlator: string;
  reference_code: string;
  created_at: string;
  updated_at: string;
  student_level: string | null;
  refund_status: string | null;
  refund_notes: string | null;
  refunded_at: string | null;
  profiles?: { full_name: string | null; email: string | null } | null;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundNotes, setRefundNotes] = useState("");
  const [refundLoading, setRefundLoading] = useState(false);
  const { toast } = useToast();

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("payments").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      
      // Fetch profiles for each payment
      const userIds = [...new Set((data || []).map(p => p.user_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email").in("user_id", userIds);
      
      const enriched = (data || []).map(p => ({
        ...p,
        profiles: profiles?.find(pr => pr.user_id === p.user_id) || null,
      }));
      setPayments(enriched);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load payments", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleRefund = async (status: "approved" | "rejected") => {
    if (!selectedPayment) return;
    setRefundLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase.from("payments").update({
        refund_status: status,
        refund_notes: refundNotes,
        refunded_at: new Date().toISOString(),
        refunded_by: session?.user?.id,
        status: status === "approved" ? "refunded" : selectedPayment.status,
      } as any).eq("id", selectedPayment.id);
      if (error) throw error;
      toast({ title: "Success", description: `Refund ${status}` });
      setSelectedPayment(null);
      setRefundNotes("");
      fetchPayments();
    } catch (error) {
      toast({ title: "Error", description: "Failed to process refund", variant: "destructive" });
    } finally {
      setRefundLoading(false);
    }
  };

  const filtered = payments.filter(p => {
    const matchesSearch = searchQuery === "" || 
      p.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reference_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone_number.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = payments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);
  const totalTransactions = payments.length;
  const pendingRefunds = payments.filter(p => p.refund_status === "pending").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold text-foreground">Payments Management</h1><p className="text-muted-foreground mt-1">Track and manage all student payments</p></div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Revenue</p><p className="text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</p></div><DollarSign className="w-8 h-8 text-green-500" /></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Transactions</p><p className="text-2xl font-bold text-foreground">{totalTransactions}</p></div><CreditCard className="w-8 h-8 text-primary" /></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Pending Refunds</p><p className="text-2xl font-bold text-foreground">{pendingRefunds}</p></div><RefreshCw className="w-8 h-8 text-yellow-500" /></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Students</p><p className="text-2xl font-bold text-foreground">{new Set(payments.map(p => p.user_id)).size}</p></div><Users className="w-8 h-8 text-primary" /></div></CardContent></Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search by name, email, reference..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" /></div>
          <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="failed">Failed</SelectItem><SelectItem value="refunded">Refunded</SelectItem></SelectContent></Select>
        </div>

        <Card><CardContent className="p-0">
          {loading ? <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : (
            <Table>
              <TableHeader><TableRow>
                <TableHead>Student</TableHead><TableHead>Level</TableHead><TableHead>Amount</TableHead><TableHead>Universities</TableHead><TableHead>Phone</TableHead><TableHead>Status</TableHead><TableHead>Refund</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.id}>
                    <TableCell><div><p className="font-medium text-sm">{p.profiles?.full_name || "N/A"}</p><p className="text-xs text-muted-foreground">{p.profiles?.email || ""}</p></div></TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{p.student_level || "N/A"}</Badge></TableCell>
                    <TableCell className="font-semibold">${p.amount.toFixed(2)}</TableCell>
                    <TableCell>{p.university_count === 0 ? "All" : p.university_count}</TableCell>
                    <TableCell className="text-sm">{p.phone_number}</TableCell>
                    <TableCell><Badge className={`text-xs ${p.status === "completed" ? "bg-green-100 text-green-700" : p.status === "failed" ? "bg-red-100 text-red-700" : p.status === "refunded" ? "bg-purple-100 text-purple-700" : "bg-yellow-100 text-yellow-700"}`}>{p.status}</Badge></TableCell>
                    <TableCell>{p.refund_status ? <Badge variant="outline" className="text-xs capitalize">{p.refund_status}</Badge> : "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{format(new Date(p.created_at), "MMM d, yyyy HH:mm")}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={() => { setSelectedPayment(p); setRefundNotes(p.refund_notes || ""); }}><Eye className="w-4 h-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent></Card>
      </div>

      <Dialog open={!!selectedPayment} onOpenChange={open => { if (!open) setSelectedPayment(null); }}>
        <DialogContent className="max-w-lg">
          {selectedPayment && (
            <>
              <DialogHeader><DialogTitle>Payment Details</DialogTitle></DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs text-muted-foreground">Student</Label><p className="font-medium">{selectedPayment.profiles?.full_name || "N/A"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Email</Label><p>{selectedPayment.profiles?.email || "N/A"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Amount</Label><p className="font-bold">${selectedPayment.amount.toFixed(2)} {selectedPayment.currency}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Status</Label><p><Badge className="text-xs">{selectedPayment.status}</Badge></p></div>
                  <div><Label className="text-xs text-muted-foreground">Reference</Label><p className="font-mono text-xs">{selectedPayment.reference_code}</p></div>
                  <div><Label className="text-xs text-muted-foreground">EcoCash Ref</Label><p className="font-mono text-xs">{selectedPayment.ecocash_reference || "N/A"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Level</Label><p>{selectedPayment.student_level || "N/A"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Universities</Label><p>{selectedPayment.university_count === 0 ? "All" : selectedPayment.university_count}</p></div>
                </div>
                
                {selectedPayment.status === "completed" && selectedPayment.refund_status !== "approved" && (
                  <div className="border-t pt-4 space-y-3">
                    <h4 className="font-semibold">Refund Management</h4>
                    <div className="space-y-2">
                      <Label className="text-xs">Refund Notes</Label>
                      <Textarea value={refundNotes} onChange={e => setRefundNotes(e.target.value)} placeholder="Add notes about this refund..." rows={3} />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleRefund("approved")} disabled={refundLoading} className="bg-green-600 hover:bg-green-700">{refundLoading && <Loader2 className="w-4 h-4 animate-spin mr-1" />} Approve Refund</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleRefund("rejected")} disabled={refundLoading}>Reject</Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
