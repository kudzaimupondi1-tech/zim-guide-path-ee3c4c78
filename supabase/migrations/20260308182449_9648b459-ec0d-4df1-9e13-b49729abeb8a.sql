
-- Student diplomas table: stores which diplomas a student holds
CREATE TABLE public.student_diplomas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  diploma_id UUID NOT NULL REFERENCES public.diplomas(id) ON DELETE CASCADE,
  classification TEXT DEFAULT 'Pass',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, diploma_id)
);

-- Enable RLS
ALTER TABLE public.student_diplomas ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Students can view own diplomas" ON public.student_diplomas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students can insert own diplomas" ON public.student_diplomas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students can delete own diplomas" ON public.student_diplomas FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Students can update own diplomas" ON public.student_diplomas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all student diplomas" ON public.student_diplomas FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
