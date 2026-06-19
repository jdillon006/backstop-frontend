import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://backstop-api.vercel.app';

export default function WorkspaceSettingsPage({ token, workspaceId }) {
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resWs = await fetch(`${API_URL}/api/workspaces/${workspaceId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataWs = await resWs.json();
        setWorkspace(dataWs);
        setWorkspaceName(dataWs.name);

        const resCo = await fetch(`${API_URL}/api/workspaces/${workspaceId}/coaches`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataCo = await resCo.json();
        setCoaches(dataCo || []);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [workspaceId, token]);

  const handleUpdateName = async (e) => {
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
      setError('Failed to update');
    }
  };

  const handleInvite = async (e) => {
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

  if (loading) return <div className="settings"><p>Loading...</p></div>;

  return (
    <div className="settings">
      <button onClick={() => navigate('/')} className="back-btn">← Back</button>
      <h2>Workspace Settings</h2>
      {error && <div className="error-message">{error}</div>}

      <section className="settings-section">
        <h3>Workspace Name</h3>
        <form onSubmit={handleUpdateName}>
          <input type="text" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
          <button type="submit" className="btn-primary">Update</button>
        </form>
      </section>

      <section className="settings-section">
        <h3>Team Coaches</h3>
        <ul className="coaches-list">
          {coaches.map(coach => (
            <li key={coach.id}>
              <strong>{coach.email}</strong>
              <span className="coach-role">{coach.role}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="settings-section">
        <h3>Invite Coach</h3>
        <form onSubmit={handleInvite}>
          <input type="email" placeholder="coach@example.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required />
          <button type="submit" className="btn-primary">Send Invite</button>
        </form>
      </section>
    </div>
  );
}
