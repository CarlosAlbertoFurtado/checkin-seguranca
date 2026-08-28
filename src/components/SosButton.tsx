"use client";

import { useState } from 'react';

export default function SosButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSos = async () => {
    // Confirmação extra para evitar cliques acidentais
    if (!window.confirm("ATENÇÃO: Isso enviará um alerta de EMERGÊNCIA para todos os seus contatos imediatamente. Tem certeza?")) {
      return;
    }

    setStatus('loading');
    
    try {
      const response = await fetch('/api/sos', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar SOS');
      }

      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <button 
        onClick={handleSos}
        disabled={status === 'loading'}
        style={{
          backgroundColor: status === 'success' ? '#10b981' : '#dc2626',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          boxShadow: status === 'success' ? 'none' : '0 4px 15px rgba(220, 38, 38, 0.4)',
          transition: 'all 0.3s ease',
          opacity: status === 'loading' ? 0.7 : 1,
        }}
      >
        {status === 'idle' && '🚨 Botão de Pânico (SOS)'}
        {status === 'loading' && 'Enviando...'}
        {status === 'success' && 'SOS Enviado!'}
        {status === 'error' && 'Erro. Tente novamente.'}
      </button>
      <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.5rem' }}>
        Apenas para emergências reais. Dispara email imediato.
      </p>
    </div>
  );
}
