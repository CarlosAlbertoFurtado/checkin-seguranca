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

    // 1. Verifica se tem algum modo férias ativado
    const { data: vacationSettings, error: vacationError } = await supabase
      .from('user_settings')
      .select('vacation_mode')
      .eq('vacation_mode', true);

    if (!vacationError && vacationSettings && vacationSettings.length > 0) {
      return NextResponse.json({
        status: 'ok',
        message: 'Modo férias ativado. Nenhum alerta será enviado.',
      });
    }

    // 2. Busca check-ins de HOJE
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

    // Enviar email real para os contatos usando a Resend
    const { sendAlertEmail } = await import('@/lib/email');
    
    let sentCount = 0;
    for (const contact of contacts) {
      const result = await sendAlertEmail({
        to: contact.email,
        contactName: contact.name,
        userName: 'Usuário', // No futuro, pegaremos o nome do usuário logado
        missedDate: today.toLocaleDateString('pt-BR'),
      });
      
      if (result.success) sentCount++;
    }

    console.log(`🚨 ALERTA: Sem check-in hoje! ${sentCount} email(s) enviado(s) com sucesso.`);

    return NextResponse.json({
      status: 'alert',
      message: `ALERTA: Sem check-in hoje! ${sentCount} email(s) enviado(s).`,
      contacts: contacts.map(c => ({ name: c.name, email: c.email })),
    });

  } catch (err) {
    return NextResponse.json({ error: 'Falha na verificação diária' }, { status: 500 });
  }
}
