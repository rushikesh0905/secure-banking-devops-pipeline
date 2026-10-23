import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import User from '../models/User.js';
import Account from '../models/Account.js';
import { env } from '../config/env.js';
import { authenticate } from '../middleware/auth.js';
import { failedLogins } from '../utils/metrics.js';

const router = Router();
const credentials = Joi.object({ email: Joi.string().email({ tlds: { allow: false } }).required(), password: Joi.string().min(8).max(128).required() });
const tokenFor = (user) => jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role });

router.post('/register', async (req, res, next) => {
  try {
    const { error, value } = credentials.keys({ name: Joi.string().trim().min(2).max(80).required() }).validate(req.body);
    if (error) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.message } });
    const exists = await User.exists({ email: value.email.toLowerCase() });
    if (exists) return res.status(409).json({ error: { code: 'EMAIL_EXISTS', message: 'Email is already registered' } });
    const user = await User.create({ name: value.name, email: value.email, passwordHash: await bcrypt.hash(value.password, 12) });
    await Account.create({ user: user._id, accountNumber: `DEMO${Date.now().toString().slice(-8)}`, balance: 1000 });
    res.status(201).json({ data: { token: tokenFor(user), user: publicUser(user) } });
  } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = credentials.validate(req.body);
    if (error) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.message } });
    const user = await User.findOne({ email: value.email.toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(value.password, user.passwordHash))) {
      failedLogins.inc();
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    }
    res.json({ data: { token: tokenFor(user), user: publicUser(user) } });
  } catch (err) { next(err); }
});

router.get('/me', authenticate, (req, res) => res.json({ data: { user: publicUser(req.user) } }));
export default router;
