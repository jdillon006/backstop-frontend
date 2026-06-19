import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://backstop-api.vercel.app';

export default function WorkspaceSettingsPage({ token, workspaceId, userId }) {
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');

  useEffect(() => {
    fetchWorkspace();
    fetchCoaches();
  }, [workspaceId, token]);

  const fetchWorkspace = async () => {
    try {
      const res = await fetch(`${API_URL}/api/workspaces/${workspaceId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setWorkspace(data);
      setWorkspaceName(data.name);
    } catch (err) {
      setError('Failed to load workspace');
    }
  };

  const fetchCoaches = async () => {
    try {
      const res = await fetch(`${API_URL}/api/workspaces/${workspaceId}/coaches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCoaches(data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load coaches');
      setLoading(false);
    }
  };

  const handleUpdateWorkspaceName = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/workspaces/${workspaceId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: workspaceName })
      });
      setWorkspace({ ...workspace, name: workspaceName });
    } catch (err) {
      setError('Failed to update workspace name');
    }
  };

  const handleInviteCoach = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/workspaces/${workspaceId}/coaches/invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: inviteEmail })
      });
      setInviteEmail('');
      alert('Invite sent!');
    } catch (err) {
      setError('Failed to send invite');
    }
  };

  if (loading) {
    return <div className="settings"><p>Loading...</p></div>;
  }

  return (
    <div className="settings">
      <button onClick={() => navigate('/')} className="back-btn">← Back</button>

      <h2>Workspace Settings</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Workspace Name */}
      <section className="settings-section">
        <h3>Workspace Name</h3>
        <form onSubmit={handleUpdateWorkspaceName}>
          <input
            type="text"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
          <button type="submit" className="btn-primary">Update Name</button>
        </form>
      </section>

      {/* Coaches */}
      <section className="settings-section">
        <h3>Team Coaches</h3>
        <ul className="coaches-list">
          {coaches.map(coach => (
            <li key={coach.id}>
              <div>
                <strong>{coach.email}</strong>
                <span className="coach-role">{coach.role}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Invite Coach */}
      <section className="settings-section">
        <h3>Invite Coach</h3>
        <form onSubmit={handleInviteCoach}>
          <input
            type="email"
            placeholder="coach@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">Send Invite</button>
        </form>
      </section>
    </div>
  );
}
