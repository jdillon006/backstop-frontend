import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://backstop-api.vercel.app';

export default function DashboardPage({ token, workspaceId }) {
  const [opponents, setOpponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newOpponentName, setNewOpponentName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
  fetchOpponents();
}, [workspaceId, token, fetchOpponents]);

  const fetchOpponents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/workspaces/${workspaceId}/opponents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setOpponents(data || []);
    } catch (err) {
      setError('Failed to load opponents');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOpponent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/workspaces/${workspaceId}/opponents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newOpponentName })
      });
      const data = await res.json();
      setOpponents([...opponents, data]);
      setNewOpponentName('');
      setShowModal(false);
    } catch (err) {
      setError('Failed to add opponent');
    }
  };

  if (loading) {
    return <div className="dashboard"><p>Loading...</p></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Opponents</h2>
        <button onClick={() => setShowModal(true)} className="add-btn">+ Add Opponent</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="opponents-grid">
        {opponents.length === 0 ? (
          <div className="empty-state">
            <p>No opponents yet. Add one to get started.</p>
          </div>
        ) : (
          opponents.map(opponent => (
            <div key={opponent.id} className="opponent-card">
              <h3>{opponent.name}</h3>
              <div className="card-actions">
                <Link to={`/opponents/${opponent.id}`} className="btn-primary">View Briefing</Link>
                <Link to={`/opponents/${opponent.id}/upload`} className="btn-secondary">Upload Game</Link>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Opponent</h3>
            <form onSubmit={handleAddOpponent}>
              <input
                type="text"
                placeholder="Team Name (e.g., Hickory Hornets 10U)"
                value={newOpponentName}
                onChange={(e) => setNewOpponentName(e.target.value)}
                required
                autoFocus
              />
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Add</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Link to="/settings" className="settings-link">⚙️ Workspace Settings</Link>
    </div>
  );
}
