# Troubleshooting

- **Mongo connection refused:** start MongoDB or use `docker compose up mongo`; confirm `MONGO_URI`.
- **JWT secret error:** copy `.env.example` to `.env` and set a non-placeholder secret.
- **CORS error:** set `CLIENT_ORIGIN` to the exact frontend origin.
- **Transfer transaction error:** standalone MongoDB does not support transactions; use a replica set for transfer testing.
- **Selenium cannot start:** install Chrome and a compatible driver, start the frontend/API, seed the database, then run from `selenium`.
- **Minikube image pull error:** run `minikube image load` and confirm `imagePullPolicy: IfNotPresent`.
- **Prometheus target down:** ensure Prometheus and backend share a network and that `/metrics` is reachable from Prometheus.
