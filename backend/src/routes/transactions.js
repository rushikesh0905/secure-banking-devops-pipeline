import { Router } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import { authenticate } from '../middleware/auth.js';
import { transferRequests } from '../utils/metrics.js';

const router = Router();
const transferSchema = Joi.object({
  recipientEmail: Joi.string().email({ tlds: { allow: false } }).required(),
  amount: Joi.number().greater(0).precision(2).required(),
  description: Joi.string().max(160).allow('').default('')
});

router.use(authenticate);
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const account = await Account.findOne({ user: req.user._id });
    if (!account) return res.status(404).json({ error: { code: 'ACCOUNT_NOT_FOUND', message: 'Account not found' } });
    const filter = { $or: [{ fromAccount: account._id }, { toAccount: account._id }], status: 'completed' };
    const [items, total] = await Promise.all([
      Transaction.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('toAccount fromAccount', 'user'),
      Transaction.countDocuments(filter)
    ]);
    res.json({ data: { items, page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
});

router.post('/transfer', async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const { error, value } = transferSchema.validate(req.body);
    if (error) {
      transferRequests.inc({ outcome: 'validation_failed' });
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.message } });
    }
    const key = req.get('idempotency-key');
    if (!key || key.length > 100) return res.status(400).json({ error: { code: 'IDEMPOTENCY_REQUIRED', message: 'Idempotency-Key header is required' } });
    const source = await Account.findOne({ user: req.user._id });
    const recipientUser = await (await import('../models/User.js')).default.findOne({ email: value.recipientEmail.toLowerCase() });
    const recipient = recipientUser && await Account.findOne({ user: recipientUser._id });
    if (!source || !recipient || source._id.equals(recipient._id)) {
      transferRequests.inc({ outcome: 'invalid_recipient' });
      return res.status(400).json({ error: { code: 'INVALID_RECIPIENT', message: 'Recipient account is invalid' } });
    }
    const existing = await Transaction.findOne({ fromAccount: source._id, idempotencyKey: key, type: 'transfer-out' });
    if (existing) return res.status(200).json({ data: { transaction: existing, idempotent: true } });
    if (source.balance < value.amount) {
      transferRequests.inc({ outcome: 'insufficient_funds' });
      return res.status(422).json({ error: { code: 'INSUFFICIENT_FUNDS', message: 'Insufficient available balance' } });
    }
    session.startTransaction();
    const [updatedSource, updatedRecipient] = await Promise.all([
      Account.findOneAndUpdate({ _id: source._id, balance: { $gte: value.amount } }, { $inc: { balance: -value.amount } }, { new: true, session }),
      Account.findOneAndUpdate({ _id: recipient._id }, { $inc: { balance: value.amount } }, { new: true, session })
    ]);
    if (!updatedSource || !updatedRecipient) throw Object.assign(new Error('Transfer could not be completed'), { statusCode: 409, code: 'TRANSFER_CONFLICT' });
    const [outgoing] = await Transaction.create([{ fromAccount: source._id, toAccount: recipient._id, type: 'transfer-out', amount: value.amount, status: 'completed', description: value.description, idempotencyKey: key }], { session });
    await Transaction.create([{ fromAccount: source._id, toAccount: recipient._id, type: 'transfer-in', amount: value.amount, status: 'completed', description: value.description, idempotencyKey: `${key}:in` }], { session });
    await session.commitTransaction();
    transferRequests.inc({ outcome: 'success' });
    res.status(201).json({ data: { transaction: outgoing, balance: updatedSource.balance } });
  } catch (err) {
    await session.abortTransaction().catch(() => {});
    transferRequests.inc({ outcome: 'error' });
    next(err);
  } finally { await session.endSession(); }
});
export default router;
