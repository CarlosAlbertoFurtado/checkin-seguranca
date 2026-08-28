import CheckInButton from "@/components/CheckInButton";
import CheckInHistory from "@/components/CheckInHistory";

export default function Home() {
  return (
    <main className="main-layout">
      <div className="hero-text">
        <h1 className="hero-title">Demumu</h1>
        <p className="hero-subtitle">
          Pressione o botão todos os dias para informar que você está bem.
        </p>
      </div>
      
      <CheckInButton />
      
      <CheckInHistory />
    </main>
  );
}
