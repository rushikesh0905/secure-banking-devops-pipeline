import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';

export const authenticate = async (req, res, next) => {
  try {
    const header = req.get('authorization');
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
    const payload = jwt.verify(header.slice(7), env.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } });
  }
};

