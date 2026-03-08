import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MAX_STARS = 10;

export const StudentRating = () => {
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRating();
  }, []);

  const fetchRating = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("system_ratings")
      .select("star_rating")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data?.star_rating) setCurrentRating(data.star_rating);
  };

  const handleRate = async (stars: number) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Please sign in to rate"); return; }

      const { error } = await supabase
        .from("system_ratings")
        .upsert({
          user_id: user.id,
          rating_type: `${stars}-star`,
          star_rating: stars,
        } as any, { onConflict: "user_id" });

      if (error) throw error;
      setCurrentRating(stars);
      toast.success(stars >= 7 ? "Thanks for the great rating! 🎉" : stars >= 4 ? "Thanks for your feedback!" : "Thanks for your feedback. We'll work to improve!");
    } catch (error: any) {
      toast.error("Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  const displayRating = hoverRating || currentRating;

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: MAX_STARS }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            disabled={loading}
            className="p-0.5 transition-transform hover:scale-110 disabled:opacity-50"
          >
            <Star
              className={`w-5 h-5 transition-colors ${
                star <= displayRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
      </div>
      {currentRating > 0 && (
        <span className="text-[11px] text-muted-foreground">{currentRating}/10</span>
      )}
    </div>
  );
};
