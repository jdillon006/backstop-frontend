import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function DashboardPage({ token, workspaceId }) {
  const [opponents, setOpponents] = useState([
    { id: '1', name: 'Hickory Hornets 10U' },
    { id: '2', name: 'Carroll Manor Cardinals 10U' },
    { id: '3', name: 'Hereford Bulls 10U' },
    { id: '4', name: 'White Marsh Warriors 10U' },
    { id: '5', name: 'SoBo Baseball 10U' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newOpponentName, setNewOpponentName] = useState('');

  const handleAddOpponent = (e) => {
    e.preventDefault();
    if (newOpponentName.trim()) {
      setOpponents([...opponents, { id: Date.now().toString(), name: newOpponentName }]);
      setNewOpponentName('');
      setShowModal(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Opponents</h2>
        <button onClick={() => setShowModal(true)} className="add-btn">+ Add Opponent</button>
      </div>

      <div className="opponents-grid">
        {opponents.map(opponent => (
          <div key={opponent.id} className="opponent-card">
            <h3>{opponent.name}</h3>
            <div className="card-actions">
              <Link to={`/opponents/${opponent.id}`} className="btn-primary">View Briefing</Link>
              <Link to={`/opponents/${opponent.id}/upload`} className="btn-secondary">Upload Game</Link>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Opponent</h3>
            <form onSubmit={handleAddOpponent}>
              <input
                type="text"
                placeholder="Team Name"
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
    </div>
  );
}
