
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables! Using dummy client.");
}

// Create a dummy client if env vars are missing to prevent crashes
export const supabase = createClient(
  supabaseUrl || "https://dummy.supabase.co", 
  supabaseAnonKey || "dummy-key"
);
