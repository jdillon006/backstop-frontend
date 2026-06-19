import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://backstop-api.vercel.app';

export default function UploadPage({ token }) {
  const { opponentId } = useParams();
  const navigate = useNavigate();
  const [gameDate, setGameDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Phase 2: Vision extraction would happen here
      // For now, placeholder with manual entry
      
      const res = await fetch(`${API_URL}/api/opponents/${opponentId}/games`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gameDate,
          notes,
          batting: [],
          pitching: []
        })
      });

      if (!res.ok) throw new Error('Failed to save game');
      
      navigate(`/opponents/${opponentId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <button onClick={() => navigate(`/opponents/${opponentId}`)} className="back-btn">← Back</button>
      
      <div className="upload-content">
        <h2>Upload Game</h2>
        <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
          Phase 2: GameChanger screenshot upload with vision extraction coming soon.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Game Date</label>
            <input
              type="date"
              value={gameDate}
              onChange={(e) => setGameDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this game..."
              rows="4"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Save Game'}
          </button>
        </form>

        <div className="phase2-info">
          <p><strong>Coming Soon:</strong> Upload GameChanger box score screenshots for automatic stat extraction.</p>
        </div>
      </div>
    </div>
  );
}
