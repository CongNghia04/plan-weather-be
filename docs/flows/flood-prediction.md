# Luồng: Dự đoán ngập theo đoạn đường

> Cập nhật lần cuối: 2026-10-09 — khởi tạo mô hình rule-v1

## Mục đích
Với mỗi `StreetSegment` và mỗi giờ trong 24h tới, tính `riskScore` (0..1), `riskLevel`, độ sâu ước tính và lý do (`factors`).

## Kích hoạt
Bước 3 của cron ingest (`runPredictions()`).

## Các bước
1. `prediction.service.ts` → `runPredictions(24)`: lấy toàn bộ segment kèm `elevationM` và số `floodPoints`.
2. Với mỗi giờ `validAt` (làm tròn giờ hiện tại + h):
   1. `tide.service.ts` → `getTideLevel(validAt)`: mực triều gần nhất ≤ validAt (null nếu chưa có).
   2. Với mỗi segment: lấy `rain3hMm` = tổng mưa 3 giờ [validAt, validAt+3h) tại ô lưới chứa trọng tâm đoạn đường. *(TODO — đang = 0)*
   3. `risk-model.ts` → `computeFactors()` → `scoreOf()` → `levelOf()` → `estimateDepthCm()`.
   4. Upsert `FloodPrediction` theo `(segmentId, validAt, modelVer)`.

## Công thức (`risk-model.ts`, MODEL_VERSION = `rule-v1`)
| Yếu tố | Chuẩn hoá về 0..1 | Trọng số |
|---|---|---|
| rain | `rain3hMm / 80` | 0.40 |
| tide | `(tideCm - 130) / 40`, null → 0 | 0.25 |
| history | `số điểm ngập / 3` | 0.25 |
| elevation | `(2 - elevationM) / 2`, null → 0.5 | 0.10 |

`riskScore = Σ factor × weight` (kẹp 0..1)

| riskLevel | Ngưỡng |
|---|---|
| HIGH | ≥ 0.70 |
| MEDIUM | ≥ 0.45 |
| LOW | ≥ 0.20 |
| NONE | < 0.20 |

`depthCmEst = round(score × 50)` nếu score ≥ 0.2, ngược lại null.

## Nhánh lỗi / biên
- Chưa có dữ liệu triều → tide = 0 (không cộng nguy cơ triều).
- Chưa có cao độ → elevation = 0.5 (trung tính).

## Dữ liệu đọc / ghi
- Đọc: `StreetSegment`, `FloodPoint`, `WeatherForecast`, `TideForecast`
- Ghi: `FloodPrediction`

## TODO
- Truy vấn rain3hMm theo gridKey.
- Hiệu chỉnh trọng số bằng `FloodReport` (v2).
