import { useEffect, useState } from 'react';
import api from '../services/api';
import { TransactionList } from './Dashboard';
export default function Transactions() { const [items, setItems] = useState([]); useEffect(() => { api.get('/transactions?limit=50').then(({ data }) => setItems(data.data.items)); }, []); return <><div className="page-heading"><div><p className="eyebrow">Account activity</p><h1>Transactions</h1></div></div><section className="panel"><TransactionList items={items} /></section></>; }

