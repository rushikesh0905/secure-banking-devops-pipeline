# Beginner-friendly viva guide

## Two-minute explanation

“This is a fictional banking transaction demo. React provides the responsive UI, and Axios sends REST requests to an Express API. The API authenticates users with bcrypt and short-lived JWTs, validates every request, and reads balances from MongoDB. A transfer is authorized using the logged-in user's account, checked for amount and available funds, and recorded with an idempotency key so a retry does not duplicate it. Docker packages the services, Jenkins gates delivery with tests and audits, Kubernetes supplies probes and resource limits, and Prometheus/Grafana expose operational metrics. It is intentionally not a real banking system.”

## Technology questions

- **Why React/Vite?** React provides reusable UI components; Vite makes local development and production builds fast. Files: `frontend/src` and `frontend/vite.config.js`.
- **Why Express?** It is a small Node.js HTTP framework suited to middleware and REST routes. Files: `backend/src/app.js` and `backend/src/routes`.
- **How does auth work?** bcrypt stores only a password hash; login returns a signed, expiring JWT; middleware verifies it and loads the user.
- **How is transfer authorization enforced?** The server ignores a client-supplied source account and finds the account belonging to `req.user`.
- **Why idempotency?** A client retry with the same key returns the existing outgoing transaction instead of creating another one.
- **What does CI mean?** Jenkins automatically checks code quality, tests, audits, and builds artifacts. CD is the gated delivery/deployment part.
- **Why Docker?** It provides repeatable process and dependency packaging. Multi-stage frontend builds keep runtime images smaller.
- **Why Kubernetes?** It declares desired workloads, health probes, resources, and service discovery.
- **Why Prometheus/Grafana?** Prometheus stores time-series metrics; Grafana visualizes them and supports alerts.
- **What happens on failure?** Jenkins stops at the failed required stage; deployment is not reached.

## Additional likely viva questions

1. **What is REST?** A resource-oriented HTTP style using methods such as GET and POST.
2. **Why is validation on the backend?** Browser validation can be bypassed, so the trusted boundary must validate again.
3. **Why is the password never returned?** Password hashes and credentials are sensitive and are excluded from responses.
4. **What is a middleware?** A function that can inspect or change a request before the route handler runs.
5. **What does `401` mean?** The request is unauthenticated or its credentials are invalid.
6. **What does `422` mean here?** The request shape is valid, but the transfer cannot satisfy a business rule such as available funds.
7. **What is an index?** A database structure that makes common lookups faster.
8. **Why paginate transactions?** To avoid loading an unbounded history into one response.
9. **What is CORS?** A browser policy controlling which origins may call the API.
10. **What does Helmet do?** It sets defensive HTTP security headers.
11. **Why rate-limit requests?** To reduce brute-force and accidental abuse.
12. **Why use environment variables?** Configuration and secrets can vary without placing them in source control.
13. **What is a Docker image?** An immutable package containing an application and its runtime dependencies.
14. **What is a container?** A running isolated process created from an image.
15. **What is a multi-stage build?** Separate build and runtime stages to avoid shipping development tools.
16. **What is a Kubernetes Service?** A stable network address for a changing set of pods.
17. **What is a readiness probe?** A signal that a pod can receive traffic.
18. **What is a liveness probe?** A signal that a stuck container should be restarted.
19. **What is Prometheus scraping?** Prometheus periodically fetches metrics from an HTTP endpoint.
20. **Why avoid IDs in metric labels?** High-cardinality labels increase storage cost and can leak sensitive data.
21. **What is `npm audit`?** A check for known vulnerabilities in dependency trees.
22. **Why use immutable image tags?** A commit SHA identifies exactly which source produced an image.
23. **What is a smoke test?** A small, fast check that the deployed system is reachable and basically functional.
24. **Why is this not production banking software?** It lacks regulated controls, MFA, key custody, fraud systems, resilience, and independent security assessment.
25. **How would you improve it?** Add managed replica-set storage, HttpOnly cookies, MFA, secret management, audit trails, threat modeling, and disaster recovery.

## Five-minute demo

Start the app, sign in with the seeded Alex account, explain the dashboard, open transactions, transfer `$10` to Sam, and show the new balance. Try `0`, a large amount, and an unknown recipient. Then show `/health`, `/metrics`, the test script, Jenkins stages, Docker non-root user, Kubernetes probes, and monitoring alert rules.

## Commands to remember

`npm run dev` starts both apps; `npm test` runs API tests; `npm run seed --prefix backend` resets demo data; `docker compose up --build` builds and runs containers; `kubectl apply -f k8s/app.yaml` creates the local cluster resources; `kubectl rollout status` waits for a deployment; `docker compose logs -f backend` follows API logs.
