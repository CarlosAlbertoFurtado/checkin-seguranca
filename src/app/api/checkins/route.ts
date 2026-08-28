import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET — Busca todos os check-ins do banco, ordenados do mais recente ao mais antigo
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30); // Últimos 30 check-ins

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Falha interna no servidor' }, { status: 500 });
  }
}
