"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      setMessage('Verifique seu email! Enviamos um "Link Mágico" para você acessar sem senha.');
    } catch (error: any) {
      setIsError(true);
      setMessage(error.message || 'Ocorreu um erro ao tentar fazer login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main-layout">
      <div className="login-container" style={{ width: '100%', maxWidth: '400px', marginTop: '4rem', padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 className="page-title" style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '1rem' }}>Demumu</h1>
        <p className="page-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>Faça login para gerenciar sua segurança.</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Seu Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-add-contact" 
            disabled={isLoading || !email}
            style={{ marginTop: '0.5rem' }}
          >
            {isLoading ? 'Enviando...' : 'Enviar Link Mágico'}
          </button>
        </form>

        {message && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '8px', background: isError ? 'rgba(255,80,80,0.1)' : 'rgba(16,185,129,0.1)', color: isError ? '#ff5050' : '#10b981', fontSize: '0.9rem', textAlign: 'center' }}>
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
