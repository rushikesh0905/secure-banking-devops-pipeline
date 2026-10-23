import request from 'supertest';
import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Account from '../src/models/Account.js';

let mongo;
jest.setTimeout(30000);

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  if (mongo) await mongo.stop();
});
beforeEach(async () => { await User.deleteMany({}); await Account.deleteMany({}); });

test('health endpoint is public', async () => {
  const response = await request(app).get('/health');
  expect(response.status).toBe(200);
  expect(response.body.status).toBe('ok');
});

test('registers and protects account data', async () => {
  const registered = await request(app).post('/api/auth/register').send({ name: 'Test User', email: 'test@example.test', password: 'Password123!' });
  expect(registered.status).toBe(201);
  const account = await request(app).get('/api/accounts/me').set('Authorization', `Bearer ${registered.body.data.token}`);
  expect(account.status).toBe(200);
  expect(account.body.data.balance).toBe(1000);
});
