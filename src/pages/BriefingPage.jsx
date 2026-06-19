import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://backstop-api.vercel.app';

export default function BriefingPage({ token }) {
  const { opponentId } = useParams();
  const navigate = useNavigate();
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('batting'); // 'batting' or 'pitching'

  useEffect(() => {
    fetchBriefing();
  }, [opponentId, token]);

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

      {/* Toggle Batting / Pitching */}
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

      {/* BATTING VIEW */}
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
                      <td>{player.doubles}</td>
                      <td>{player.hr}</td>
                      <td>{player.sb}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PITCHING VIEW */}
      {view === 'pitching' && (
        <div className="stats-section">
          <h2>Pitching Staff</h2>
          {briefing.pitching.length === 0 ? (
            <p>No pitching data yet.</p>
          ) : (
            <div className="stats-table">
              <table>
                <thead>
                  <tr>
                    <th>Pitcher</th>
                    <th>ERA</th>
                    <th>WHIP</th>
                    <th>K%</th>
                    <th>IP</th>
                    <th>H</th>
                    <th>ER</th>
                    <th>BB</th>
                    <th>SO</th>
                  </tr>
                </thead>
                <tbody>
                  {briefing.pitching.map((pitcher, i) => (
                    <tr key={i}>
                      <td className="player-name">{pitcher.name}</td>
                      <td><strong>{pitcher.era}</strong></td>
                      <td>{pitcher.whip}</td>
                      <td>{pitcher.k_pct}%</td>
                      <td>{pitcher.ip}</td>
                      <td>{pitcher.h}</td>
                      <td>{pitcher.er}</td>
                      <td>{pitcher.bb}</td>
                      <td>{pitcher.so}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* GAME PLAN */}
      <div className="game-plan-section">
        <h2>Game Plan</h2>
        <ul className="game-plan-list">
          {briefing.game_plan.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* ACTIONS */}
      <div className="briefing-actions">
        <button onClick={() => navigate(`/opponents/${opponentId}/upload`)} className="btn-primary">
          Upload New Game
        </button>
        <button onClick={fetchBriefing} className="btn-secondary">Refresh</button>
      </div>
    </div>
  );
}
