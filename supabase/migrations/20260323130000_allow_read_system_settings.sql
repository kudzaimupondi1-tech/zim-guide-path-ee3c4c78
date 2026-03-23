-- Allow anyone to read system settings so the client UI can correctly respect global toggles
CREATE POLICY "Anyone can view system settings" ON public.system_settings FOR SELECT USING (true);
