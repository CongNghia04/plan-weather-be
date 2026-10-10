# Luồng: API đọc (bản đồ, tìm đường, chi tiết đường)

> Cập nhật lần cuối: 2026-10-09 — khởi tạo khung

## 1. Bản đồ dự đoán — `GET /api/v1/predictions?bbox=minLng,minLat,maxLng,maxLat&at=ISO`
1. `app/api/v1/predictions/route.ts`: zod parse `bbox` (4 số), `at` (mặc định = bây giờ). Sai → 422.
2. `prediction.service.ts` → `getPredictionMap(bbox, at)`: chọn `FloodPrediction` có `validAt` = giờ làm tròn của `at`, segment giao bbox (`ST_Intersects`), `riskLevel != NONE`, kèm `ST_AsGeoJSON(geom)`. *(TODO — đang trả rỗng)*
3. Trả `PredictionMapResponse`.

## 2. Tìm đường — `GET /api/v1/streets?q=...`
1. `app/api/v1/streets/route.ts`: `q` tối thiểu 2 ký tự, sai → 422.
2. `streets.repository.ts` → `searchStreets(q)`: `name ILIKE %q%`, distinct theo (name, district), tối đa 20.
3. Trả `{ items: StreetSummary[] }`.

TODO: tìm không dấu (unaccent) — "nguyen huu canh" phải ra "Nguyễn Hữu Cảnh".

## 3. Chi tiết đường — `GET /api/v1/streets/:id`
1. `app/api/v1/streets/[id]/route.ts` → `findStreetById(id)`; không có → 404 `NOT_FOUND`.
2. Trả `StreetDetailResponse`: thông tin đường, `historicalFloodPoints`, `timeline` 24h *(TODO — đang rỗng)*.

## 4. Timeline dự đoán — `GET /api/v1/predictions/streets/:id` *(TODO)*
