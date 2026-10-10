# Mục lục luồng logic (BE)

> Quy tắc: sửa code → sửa luồng tương ứng (xem CLAUDE.md).

| Luồng | File | Mô tả |
|---|---|---|
| Nhập dữ liệu | [data-ingestion.md](data-ingestion.md) | Cron mỗi giờ kéo mưa, triều; script nhập đường & điểm ngập |
| Dự đoán ngập | [flood-prediction.md](flood-prediction.md) | Tính riskScore cho từng đoạn đường theo giờ |
| API đọc | [read-api.md](read-api.md) | Bản đồ dự đoán, tìm đường, chi tiết đường |
| Báo ngập | [user-report.md](user-report.md) | Người dùng gửi báo cáo ngập |
| Hợp đồng API | [api-contract.md](api-contract.md) | Request/response dùng chung với FE |

## File → Luồng

| File | Luồng |
|---|---|
| `src/app/api/cron/ingest/route.ts` | data-ingestion |
| `src/modules/weather/*` | data-ingestion |
| `src/modules/tide/*` | data-ingestion, flood-prediction |
| `scripts/import-osm-streets.ts`, `scripts/import-flood-points.ts` | data-ingestion |
| `src/modules/prediction/risk-model.ts` | flood-prediction |
| `src/modules/prediction/prediction.service.ts` | flood-prediction, read-api |
| `src/app/api/v1/predictions/**` | read-api, api-contract |
| `src/app/api/v1/streets/**` | read-api, api-contract |
| `src/modules/streets/*` | read-api |
| `src/app/api/v1/reports/route.ts`, `src/modules/reports/*` | user-report, api-contract |
| `src/types/api.ts` | api-contract |
| `src/lib/*`, `src/middleware.ts` | (hạ tầng — cập nhật ARCHITECTURE.md nếu đổi hành vi) |
| `prisma/schema.prisma` | mọi luồng có đọc/ghi bảng bị đổi |
