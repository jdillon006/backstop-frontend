import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BriefingPage from './pages/BriefingPage';
import UploadPage from './pages/UploadPage';
import WorkspaceSettingsPage from './pages/WorkspaceSettingsPage';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [workspaceId, setWorkspaceId] = useState(localStorage.getItem('workspaceId'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const handleLogin = (newToken, newWorkspaceId, newUserId) => {
    setToken(newToken);
    setWorkspaceId(newWorkspaceId);
    setUserId(newUserId);
    localStorage.setItem('token', newToken);
    localStorage.setItem('workspaceId', newWorkspaceId);
    localStorage.setItem('userId', newUserId);
  };

  const handleLogout = () => {
    setToken(null);
    setWorkspaceId(null);
    setUserId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('workspaceId');
    localStorage.removeItem('userId');
  };

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-brand">
<span style={{ fontSize: '32px', fontWeight: 'bold', color: '#c41e3a' }}>BCC Express ⚾</span>
            <h1>Backstop</h1>
          </div>
          <button onClick={handleLogout} className="logout-btn">Sign Out</button>
        </nav>

        <Routes>
          <Route path="/" element={<DashboardPage token={token} workspaceId={workspaceId} />} />
          <Route path="/opponents/:opponentId" element={<BriefingPage token={token} />} />
          <Route path="/opponents/:opponentId/upload" element={<UploadPage token={token} />} />
          <Route path="/settings" element={<WorkspaceSettingsPage token={token} workspaceId={workspaceId} userId={userId} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
