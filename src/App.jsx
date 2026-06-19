import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import BriefingPage from './pages/BriefingPage';
import UploadPage from './pages/UploadPage';
import WorkspaceSettingsPage from './pages/WorkspaceSettingsPage';
import './App.css';

function App() {
  // Hardcoded for MVP - skip auth
  const token = 'test-token';
  const workspaceId = 'test-workspace-id';
  const userId = 'test-user-id';

  const handleLogout = () => {
    window.location.reload();
  };

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-brand">
            <img src="/bc-express-logo.png" alt="BC Express" style={{ height: '50px', width: 'auto' }} />
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
