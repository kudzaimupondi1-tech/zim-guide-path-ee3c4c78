import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const StudentRating = () => {
  const [currentRating, setCurrentRating] = useState<"up" | "down" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRating();
  }, []);

  const fetchRating = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("system_ratings")
      .select("rating_type")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data?.rating_type === "thumbs-up") setCurrentRating("up");
    else if (data?.rating_type === "thumbs-down") setCurrentRating("down");
  };

  const handleRate = async (type: "up" | "down") => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Please sign in to rate"); return; }

      const ratingType = type === "up" ? "thumbs-up" : "thumbs-down";

      // Check if rating exists
      const { data: existing } = await supabase
        .from("system_ratings")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      let error;
      if (existing) {
        ({ error } = await supabase
          .from("system_ratings")
          .update({ rating_type: ratingType, star_rating: type === "up" ? 10 : 1 })
          .eq("user_id", user.id));
      } else {
        ({ error } = await supabase
          .from("system_ratings")
          .insert({ user_id: user.id, rating_type: ratingType, star_rating: type === "up" ? 10 : 1 }));
      }

      if (error) throw error;
      setCurrentRating(type);
      toast.success(type === "up" ? "Thanks for the positive feedback! 🎉" : "Thanks for your feedback. We'll work to improve!");
    } catch (error: any) {
      console.error("Rating error:", error);
      toast.error("Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleRate("up")}
        disabled={loading}
        className={`p-2 rounded-xl transition-all ${
          currentRating === "up"
            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 scale-110"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        } disabled:opacity-50`}
      >
        <ThumbsUp className="w-5 h-5" />
      </button>
      <button
        onClick={() => handleRate("down")}
        disabled={loading}
        className={`p-2 rounded-xl transition-all ${
          currentRating === "down"
            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 scale-110"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        } disabled:opacity-50`}
      >
        <ThumbsDown className="w-5 h-5" />
      </button>
    </div>
  );
};
