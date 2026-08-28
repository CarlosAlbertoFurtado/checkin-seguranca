import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Criamos um único cliente do Supabase para usar em todo o app
export const supabase = createClient(supabaseUrl, supabaseKey);
