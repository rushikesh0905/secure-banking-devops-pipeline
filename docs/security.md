# Security notes

The project demonstrates defense-in-depth appropriate for a classroom portfolio: password hashing with bcrypt, JWT expiry, authorization by `req.user`, Joi validation, Helmet, CORS allow-listing, request limits, rate limiting, redacted logs, non-root containers, Kubernetes probes/resources, audit checks, and no real credentials.

Transfers use an idempotency key and a MongoDB transaction. A standalone MongoDB instance cannot guarantee transaction support; use a replica set/managed MongoDB before relying on atomic multi-document transfers. The demo intentionally does not claim banking-grade security, availability, compliance, fraud monitoring, or key custody.

