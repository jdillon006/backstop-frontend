import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function BriefingPage({ token }) {
  const { opponentId } = useParams();
  const navigate = useNavigate();
  const [view, setView] = useState('batting');

  // Mock briefing data
  const briefing = {
    opponent_id: opponentId,
    games_count: 6,
    last_updated: new Date().toISOString(),
    batting: [
      { name: 'Logan S', avg: '.450', obp: '.520', k_pct: '15', ab: 20, h: 9, doubles: 2, hr: 1, sb: 2, threat: true },
      { name: 'Bennett D', avg: '.380', obp: '.450', k_pct: '20', ab: 21, h: 8, doubles: 1, hr: 0, sb: 1, threat: false },
      { name: 'Nathan W', avg: '.420', obp: '.480', k_pct: '18', ab: 19, h: 8, doubles: 1, hr: 1, sb: 3, threat: true },
      { name: 'Tommy A', avg: '.320', obp: '.380', k_pct: '25', ab: 22, h: 7, doubles: 1, hr: 0, sb: 0, threat: false },
      { name: 'Nico C', avg: '.290', obp: '.340', k_pct: '35', ab: 21, h: 6, doubles: 0, hr: 0, sb: 1, threat: false },
    ],
    pitching: [
      { name: 'Will S', era: '2.45', whip: '1.12', k_pct: '35', ip: 12, h: 15, er: 4, bb: 3, so: 18 },
      { name: 'Jake M', era: '3.20', whip: '1.35', k_pct: '28', ip: 10, h: 14, er: 4, bb: 4, so: 12 },
      { name: 'Tyler P', era: '4.50', whip: '1.55', k_pct: '20', ip: 8, h: 13, er: 4, bb: 3, so: 8 },
    ],
    game_plan: [
      '⚠️ Pitch around: Logan S, Nathan W - both elite contact hitters',
      '🔴 Exploit: Tommy A and Nico C - high strikeout rates (25-35%)',
      '✓ Team contact-oriented (.350+ AVG) — force weak contact',
      '✓ Watch for stolen bases — runners are aggressive',
    ]
  };

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

      <div className="game-plan-section">
        <h2>Game Plan</h2>
        <ul className="game-plan-list">
          {briefing.game_plan.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <button onClick={() => navigate(`/opponents/${opponentId}/upload`)} className="btn-primary">Upload New Game</button>
    </div>
  );
}
