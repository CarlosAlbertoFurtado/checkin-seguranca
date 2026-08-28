import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    // Insere um novo registro na tabela 'checkins' do Supabase
    // O id e created_at serão gerados automaticamente pelo banco
    const { data, error } = await supabase
      .from('checkins')
      .insert([
        { user_name: 'Usuário Padrão' } // No futuro, podemos pegar isso de um login
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
