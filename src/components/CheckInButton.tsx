"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckInButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleCheckIn = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
      });
      
      if (response.ok) {
        setStatus("success");
        setMessage("Seu check-in foi registrado com sucesso. Vejo você amanhã!");
        setTimeout(() => {
          setStatus('idle');
          router.refresh();
        }, 3000);
      } else {
        setStatus("error");
        setMessage("Erro ao registrar check-in.");
      }
    } catch (error) {
      console.error("Erro ao fazer check-in:", error);
      setStatus("error");
      setMessage("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1rem',
      position: 'relative'
    }}>
      {/* Círculo de brilho atrás do botão */}
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 0,
      }}></div>

      <button
        onClick={handleCheckIn}
        disabled={status === 'loading' || status === 'success'}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: '4px solid rgba(16, 185, 129, 0.3)',
          background: 'linear-gradient(145deg, rgba(16,185,129,0.1) 0%, rgba(5,5,5,1) 100%)',
          color: '#10b981',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          cursor: (status === 'loading' || status === 'success') ? 'not-allowed' : 'pointer',
          boxShadow: '0 0 40px rgba(16, 185, 129, 0.2), inset 0 0 20px rgba(16, 185, 129, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          opacity: status === 'loading' ? 0.7 : 1,
          backdropFilter: 'blur(10px)',
        }}
        onMouseOver={(e) => {
          if (status === 'idle') {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 0 60px rgba(16, 185, 129, 0.4), inset 0 0 30px rgba(16, 185, 129, 0.2)';
            e.currentTarget.style.border = '4px solid rgba(16, 185, 129, 0.6)';
          }
        }}
        onMouseOut={(e) => {
          if (status === 'idle') {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 40px rgba(16, 185, 129, 0.2), inset 0 0 20px rgba(16, 185, 129, 0.1)';
            e.currentTarget.style.border = '4px solid rgba(16, 185, 129, 0.3)';
          }
        }}
        onMouseDown={(e) => {
          if (status === 'idle') {
            e.currentTarget.style.transform = 'scale(0.95)';
          }
        }}
        onMouseUp={(e) => {
          if (status === 'idle') {
            e.currentTarget.style.transform = 'scale(1.05)';
          }
        }}
      >
        <span style={{ fontSize: '2.5rem', transition: 'transform 0.3s', transform: status === 'success' ? 'scale(1.2)' : 'scale(1)' }}>
          {status === 'success' ? '✅' : '🛡️'}
        </span>
        {status === 'idle' && 'Estou Bem'}
        {status === 'loading' && 'Processando...'}
        {status === 'success' && 'Registrado!'}
        {status === 'error' && 'Erro!'}
      </button>

      {message && (
        <p style={{
          marginTop: '2rem',
          color: status === 'success' ? '#10b981' : '#ff5050',
          fontWeight: '500',
          fontSize: '1.1rem',
          animation: 'fadeIn 0.5s ease-in',
          textAlign: 'center',
          maxWidth: '300px'
        }}>
          {message}
        </p>
      )}
    </div>
  );
}
