"use client";

import React, { useState, useEffect } from "react";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export default function AlertSettings() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      if (response.ok) {
        const result = await response.json();
        setContacts(result.data || []);
      }
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone: phone || null }),
      });

      if (response.ok) {
        setMessage("Contato adicionado com sucesso!");
        setName("");
        setEmail("");
        setPhone("");
        fetchContacts();
      } else {
        setMessage("Erro ao adicionar contato.");
      }
    } catch (error) {
      setMessage("Erro de conexão.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteContact = async (id: number) => {
    try {
      const response = await fetch(`/api/contacts?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContacts(contacts.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error("Erro ao remover contato:", error);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title">🚨 Contatos de Emergência</h2>
          <p className="settings-section-desc">
            Se você não fizer check-in em um dia, estas pessoas serão notificadas automaticamente.
          </p>
        </div>

        <form className="contact-form" onSubmit={handleAddContact}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contact-name" className="form-label">Nome</label>
              <input
                id="contact-name"
                type="text"
                className="form-input"
                placeholder="Ex: Mãe, Pai, Amigo..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email" className="form-label">Email</label>
              <input
                id="contact-email"
                type="email"
                className="form-input"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-phone" className="form-label">Telefone (opcional)</label>
              <input
                id="contact-phone"
                type="tel"
                className="form-input"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn-add-contact" disabled={isSaving}>
            {isSaving ? "Salvando..." : "+ Adicionar Contato"}
          </button>
        </form>

        {message && <p className="form-message">{message}</p>}

        {isLoading ? (
          <p className="history-loading">Carregando contatos...</p>
        ) : contacts.length === 0 ? (
          <div className="empty-contacts">
            <p>Nenhum contato cadastrado ainda.</p>
            <p className="text-muted">Adicione pelo menos um contato para ativar o sistema de alertas.</p>
          </div>
        ) : (
          <div className="contacts-list">
            {contacts.map((contact) => (
              <div key={contact.id} className="contact-card">
                <div className="contact-info">
                  <span className="contact-name">{contact.name}</span>
                  <span className="contact-email">{contact.email}</span>
                  {contact.phone && <span className="contact-phone">{contact.phone}</span>}
                </div>
                <button
                  className="btn-delete-contact"
                  onClick={() => handleDeleteContact(contact.id)}
                  title="Remover contato"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title">⏰ Como funciona o alerta</h2>
        </div>
        <div className="alert-info-cards">
          <div className="alert-info-card">
            <span className="alert-info-icon">1️⃣</span>
            <p>Todos os dias, o sistema verifica se você fez check-in</p>
          </div>
          <div className="alert-info-card">
            <span className="alert-info-icon">2️⃣</span>
            <p>Se até às 21h você <strong>não</strong> apertou o botão &ldquo;Estou Vivo&rdquo;...</p>
          </div>
          <div className="alert-info-card">
            <span className="alert-info-icon">3️⃣</span>
            <p>Um email automático é enviado para todos os seus contatos de emergência</p>
          </div>
        </div>
      </div>
    </div>
  );
}
