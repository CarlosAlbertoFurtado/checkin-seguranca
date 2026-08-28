"use client";

import React, { useState, useEffect } from "react";

interface CheckIn {
  id: number;
  created_at: string;
  user_name: string;
}

export default function CheckInHistory() {
  const [history, setHistory] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/checkins');
      if (response.ok) {
        const result = await response.json();
        setHistory(result.data || []);
      }
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calcula quantos dias consecutivos de check-in (streak)
  const calculateStreak = () => {
    if (history.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Pega as datas únicas dos check-ins
    const uniqueDates = [...new Set(history.map(h => {
      const d = new Date(h.created_at);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }))].sort((a, b) => b - a); // Ordena do mais recente
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);
      
      if (uniqueDates[i] === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  if (isLoading) {
    return (
      <div className="history-container">
        <p className="history-loading">Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2 className="history-title">Histórico de Check-ins</h2>
        <div className="streak-badge">
          <span className="streak-fire">🔥</span>
          <span className="streak-count">{calculateStreak()}</span>
          <span className="streak-label">dias seguidos</span>
        </div>
      </div>

      {history.length === 0 ? (
        <p className="history-empty">Nenhum check-in registrado ainda.</p>
      ) : (
        <div className="history-timeline">
          {history.map((checkin, index) => (
            <div key={checkin.id} className="timeline-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <span className="timeline-date">{formatDate(checkin.created_at)}</span>
                <span className="timeline-time">{formatTime(checkin.created_at)}</span>
              </div>
              <span className="timeline-status">✓ Bem</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
