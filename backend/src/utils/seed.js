import bcrypt from 'bcrypt';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import User from '../models/User.js';
import Account from '../models/Account.js';

await connectDatabase();
await User.deleteMany({});
await Account.deleteMany({});
const passwordHash = await bcrypt.hash('DemoPass123!', 12);
const users = await User.create([
  { name: 'Alex Morgan', email: 'alex@example.test', passwordHash },
  { name: 'Sam Rivera', email: 'sam@example.test', passwordHash }
]);
await Account.create([
  { user: users[0]._id, accountNumber: 'DEMO00000001', balance: 2500 },
  { user: users[1]._id, accountNumber: 'DEMO00000002', balance: 1200 }
]);
console.log('Seeded Alex and Sam demo accounts. Password: DemoPass123!');
await disconnectDatabase();

