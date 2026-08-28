import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET — Busca todos os contatos de emergência
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}

// POST — Adiciona um novo contato de emergência
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Nome e email são obrigatórios' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email, phone: phone || null }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}

// DELETE — Remove um contato de emergência pelo ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', Number(id));

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Contato removido' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}
