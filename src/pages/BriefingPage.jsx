import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://backstop-api.vercel.app';

export default function BriefingPage({ token }) {
  const { opponentId } = useParams();
  const navigate = useNavigate();
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('batting');

  useEffect(() => {
    const fetchBriefing = async () => {
      try {
        const res = await fetch(`${API_URL}/api/opponents/${opponentId}/briefing`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setBriefing(data);
      } catch (err) {
        setError('Failed to load briefing');
      } finally {
        setLoading(false);
      }
    };
    fetchBriefing();
  }, [opponentId, token]);

  if (loading) {
    return <div className="briefing"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="briefing error-message">{error}</div>;
  }

  if (!briefing || briefing.games_count === 0) {
    return (
      <div className="briefing">
        <div className="empty-state">
          <p>No games uploaded yet.</p>
          <button onClick={() => navigate(`/opponents/${opponentId}/upload`)} className="btn-primary">
            Upload First Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="briefing">
      <div className="briefing-header">
        <button onClick={() => navigate('/')} className="back-btn">← Back</button>
        <h1>Pre-Game Brief</h1>
        <p style={{ color: '#94a3b8' }}>
          {briefing.games_count} games tracked • Updated {new Date(briefing.last_updated).toLocaleDateString()}
        </p>
      </div>

      <div className="view-toggle">
        <button 
          className={view === 'batting' ? 'active' : ''}
          onClick={() => setView('batting')}
        >
          ⚾ BATTING
        </button>
        <button 
          className={view === 'pitching' ? 'active' : ''}
          onClick={() => setView('pitching')}
        >
          🏐 PITCHING
        </button>
      </div>

      {view === 'batting' && (
        <div className="stats-section">
          <h2>Offensive Threats</h2>
          {briefing.batting.length === 0 ? (
            <p>No batting data yet.</p>
          ) : (
            <div className="stats-table">
              <table>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>AVG</th>
                    <th>OBP</th>
                    <th>K%</th>
                    <th>AB</th>
                    <th>H</th>
                    <th>2B</th>
                    <th>HR</th>
                    <th>SB</th>
                  </tr>
                </thead>
                <tbody>
                  {briefing.batting.map((player, i) => (
                    <tr key={i} className={player.threat ? 'threat' : ''}>
                      <td className="player-name">
                        {player.threat && '⚠️ '}{player.name}
                      </td>
                      <td><strong>{player.avg}</strong></td>
                      <td>{player.obp}</td>
                      <td>{player.k_pct}%</td>
                      <td>{player.ab}</td>
                      <td>{player.h}</td>
