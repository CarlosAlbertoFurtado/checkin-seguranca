"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CadastroPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setIsError(true);
      setMessage('A senha precisa ter pelo menos 6 caracteres.');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('Este email já está cadastrado. Tente fazer login.');
        }
        throw error;
      }

      // Tenta fazer login automaticamente após o cadastro
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        // Se não conseguiu logar automaticamente, redireciona pro login
        setIsError(false);
        setMessage('Conta criada! Faça login para continuar.');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      setIsError(false);
      setMessage('Conta criada e login realizado! Redirecionando...');
      router.push('/');
      router.refresh();
    } catch (error: any) {
      setIsError(true);
      setMessage(error.message || 'Ocorreu um erro ao criar a conta.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main-layout">
      <div className="login-container">
        <h1 className="login-title">Criar Conta</h1>
        <p className="login-subtitle">Cadastre-se para usar o Demumu.</p>
        
        <form onSubmit={handleSignUp} className="login-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar Senha</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-login" 
            disabled={isLoading || !email || !password || !confirmPassword}
          >
            {isLoading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>

        <div className="login-links">
          <Link href="/login" className="link-button">
            Já tenho uma conta
          </Link>
        </div>

        {message && (
          <div className={`login-message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
