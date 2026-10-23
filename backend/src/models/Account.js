import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  accountNumber: { type: String, required: true, unique: true, select: false },
  balance: { type: Number, required: true, min: 0, default: 0 },
  currency: { type: String, default: 'USD', enum: ['USD'] }
}, { timestamps: true });

export default mongoose.model('Account', accountSchema);

