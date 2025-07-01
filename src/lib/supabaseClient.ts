// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Replace with your actual project credentials from Supabase dashboard
const supabaseUrl = 'https://hdniaebxeznyuqjongfw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkbmlhZWJ4ZXpueXVxam9uZ2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODgzNzYsImV4cCI6MjA2NjI2NDM3Nn0.Id0ITiczP0y0VSJU1Ihy3Is0u4xeLuE54lIFNtyFKwg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
