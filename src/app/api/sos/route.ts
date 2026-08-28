import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { sendSOSEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 1. Pega os contatos de emergência
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*');

    if (contactsError) throw contactsError;

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({ error: 'Nenhum contato configurado' }, { status: 400 });
    }

    // 2. Registra o alerta SOS no banco
    await supabase
      .from('alerts')
      .insert([{
        alert_type: 'sos_panic',
        message: `ALERTA DE EMERGÊNCIA (SOS) acionado por ${session.user.email}`,
        contacts_notified: contacts.map(c => c.email).join(', '),
        resolved: false,
      }]);

    // 3. Envia emails com template de URGÊNCIA
    let sentCount = 0;
    const now = new Date().toLocaleString('pt-BR');

    for (const contact of contacts) {
      const result = await sendSOSEmail({
        to: contact.email,
        contactName: contact.name,
        userName: session.user.email || 'Usuário',
        missedDate: `AGORA MESMO (${now}) - MODO PÂNICO`,
      });
      if (result.success) sentCount++;
    }

    return NextResponse.json({ message: `SOS enviado para ${sentCount} contatos!` });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Falha ao enviar SOS' }, { status: 500 });
  }
}
