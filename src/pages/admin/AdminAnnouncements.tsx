import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Megaphone, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  target_audience: string;
  is_published: boolean;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "normal",
    target_audience: "all",
    is_published: false,
    duration: "never",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to load announcements");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let expires_at = null;
      if (formData.duration !== "never") {
        const days = parseInt(formData.duration);
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + days);
        expires_at = expireDate.toISOString();
      } else if (editingAnnouncement && editingAnnouncement.expires_at) {
        // if they are editing and it previously had an expiry, but now it's 'never', we clear it
        expires_at = null;
      }

      const payload = {
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        target_audience: formData.target_audience,
        is_published: formData.is_published,
        published_at: formData.is_published && (!editingAnnouncement || !editingAnnouncement.is_published) ? new Date().toISOString() : editingAnnouncement?.published_at || null,
        expires_at: expires_at,
      };

      if (editingAnnouncement) {
        const { error } = await supabase
          .from("announcements")
          .update(payload)
          .eq("id", editingAnnouncement.id);
        if (error) throw error;
        toast.success("Announcement updated");
      } else {
        const { error } = await supabase
          .from("announcements")
          .insert(payload);
        if (error) throw error;
        toast.success("Announcement created");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error("Error saving announcement:", error);
      toast.error("Failed to save announcement");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const { error } = await supabase.from("announcements").delete().eq("id", id);
      if (error) throw error;
      toast.success("Announcement deleted");
      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error("Failed to delete announcement");
    }
  };

  const togglePublish = async (announcement: Announcement) => {
    try {
      const { error } = await supabase
        .from("announcements")
        .update({
          is_published: !announcement.is_published,
          published_at: !announcement.is_published ? new Date().toISOString() : announcement.published_at,
        })
        .eq("id", announcement.id);
      if (error) throw error;
      toast.success(announcement.is_published ? "Announcement unpublished" : "Announcement published");
      fetchAnnouncements();
    } catch (error) {
      console.error("Error toggling publish:", error);
      toast.error("Failed to update announcement");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      priority: "normal",
      target_audience: "all",
      is_published: false,
      duration: "never",
    });
    setEditingAnnouncement(null);
  };

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    
    let durationStr = "never";
    if (announcement.expires_at) {
      const diff = Math.ceil((new Date(announcement.expires_at).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      if (diff <= 1) durationStr = "1";
      else if (diff <= 3) durationStr = "3";
      else if (diff <= 7) durationStr = "7";
      else if (diff <= 14) durationStr = "14";
      else durationStr = "30";
    }

    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      target_audience: announcement.target_audience,
      is_published: announcement.is_published,
      duration: durationStr,
    });
    setIsDialogOpen(true);
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      low: "secondary",
      normal: "default",
      high: "destructive",
    };
    return <Badge variant={variants[priority] || "default"}>{priority}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Announcements</h1>
            <p className="text-muted-foreground mt-1">Create and manage system announcements</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingAnnouncement ? "Edit Announcement" : "Create Announcement"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Target Audience</Label>
                    <Select value={formData.target_audience} onValueChange={(v) => setFormData({ ...formData, target_audience: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="students">Students Only</SelectItem>
                        <SelectItem value="o-level">O-Level Students</SelectItem>
                        <SelectItem value="a-level">A-Level Students</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Announcement Duration</Label>
                  <Select value={formData.duration} onValueChange={(v) => setFormData({ ...formData, duration: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never Expires</SelectItem>
                      <SelectItem value="1">1 Day</SelectItem>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="7">1 Week</SelectItem>
                      <SelectItem value="14">2 Weeks</SelectItem>
                      <SelectItem value="30">1 Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label>Publish Immediately</Label>
                    <p className="text-xs text-muted-foreground mt-1">Make this visible to users now</p>
                  </div>
                  <Switch
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAnnouncement ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              All Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No announcements yet</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcements.map((announcement) => (
                    <TableRow key={announcement.id}>
                      <TableCell className="font-medium">{announcement.title}</TableCell>
                      <TableCell>{getPriorityBadge(announcement.priority)}</TableCell>
                      <TableCell className="capitalize">{announcement.target_audience}</TableCell>
                      <TableCell>
                        <Badge variant={announcement.is_published ? "default" : "secondary"}>
                          {announcement.is_published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(announcement.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePublish(announcement)}
                          >
                            {announcement.is_published ? "Unpublish" : "Publish"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(announcement)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(announcement.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
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
