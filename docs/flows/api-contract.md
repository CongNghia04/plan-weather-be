# Hợp đồng API (BE ⇄ FE)

> Cập nhật lần cuối: 2026-10-09 — khởi tạo
>
> Nguồn: `src/types/api.ts`. Bản sao FE: `plan-weather-fe/src/types/api.ts`. **Hai file phải giống hệt nhau.**

Base URL: `http://localhost:4000/api/v1`. Lỗi luôn có dạng `{ "error": { "code", "message" } }`.

| Method | Path | Query/Body | Response | Lỗi |
|---|---|---|---|---|
| GET | `/health` | — | `{ status: 'ok' }` | — |
| GET | `/streets` | `q` (≥2 ký tự) | `{ items: StreetSummary[] }` | 422 |
| GET | `/streets/:id` | — | `StreetDetailResponse` | 404 |
| GET | `/predictions` | `bbox`, `at?` | `PredictionMapResponse` | 422 |
| GET | `/predictions/streets/:id` | — | `{ segmentId, timeline }` | 404 |
| POST | `/reports` | `CreateReportRequest` | `{ id }` (201) | 422 |

`riskLevel`: `NONE | LOW | MEDIUM | HIGH`. Thời gian: chuỗi ISO 8601.
