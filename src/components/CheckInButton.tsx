"use client";

import React, { useState } from "react";

export default function CheckInButton() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      // Aqui estamos chamando o nosso Backend (API route que acabamos de criar)
      const response = await fetch('/api/checkin', {
        method: 'POST',
      });
      
      if (response.ok) {
        setIsCheckedIn(true);
      }
    } catch (error) {
      console.error("Erro ao fazer check-in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="button-container">
      <div className={`glow-effect ${isCheckedIn ? "glow-checked" : ""}`}></div>
      <button 
        className={`check-in-button ${isCheckedIn ? "checked" : ""} ${isLoading ? "loading" : ""}`}
        onClick={handleCheckIn}
        disabled={isCheckedIn || isLoading}
      >
        <span className="button-text">
          {isLoading ? "Processando..." : (isCheckedIn ? "Check-in Feito ✓" : "Estou Vivo")}
        </span>
      </button>
      {isCheckedIn && (
        <p className="status-message">
          Seu check-in foi registrado com sucesso. Vejo você amanhã!
        </p>
      )}
    </div>
  );
}
