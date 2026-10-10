# Luồng: Nhập dữ liệu

> Cập nhật lần cuối: 2026-10-09 — khởi tạo khung

## Mục đích
Đưa dữ liệu đầu vào (mưa, triều, đường, điểm ngập) vào DB để luồng dự đoán sử dụng.

## A. Dữ liệu tĩnh (chạy tay)
1. `scripts/import-osm-streets.ts`: Overpass → các way có `highway` + `name` trong TP.HCM → chia thành `StreetSegment` (name, district, ward, geom). *(TODO)*
2. `scripts/import-flood-points.ts`: CSV điểm ngập → `FloodPoint`, gắn `segmentId` = đoạn đường gần nhất. *(TODO)*
3. Cao độ `elevationM`: lấy từ DEM theo trọng tâm đoạn đường. *(TODO)*

## B. Dữ liệu động (cron mỗi giờ)
Kích hoạt: `POST /api/cron/ingest` với header `Authorization: Bearer <CRON_SECRET>`.

1. `src/app/api/cron/ingest/route.ts`: kiểm tra secret, sai → 401 `UNAUTHORIZED`.
2. `weather.service.ts` → `ingestWeather()`: lặp qua `HCM_GRID` (lưới 0.05°), gọi `weather.client.ts` → `fetchHourlyRain()` (Open-Meteo, 48h, giờ VN), upsert `WeatherForecast` theo `(gridKey, forecastAt)`.
3. `prediction.service.ts` → `runPredictions()` — xem [flood-prediction.md](flood-prediction.md).
4. Trả `{ weatherRows, predictionRows }`.

Triều: `tide.service.ts` → `ingestTide(rows)` upsert `TideForecast` trạm `PHU_AN`. Hiện chưa có nguồn tự động — nhập tay. *(TODO)*

## Nhánh lỗi
- Open-Meteo trả non-2xx → ném Error → `handle()` trả 500, cron lần sau thử lại. Dữ liệu cũ vẫn giữ.

## Dữ liệu đọc / ghi
- Đọc: Open-Meteo, Overpass, CSV
- Ghi: `WeatherForecast`, `TideForecast`, `StreetSegment`, `FloodPoint`

## TODO / giới hạn
- Gọi Open-Meteo tuần tự từng điểm lưới → nên gộp nhiều toạ độ/1 request.
- Upsert từng dòng → nên dùng `createMany` / `INSERT ... ON CONFLICT` theo lô.
