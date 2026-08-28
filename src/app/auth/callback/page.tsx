"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState('Autenticando...');
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // O Supabase coloca os tokens na URL (hash fragment)
        // O cliente JS do Supabase detecta automaticamente e troca por uma sessão
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setStatus('Erro na autenticação. Tente novamente.');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        if (data.session) {
          setStatus('Login realizado com sucesso! Redirecionando...');
          router.push('/');
          router.refresh();
        } else {
          // Aguarda o Supabase processar o hash da URL
          const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
              setStatus('Login realizado com sucesso! Redirecionando...');
              router.push('/');
              router.refresh();
            }
          });

          // Timeout de segurança
          setTimeout(() => {
            setStatus('Tempo esgotado. Redirecionando para login...');
            router.push('/login');
          }, 5000);
        }
      } catch (err) {
        setStatus('Erro inesperado. Redirecionando...');
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    handleAuth();
  }, [router]);

  return (
    <main className="main-layout">
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔐</div>
        <p style={{ color: '#aaa', fontSize: '1.1rem' }}>{status}</p>
      </div>
    </main>
  );
}
