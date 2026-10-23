import { Link, useNavigate } from 'react-router-dom';
export default function Layout({ user, children }) {
  const navigate = useNavigate();
  const logout = () => { sessionStorage.removeItem('banking_token'); navigate('/login'); };
  return <div className="app-shell"><aside><div className="brand">Vault<span>Demo</span></div><p className="demo-badge">FICTIONAL DATA</p><nav><Link to="/">Overview</Link><Link to="/transactions">Transactions</Link><Link to="/transfer">Transfer funds</Link></nav><button className="logout" onClick={logout}>Sign out</button></aside><main><header><span>Secure banking workspace</span><strong>{user.name}</strong></header>{children}</main></div>;
}

