import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthCard } from './Login';
export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' }); const [error, setError] = useState(''); const navigate = useNavigate();
  const submit = async (event) => { event.preventDefault(); try { const { data } = await api.post('/auth/register', form); sessionStorage.setItem('banking_token', data.data.token); navigate('/'); } catch (err) { setError(err.response?.data?.error?.message || 'Unable to register'); } };
  return <AuthCard title="Open a demo account" subtitle="Use synthetic data only"><form onSubmit={submit}>{['name', 'email', 'password'].map((key) => <label key={key}>{key[0].toUpperCase() + key.slice(1)}<input type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required /></label>)}{error && <p className="error">{error}</p>}<button className="primary">Create account</button></form><p>Already registered? <Link to="/login">Sign in</Link></p></AuthCard>;
}

