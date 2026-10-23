import { Router } from 'express';
import Account from '../models/Account.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);
router.get('/me', async (req, res, next) => {
  try {
    const account = await Account.findOne({ user: req.user._id }).select('+accountNumber');
    if (!account) return res.status(404).json({ error: { code: 'ACCOUNT_NOT_FOUND', message: 'Account not found' } });
    res.json({ data: { id: account._id, accountNumber: account.accountNumber, balance: account.balance, currency: account.currency } });
  } catch (err) { next(err); }
});
router.get('/me/balance', async (req, res, next) => {
  try {
    const account = await Account.findOne({ user: req.user._id });
    if (!account) return res.status(404).json({ error: { code: 'ACCOUNT_NOT_FOUND', message: 'Account not found' } });
    res.json({ data: { balance: account.balance, currency: account.currency } });
  } catch (err) { next(err); }
});
export default router;

