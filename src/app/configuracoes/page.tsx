import AlertSettings from "@/components/AlertSettings";
import Link from "next/link";

export default function Configuracoes() {
  return (
    <main className="main-layout settings-page">
      <div className="page-header">
        <Link href="/" className="back-link">
          ← Voltar
        </Link>
        <h1 className="page-title">Configurações</h1>
        <p className="page-subtitle">
          Gerencie seus contatos de emergência e preferências de alerta.
        </p>
      </div>

      <AlertSettings />
    </main>
  );
}
