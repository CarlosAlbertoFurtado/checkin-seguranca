import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET - Busca as configurações do usuário
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_name', session.user.email)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignora erro de "nenhuma linha encontrada"
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Retorna as configurações ou um padrão caso não exista
    return NextResponse.json({ data: data || { vacation_mode: false } }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}

// POST - Atualiza as configurações
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vacation_mode } = body;

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_settings')
      .upsert([{ 
        user_name: session.user.email, 
        vacation_mode 
      }], { onConflict: 'user_name' })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}
