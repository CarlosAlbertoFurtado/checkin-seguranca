"use client";

import { useState, useEffect } from 'react';

export default function VacationModeSettings() {
  const [isVacation, setIsVacation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.data?.vacation_mode) {
          setIsVacation(true);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const toggleVacation = async () => {
    setIsLoading(true);
    const newValue = !isVacation;
    
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vacation_mode: newValue })
      });
      
      if (res.ok) {
        setIsVacation(newValue);
        setMessage(newValue ? 'Modo férias ativado! Você não receberá alertas.' : 'Modo férias desativado.');
      }
    } catch (e) {
      setMessage('Erro ao atualizar configurações.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '2rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✈️ Modo Viagem (Férias)
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>
            Pause os check-ins e alertas diários sem perder sua ofensiva.
          </p>
        </div>
        
        <button
          onClick={toggleVacation}
          disabled={isLoading}
          style={{
            background: isVacation ? '#10b981' : '#333',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s',
            fontWeight: 'bold',
            minWidth: '100px'
          }}
        >
          {isLoading ? '...' : (isVacation ? 'Ativado' : 'Desativado')}
        </button>
      </div>
      
      {message && (
        <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: isVacation ? '#10b981' : '#aaa' }}>
          {message}
        </div>
      )}
    </div>
  );
}
