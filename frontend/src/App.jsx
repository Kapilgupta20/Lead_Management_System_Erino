import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dash" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
