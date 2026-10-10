# Kiến trúc tổng thể

```
                ┌──────────────── plan-weather-fe (Vite + React) ────────────────┐
                │  Bản đồ ngập (MapLibre)  •  Tìm đường  •  Chi tiết đường  •  Báo ngập │
                └───────────────────────────────┬────────────────────────────────┘
                                                │ HTTPS JSON /api/v1/*
┌───────────────────────────── plan-weather-be (Next.js) ─────────────────────────────┐
│ Route handlers ──► modules (streets, prediction, reports) ──► Prisma ──► PostGIS    │
│                                                                                     │
│ Cron mỗi giờ: /api/cron/ingest                                                      │
│   weather (Open-Meteo) ─┐                                                           │
│   tide (Phú An)        ─┼─► prediction/risk-model ─► FloodPrediction                │
│   streets + FloodPoint ─┘                                                           │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## Nguồn dữ liệu

| Dữ liệu | Nguồn | Tần suất |
|---|---|---|
| Đường phố (tên, hình học) | OpenStreetMap / Overpass | Nhập 1 lần, cập nhật tay |
| Điểm ngập lịch sử | Danh sách điểm ngập TP.HCM (CSV) | Nhập tay |
| Cao độ | DEM (SRTM/Copernicus) | Nhập 1 lần |
| Dự báo mưa theo giờ | Open-Meteo | Mỗi giờ |
| Dự báo triều | Đài KTTV Nam Bộ (trạm Phú An) | Hằng ngày (tạm nhập tay) |
| Báo ngập thực tế | Người dùng | Realtime |

## Lộ trình mô hình

- **v1 (`rule-v1`)**: công thức trọng số (mưa, triều, lịch sử, cao độ) — xem `flows/flood-prediction.md`.
- **v2**: dùng `FloodReport` làm nhãn để hiệu chỉnh trọng số / huấn luyện mô hình (logistic regression / GBM).
