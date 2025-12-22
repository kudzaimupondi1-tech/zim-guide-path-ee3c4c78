import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://woyzdeznpsyxehtghtqp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndveXpkZXpucHN5eGVodGdodHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzODkwNjcsImV4cCI6MjA4MTk2NTA2N30.V7UVKuGv-I9FWHOYjtxECEk24WLIIgde7rocX9wNbtM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
