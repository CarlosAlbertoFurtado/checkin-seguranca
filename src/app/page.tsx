import CheckInButton from "@/components/CheckInButton";
import CheckInHistory from "@/components/CheckInHistory";
import SosButton from "@/components/SosButton";
import EmergencyContacts from "@/components/EmergencyContacts";
import VacationModeSettings from "@/components/VacationModeSettings";

export default async function Home() {
  return (
    <main className="main-layout">

      <div style={{ flex: 1 }}>
        <CheckInButton />
        <SosButton />
        <CheckInHistory />
      </div>
      
      <div className="settings-section">
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>⚙️ Configurações</h2>
        <VacationModeSettings />
        <EmergencyContacts />
      </div>
    </main>
  );
}
