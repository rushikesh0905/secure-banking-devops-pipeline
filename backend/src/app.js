import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import authRoutes from './routes/auth.js';
import accountRoutes from './routes/accounts.js';
import transactionRoutes from './routes/transactions.js';
import { httpRequests, httpDuration, metricsRegistry } from './utils/metrics.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json({ limit: '20kb' }));
app.use(pinoHttp({ redact: ['req.headers.authorization', 'req.body.password'] }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true }));
app.use((req, res, next) => {
  const started = process.hrtime.bigint();
  res.on('finish', () => {
    const route = req.route?.path || req.path;
    httpRequests.inc({ method: req.method, route, status: res.statusCode });
    httpDuration.observe({ method: req.method, route }, Number(process.hrtime.bigint() - started) / 1e9);
  });
  next();
});
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'secure-banking-api' }));
app.get('/ready', (_req, res) => res.json({ status: 'ready' }));
app.get('/metrics', async (_req, res) => { res.set('Content-Type', metricsRegistry.contentType); res.end(await metricsRegistry.metrics()); });
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;

