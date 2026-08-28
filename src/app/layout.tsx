import type { Metadata } from "next";
import "./globals.css";
import { cookies } from 'next/headers';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Demumu | Are you dead yet?",
  description: "Um app minimalista de check-in diário para sua segurança.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.get('sb-swwhlarojakbnsljvkcb-auth-token');

  return (
    <html lang="pt-BR">
      <body>
        <header className="header">
          <div className="logo">Demumu</div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {hasSession && (
              <>
                <Link href="/configuracoes" className="settings-link">⚙️ Configurações</Link>
                <form action="/auth/logout" method="POST">
                  <button type="submit" className="settings-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Sair</button>
                </form>
              </>
            )}
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
