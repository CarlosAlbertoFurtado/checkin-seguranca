import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Usar createBrowserClient garante que o Supabase guarde a sessão em Cookies 
// e não apenas no LocalStorage, permitindo que o Middleware no servidor consiga ler.
export const supabase = createBrowserClient(supabaseUrl, supabaseKey);
