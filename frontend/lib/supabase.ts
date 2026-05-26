import { createClient } from "@supabase/supabase-js";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "https://eziqzghnxrkabgytsrkj.supabase.co";
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6aXF6Z2hueHJrYWJneXRzcmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3OTU0NzcsImV4cCI6MjA5NTM3MTQ3N30.vih450T89DWoRtd8ooEhsYsX1MC4rVlP_JY7H8Pl5UU";

export const supabase = createClient(url, key);
