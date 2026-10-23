import React from 'react';
import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import api from './services/api';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Transfer from './pages/Transfer';
import './styles/app.css';

function App() {
  const [user, setUser] = useState({ name: 'Demo user' });
  useEffect(() => { if (sessionStorage.getItem('banking_token')) api.get('/auth/me').then(({ data }) => setUser(data.data.user)).catch(() => {}); }, []);
  return <Routes><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="*" element={<ProtectedRoute><Layout user={user}><Routes><Route path="/" element={<Dashboard user={user} />} /><Route path="/transactions" element={<Transactions />} /><Route path="/transfer" element={<Transfer />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></Layout></ProtectedRoute>} /></Routes>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>);
