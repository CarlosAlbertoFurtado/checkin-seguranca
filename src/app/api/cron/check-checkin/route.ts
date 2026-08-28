import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Esta rota é chamada automaticamente pelo Vercel Cron uma vez por dia
// Ela verifica se o usuário fez check-in hoje. Se NÃO fez, alerta os contatos.
export async function GET() {
  try {
    // Pega a data de hoje no formato ISO (ex: "2026-08-28")
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

    // Busca check-ins de HOJE
    const { data: todayCheckins, error: checkinError } = await supabase
      .from('checkins')
      .select('*')
      .gte('created_at', startOfDay)
      .lt('created_at', endOfDay);

    if (checkinError) {
      return NextResponse.json({ error: checkinError.message }, { status: 500 });
    }

    // Se JÁ fez check-in hoje, tudo bem
    if (todayCheckins && todayCheckins.length > 0) {
      return NextResponse.json({
        status: 'ok',
        message: 'Check-in feito hoje. Tudo certo!',
        checkins_today: todayCheckins.length,
      });
    }

    // Se NÃO fez check-in, busca os contatos de emergência
    const { data: contacts, error: contactError } = await supabase
      .from('contacts')
      .select('*');

    if (contactError) {
      return NextResponse.json({ error: contactError.message }, { status: 500 });
    }

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({
        status: 'alert',
        message: 'ALERTA: Sem check-in hoje, mas nenhum contato de emergência cadastrado!',
      });
    }

    // Registra o alerta no banco de dados
    await supabase
      .from('alerts')
      .insert([{
        alert_type: 'no_checkin',
        message: `Usuário não fez check-in em ${today.toLocaleDateString('pt-BR')}`,
        contacts_notified: contacts.map(c => c.email).join(', '),
        resolved: false,
      }]);

    // TODO: Enviar email real para os contatos (integração com Resend/SendGrid)
    // Por enquanto, apenas registramos o alerta no banco
    console.log('🚨 ALERTA: Sem check-in hoje! Contatos a notificar:', contacts);

    return NextResponse.json({
      status: 'alert',
      message: `ALERTA: Sem check-in hoje! ${contacts.length} contato(s) seriam notificados.`,
      contacts: contacts.map(c => ({ name: c.name, email: c.email })),
    });

  } catch (err) {
    return NextResponse.json({ error: 'Falha na verificação diária' }, { status: 500 });
  }
}
