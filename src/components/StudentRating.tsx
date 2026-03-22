import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const StudentRating = () => {
<<<<<<< HEAD
  const [currentRating, setCurrentRating] = useState<"up" | "down" | null>(null);
=======
  const [currentRating, setCurrentRating] = useState<string | null>(null);
  const [totalLikes, setTotalLikes] = useState<number>(0);
>>>>>>> b17f7b7 (Describe what changes you made)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRating();
    fetchLikesCount();
  }, []);

<<<<<<< HEAD
  const normalizeRating = (value?: string | null): "up" | "down" | null => {
    if (!value) return null;
    if (["thumbs-up", "like", "up"].includes(value)) return "up";
    if (["thumbs-down", "dislike", "down"].includes(value)) return "down";
    return null;
=======
  const fetchLikesCount = async () => {
    // Count total likes
    const { count } = await supabase
      .from("system_ratings")
      .select("*", { count: "exact", head: true })
      .eq("rating_type", "like");

    if (count !== null) setTotalLikes(count);
>>>>>>> b17f7b7 (Describe what changes you made)
  };

  const fetchRating = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("system_ratings")
      .select("rating_type")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Fetch rating error:", error);
      return;
    }

    setCurrentRating(normalizeRating(data?.rating_type));
  };

  const handleRate = async (type: "up" | "down") => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please sign in to rate");
        return;
      }

      const ratingType = type === "up" ? "like" : "dislike";

      const { error } = await supabase
        .from("system_ratings")
        .upsert(
          {
            user_id: user.id,
            rating_type: ratingType,
            star_rating: type === "up" ? 10 : 1,
          },
          { onConflict: "user_id" }
        );

      if (error) throw error;

<<<<<<< HEAD
      setCurrentRating(type);
      toast.success(type === "up" ? "Thanks for the positive feedback! 🎉" : "Thanks for your feedback. We'll work to improve!");
=======
      // Optimistic update
      if (type === "like" && currentRating !== "like") {
        setTotalLikes(prev => prev + 1);
      } else if (type === "dislike" && currentRating === "like") {
        setTotalLikes(prev => Math.max(0, prev - 1));
      }

      setCurrentRating(type);
      toast.success(type === "like" ? "Thanks for the positive feedback! \uD83C\uDF89" : "Thanks for your feedback. We'll work to improve!");
      // We don't necessarily need to fetchLikesCount() here if we optimistically updated, but keeping it to sync is fine.
      fetchLikesCount();
>>>>>>> b17f7b7 (Describe what changes you made)
    } catch (error: any) {
      console.error("Rating error:", error);
      toast.error(error?.message ? `Failed to submit rating: ${error.message}` : "Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'EduGuide Zimbabwe',
      text: 'Check out EduGuide Zimbabwe student dashboard!',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatLikes = (num: number) => {
    // Show the full number instead of shorthand per user request
    const value = 10000 + num;
    return value.toString();
  };

  return (
<<<<<<< HEAD
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleRate("up")}
        disabled={loading}
        className={`p-2 rounded-xl transition-all ${
          currentRating === "up"
            ? "bg-primary/15 text-primary scale-110"
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
            ? "bg-destructive/15 text-destructive scale-110"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        } disabled:opacity-50`}
      >
        <ThumbsDown className="w-5 h-5" />
      </button>
=======
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-muted rounded-full overflow-hidden">
          <button
            onClick={() => handleRate("like")}
            disabled={loading}
            className={`group flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all duration-200 border-r border-border hover:bg-green-50 dark:hover:bg-green-950/20 ${currentRating === "like"
                ? "bg-green-100/50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "text-muted-foreground hover:text-green-600 dark:hover:text-green-400"
              }`}
          >
            <ThumbsUp className={`w-4 h-4 transition-transform ${currentRating === "like" ? "scale-110 fill-current" : "group-hover:scale-110"}`} />
            <span>{formatLikes(totalLikes)}</span>
          </button>
          <button
            onClick={() => handleRate("dislike")}
            disabled={loading}
            className={`group flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950/20 ${currentRating === "dislike"
                ? "bg-red-100/50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                : "text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
              }`}
          >
            <ThumbsDown className={`w-4 h-4 transition-transform ${currentRating === "dislike" ? "scale-110 fill-current" : "group-hover:scale-110"}`} />
          </button>
        </div>

        <button
          onClick={handleShare}
          className="group flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-muted hover:bg-muted/80 text-muted-foreground transition-all duration-200"
        >
          <Share2 className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>Share</span>
        </button>
      </div>
>>>>>>> b17f7b7 (Describe what changes you made)
    </div>
  );
};
