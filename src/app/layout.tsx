import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Demumu | Are you dead yet?",
  description: "Um app minimalista de check-in diário para sua segurança.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="header">
          <div className="logo">Demumu</div>
          <a href="#" className="settings-link">Configurações</a>
        </header>
        {children}
      </body>
    </html>
  );
}
