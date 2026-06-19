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
      } catch (err) {
        setError('Failed to load coaches');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
    fetchCoaches();
  }, [workspaceId, token]);

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

  if (loading) return <div className="settings"><p>Loading...</p></div>;

  return (
    <div className="settings">
      <button onClick={() => navigate('/')} className="back-btn">← Back</button>
      <h2>Workspace Settings</h2>
      {error && <div className="error-message">{error}</div>}

      <section className="settings-section">
        <h3>Workspace Name</h3>
        <form
