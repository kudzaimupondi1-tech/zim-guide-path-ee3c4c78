import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Loader2, Search, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Diploma {
  id: string;
  name: string;
  institution: string | null;
  field: string | null;
  level: string;
  duration_years: number | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

const FIELDS = [
  "Engineering", "Health Sciences", "Agriculture", "Education", "Business & Commerce",
  "Information Technology", "Hospitality & Tourism", "Construction", "Automotive",
  "Mining", "Forestry", "Social Sciences", "Arts & Design", "Science & Technology", "Other",
];

const INSTITUTIONS = [
  "HEXCO", "Harare Polytechnic", "Bulawayo Polytechnic", "Kwekwe Polytechnic",
  "Mutare Polytechnic", "Masvingo Polytechnic", "Kushinga Phikelela Polytechnic",
  "Belvedere Technical Teachers College", "Gweru Teachers College",
  "United College of Education", "Hillside Teachers College",
  "Mpilo Hospital School of Nursing", "Parirenyatwa School of Nursing",
  "Ingutsheni School of Nursing", "Zimbabwe School of Mines",
  "Chibero College of Agriculture", "Esigodini College of Agriculture",
  "Gwebi College of Agriculture", "Kushinga Phikelela Agricultural College",
  "Other",
];

export default function AdminDiplomas() {
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDiploma, setEditingDiploma] = useState<Diploma | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    institution: "",
    field: "",
    level: "Diploma",
    duration_years: 2,
    description: "",
    is_active: true,
  });

  const fetchDiplomas = async () => {
    try {
      const { data, error } = await supabase
        .from("diplomas")
        .select("*")
        .order("name");
      if (error) throw error;
      setDiplomas(data || []);
    } catch (error) {
      console.error("Error fetching diplomas:", error);
      toast({ title: "Error", description: "Failed to load diplomas", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDiplomas(); }, []);

  const resetForm = () => {
    setEditingDiploma(null);
    setFormData({
      name: "", institution: "", field: "", level: "Diploma",
      duration_years: 2, description: "", is_active: true,
    });
  };

  const openEditDialog = (diploma: Diploma) => {
    setEditingDiploma(diploma);
    setFormData({
      name: diploma.name,
      institution: diploma.institution || "",
      field: diploma.field || "",
      level: diploma.level,
      duration_years: diploma.duration_years || 2,
      description: diploma.description || "",
      is_active: diploma.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        institution: formData.institution || null,
        field: formData.field || null,
        level: formData.level,
        duration_years: formData.duration_years,
        description: formData.description || null,
        is_active: formData.is_active,
      };

      if (editingDiploma) {
        const { error } = await supabase.from("diplomas").update(payload).eq("id", editingDiploma.id);
        if (error) throw error;
        toast({ title: "Success", description: "Diploma updated successfully" });
        setDiplomas(prev => prev.map(d => d.id === editingDiploma.id ? { ...d, ...payload } : d));
      } else {
        const { error } = await supabase.from("diplomas").insert(payload);
        if (error) throw error;
        toast({ title: "Success", description: "Diploma added successfully" });
        fetchDiplomas();
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving diploma:", error);
      toast({ title: "Error", description: "Failed to save diploma", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Delete related program_diplomas first
      await supabase.from("program_diplomas").delete().eq("diploma_id", id);
      const { error } = await supabase.from("diplomas").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Diploma deleted successfully" });
      setDiplomas(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error("Error deleting diploma:", error);
      toast({ title: "Error", description: "Failed to delete diploma", variant: "destructive" });
    }
  };

  const filteredDiplomas = diplomas.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.field || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.institution || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = diplomas.filter(d => d.is_active).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Diplomas</h1>
            <p className="text-muted-foreground mt-1">
              Manage Zimbabwean diploma qualifications ({activeCount} active of {diplomas.length} total)
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Add Diploma</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingDiploma ? "Edit Diploma" : "Add Diploma"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Diploma Name *</Label>
                  <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. National Diploma in Electrical Engineering" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Select value={formData.institution} onValueChange={v => setFormData({ ...formData, institution: v })}>
                      <SelectTrigger><SelectValue placeholder="Select institution" /></SelectTrigger>
                      <SelectContent>
                        {INSTITUTIONS.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Field</Label>
                    <Select value={formData.field} onValueChange={v => setFormData({ ...formData, field: v })}>
                      <SelectTrigger><SelectValue placeholder="Select field" /></SelectTrigger>
                      <SelectContent>
                        {FIELDS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Qualification Level</Label>
                    <Select value={formData.level} onValueChange={v => setFormData({ ...formData, level: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Diploma">Diploma</SelectItem>
                        <SelectItem value="Higher National Diploma">Higher National Diploma</SelectItem>
                        <SelectItem value="National Certificate">National Certificate</SelectItem>
                        <SelectItem value="National Diploma">National Diploma</SelectItem>
                        <SelectItem value="Certificate">Certificate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (Years)</Label>
                    <Input type="number" min={1} max={5} value={formData.duration_years} onChange={e => setFormData({ ...formData, duration_years: parseInt(e.target.value) || 2 })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="Brief description of the diploma..." />
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="is_active" checked={formData.is_active} onCheckedChange={checked => setFormData({ ...formData, is_active: checked })} />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting || !formData.name.trim()}>
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingDiploma ? "Update" : "Add"} Diploma
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search diplomas by name, field, or institution..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : filteredDiplomas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No diplomas match your search." : "No diplomas found. Add one to get started."}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Diploma Name</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Field</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDiplomas.map(diploma => (
                    <TableRow key={diploma.id}>
                      <TableCell className="font-medium max-w-[250px]">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-muted-foreground shrink-0" />
                          {diploma.name}
                        </div>
                      </TableCell>
                      <TableCell>{diploma.institution || "-"}</TableCell>
                      <TableCell>{diploma.field ? <Badge variant="outline" className="text-xs">{diploma.field}</Badge> : "-"}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{diploma.level}</Badge></TableCell>
                      <TableCell>{diploma.duration_years ? `${diploma.duration_years} yrs` : "-"}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${diploma.is_active ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`}>
                          {diploma.is_active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(diploma)} title="Edit diploma">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Delete diploma">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Diploma?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "{diploma.name}" and remove it from any program requirements.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(diploma.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
