import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface AlertEmailProps {
  to: string;
  contactName: string;
  userName: string;
  missedDate: string;
}

export async function sendAlertEmail({ to, contactName, userName, missedDate }: AlertEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Demumu Check-in <onboarding@resend.dev>',
      to: [to],
      subject: `⚠️ Alerta: ${userName} não fez check-in hoje`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 2rem; border-radius: 16px;">
          <h1 style="font-size: 1.5rem; margin-bottom: 1rem;">⚠️ Alerta de Segurança</h1>
          <p style="color: #aaa; line-height: 1.6;">
            Olá <strong style="color: #fff;">${contactName}</strong>,
          </p>
          <p style="color: #aaa; line-height: 1.6;">
            Estamos entrando em contato porque <strong style="color: #ff5050;">${userName}</strong> 
            não realizou o check-in diário de segurança no dia <strong style="color: #fff;">${missedDate}</strong>.
          </p>
          <div style="background: rgba(255, 80, 80, 0.1); border: 1px solid rgba(255, 80, 80, 0.3); border-radius: 12px; padding: 1rem; margin: 1.5rem 0;">
            <p style="color: #ff5050; font-weight: 600; margin: 0;">
              Recomendamos que você entre em contato para verificar se está tudo bem.
            </p>
          </div>
          <p style="color: #666; font-size: 0.8rem; margin-top: 2rem;">
            Este é um email automático enviado pelo sistema Demumu Check-in de Segurança.
          </p>
        </div>
      `,
    });

      if (error) {
      console.error('Erro ao enviar email:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function sendSOSEmail({ to, contactName, userName, missedDate }: AlertEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Demumu Check-in <onboarding@resend.dev>',
      to: [to],
      subject: `🚨 SOS URGENTE: ${userName} PRECISA DE AJUDA!`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #ff0000; color: #ffffff; padding: 2rem; border-radius: 16px; border: 4px solid #cc0000;">
          <h1 style="font-size: 2rem; margin-bottom: 1rem; text-align: center; text-transform: uppercase;">🚨 SOS Acionado 🚨</h1>
          <p style="font-size: 1.2rem; line-height: 1.6; text-align: center;">
            <strong style="color: #fff;">${contactName}</strong>,
          </p>
          <div style="background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; text-align: center;">
            <p style="font-size: 1.2rem; margin: 0;">
              O usuário <strong>${userName}</strong> acabou de apertar o <strong>BOTÃO DE PÂNICO</strong> no sistema Demumu.
            </p>
            <p style="font-size: 1.5rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0;">
              POR FAVOR, ENTRE EM CONTATO IMEDIATAMENTE.
            </p>
          </div>
          <p style="text-align: center; font-size: 0.9rem; margin-top: 2rem; opacity: 0.8;">
            Acionado em: ${missedDate}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Erro ao enviar SOS:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err };
  }
}
