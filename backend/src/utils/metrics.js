import client from 'prom-client';

client.collectDefaultMetrics();
export const httpRequests = new client.Counter({
  name: 'banking_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status']
});
export const httpDuration = new client.Histogram({
  name: 'banking_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2]
});
export const transferRequests = new client.Counter({
  name: 'banking_transfer_requests_total',
  help: 'Transfer outcomes',
  labelNames: ['outcome']
});
export const failedLogins = new client.Counter({
  name: 'banking_failed_logins_total',
  help: 'Failed login attempts'
});
export const metricsRegistry = client.register;

