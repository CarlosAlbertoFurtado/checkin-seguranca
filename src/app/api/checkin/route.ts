import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Pega o usuário logado
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Insere um novo registro na tabela 'checkins' do Supabase
    const { data, error } = await supabase
      .from('checkins')
      .insert([
        { user_name: session.user.email } 
      ])
      .select();

    if (error) {
      console.error("Erro do Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Retorna uma resposta de sucesso para o frontend
    return NextResponse.json(
      { message: 'Check-in salvo com sucesso no banco de dados!', data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: 'Falha interna no servidor' }, { status: 500 });
  }
}
