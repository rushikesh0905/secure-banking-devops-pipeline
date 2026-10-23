import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  fromAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  toAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  type: { type: String, enum: ['transfer-in', 'transfer-out'], required: true },
  amount: { type: Number, required: true, min: 0.01 },
  status: { type: String, enum: ['completed', 'failed'], required: true },
  description: { type: String, trim: true, maxlength: 160 },
  idempotencyKey: { type: String, index: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

transactionSchema.index({ fromAccount: 1, createdAt: -1 });
transactionSchema.index({ toAccount: 1, createdAt: -1 });
export default mongoose.model('Transaction', transactionSchema);

