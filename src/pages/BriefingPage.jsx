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

  if (loading) return <div className="briefing"><p>Loading...</p></div>;
  if (error) return <div className="briefing error-message">{error}</div>;
  if (!briefing || briefing.games_count === 0) {
    return (
      <div className="briefing">
        <div className="empty-state">
          <p>No games uploaded yet.</p>
          <button onClick={() => navigate(`/opponents/${opponentId}/upload`)} className="btn-primary">Upload First Game</button>
        </div>
      </div>
    );
  }

  return (
    <div className="briefing">
      <button onClick={() => navigate('/')} className="back-btn">← Back</button>
      <h1>Pre-Game Brief</h1>
      <p>{briefing.games_count} games • {new Date(briefing.last_updated).toLocaleDateString()}</p>

      <div className="view-toggle">
        <button className={view === 'batting' ? 'active' : ''} onClick={() => setView('batting')}>
       🧢 BATTING
        </button>
        <button className={view === 'pitching' ? 'active' : ''} onClick={() => setView('pitching')}>
          ⚾ PITCHING
        </button>
      </div>

      {view === 'batting' && briefing.batting.length > 0 && (
        <div className="stats-section">
          <h2>Offensive Threats</h2>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>AVG</th>
                <th>OBP</th>
                <th>K%</th>
              </tr>
            </thead>
            <tbody>
              {briefing.batting.map((p, i) => (
                <tr key={i} className={p.threat ? 'threat' : ''}>
                  <td>{p.threat && '⚠️'} {p.name}</td>
                  <td>{p.avg}</td>
                  <td>{p.obp}</td>
                  <td>{p.k_pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'pitching' && briefing.pitching.length > 0 && (
        <div className="stats-section">
          <h2>Pitching Staff</h2>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Pitcher</th>
                <th>ERA</th>
                <th>WHIP</th>
                <th>K%</th>
              </tr>
            </thead>
            <tbody>
              {briefing.pitching.map((p, i) => (
                <tr key={i}>
                  <td>{p.name}</td>
                  <td>{p.era}</td>
                  <td>{p.whip}</td>
                  <td>{p.k_pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button onClick={() => navigate(`/opponents/${opponentId}/upload`)} className="btn-primary">Upload New Game</button>
    </div>
  );
}
