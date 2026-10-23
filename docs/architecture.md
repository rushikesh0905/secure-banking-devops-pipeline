# Architecture and data flow

React calls the Express API through Axios. JWTs are held in `sessionStorage` for this educational client, so they are removed when the browser session ends; a production system should prefer an HttpOnly, Secure, SameSite cookie with CSRF protection. Express validates input, authenticates the user, loads the account by the authenticated user ID, and performs balance updates in a MongoDB session transaction. Mongoose models enforce database-level shape and indexes.

The frontend image is built as static assets and served by Nginx. The API image runs as the non-root `node` user. Kubernetes probes call `/health` and `/ready`; Prometheus scrapes `/metrics`.

