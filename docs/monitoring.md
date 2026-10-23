# Monitoring runbook

Prometheus scrapes the API's `/metrics` endpoint using `monitoring/prometheus.yml`. Grafana can import the Prometheus datasource in `monitoring/grafana/datasource.yml`. Build panels from `banking_http_requests_total` and `banking_http_request_duration_seconds`; filter by method, route, and status only. `monitoring/alerts.yml` includes target-down and high-5xx-rate alerts.

Never add email, account, transaction, or user identifiers as metric labels: those create high-cardinality and privacy risks.

