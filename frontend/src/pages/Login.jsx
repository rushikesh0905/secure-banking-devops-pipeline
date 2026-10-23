import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
export default function Login() {
  const [form, setForm] = useState({ email: 'alex@example.test', password: 'DemoPass123!' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const submit = async (event) => {
    event.preventDefault(); setError('');
    try { const { data } = await api.post('/auth/login', form); sessionStorage.setItem('banking_token', data.data.token); navigate('/'); }
    catch (err) { setError(err.response?.data?.error?.message || 'Unable to sign in'); }
  };
  return <AuthCard title="Welcome back" subtitle="Sign in to your demo account"><form onSubmit={submit}><label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label><label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>{error && <p className="error">{error}</p>}<button className="primary" type="submit">Sign in</button></form><p>New to VaultDemo? <Link to="/register">Create an account</Link></p></AuthCard>;
}
export function AuthCard({ title, subtitle, children }) { return <div className="auth-page"><section className="auth-card"><div className="brand">Vault<span>Demo</span></div><h1>{title}</h1><p>{subtitle}</p>{children}</section></div>; }

