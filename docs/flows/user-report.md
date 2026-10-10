# Luồng: Người dùng báo ngập

> Cập nhật lần cuối: 2026-10-09 — khởi tạo khung

## Kích hoạt
`POST /api/v1/reports` body `CreateReportRequest`.

## Các bước
1. `app/api/v1/reports/route.ts`: zod validate — lat ∈ [10.3, 11.2], lng ∈ [106.3, 107.1] (phạm vi TP.HCM), depthCm ∈ [0, 200] số nguyên, note ≤ 500 ký tự. Sai → 422.
2. `reports.service.ts` → `createReport()`: INSERT `FloodReport` với `geom = ST_MakePoint(lng, lat)`.
3. Trả 201 `{ id }`.

## TODO
- Gắn `segmentId` = đoạn đường gần nhất trong 30m.
- Rate limit theo IP.
- Dùng báo cáo gần đây để hiển thị "đang ngập thực tế" trên bản đồ và làm nhãn cho mô hình v2.
