import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import Home from './pages/Home';
import { useAuthStore } from './store/authStore';

function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route
          path="/chat"
          element={user ? <Chat /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/chat" replace /> : <Auth />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/chat" replace /> : <Auth />}
        />
        <Route
          path="/"
          element={<Navigate to="/home" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;