# API reference

All protected endpoints require `Authorization: Bearer <JWT>`. Errors use `{ "error": { "code": "...", "message": "..." } }`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create a demo user and $1,000 account |
| POST | `/api/auth/login` | Authenticate and return a short-lived JWT |
| GET | `/api/auth/me` | Return the authenticated public user |
| GET | `/api/accounts/me` | Return the user's account summary |
| GET | `/api/accounts/me/balance` | Return current server-side balance |
| GET | `/api/transactions?page=1&limit=10` | Paginated completed transactions |
| POST | `/api/transactions/transfer` | Transfer with `Idempotency-Key` header |
| GET | `/health` | Liveness endpoint |
| GET | `/ready` | Readiness endpoint |
| GET | `/metrics` | Prometheus exposition format |

