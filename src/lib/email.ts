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
    console.error('Erro fatal ao enviar email:', err);
    return { success: false, error: err };
  }
}
