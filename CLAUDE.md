# plan-weather-be — API dự đoán ngập TP.HCM theo tên đường

Next.js 15 (App Router, chỉ dùng Route Handlers làm API) + TypeScript + Prisma + PostgreSQL/PostGIS.
FE nằm ở repo riêng `plan-weather-fe` (Vite + React + TS) và gọi BE qua `/api/v1/*`.

## ⚠️ RULE BẮT BUỘC: Code đổi thì luồng logic phải đổi theo

Luồng logic được ghi trong `docs/flows/`. Đây là nguồn sự thật để người và AI hiểu hệ thống.

**Mỗi lần sửa code trong `src/`, `prisma/`, `scripts/`:**

1. Mở `docs/flows/README.md`, tra bảng "File → Luồng" để biết file vừa sửa thuộc luồng nào.
2. Đọc lại luồng đó và **cập nhật cho khớp với code mới**: các bước, thứ tự, file/hàm tham chiếu, input/output, nhánh lỗi, công thức/ngưỡng.
3. Cập nhật dòng `Cập nhật lần cuối:` (ngày + tóm tắt 1 dòng thay đổi) ở đầu file luồng.
4. Nếu thêm file mới → thêm vào bảng "File → Luồng". Nếu thêm luồng mới → tạo `docs/flows/<ten-luong>.md` theo `docs/flows/_TEMPLATE.md` và thêm vào mục lục.
5. Nếu đổi API (route, query, body, response, `src/types/api.ts`) → cập nhật `docs/flows/api-contract.md` **và** báo rằng phải sửa `plan-weather-fe/src/types/api.ts` cho khớp.
6. Trong câu trả lời cuối cùng, ghi rõ: "Luồng đã cập nhật: <danh sách file docs>" — hoặc giải thích vì sao thay đổi không ảnh hưởng luồng (vd: chỉ đổi tên biến, format).

Không được coi task là xong nếu code và `docs/flows/` lệch nhau. Code và docs đi chung một commit.

## Cấu trúc

```
src/
  app/api/v1/        # Route handlers: CHỈ parse input (zod) → gọi service → trả JSON. Không viết logic nghiệp vụ ở đây.
  app/api/cron/      # Endpoint chạy định kỳ (ingest dữ liệu + tính dự đoán), bảo vệ bằng CRON_SECRET
  modules/<domain>/  # Logic nghiệp vụ theo domain: weather, tide, streets, prediction, reports
    *.client.ts      #   gọi API bên ngoài
    *.repository.ts  #   truy cập DB
    *.service.ts     #   điều phối nghiệp vụ
  modules/prediction/risk-model.ts  # Công thức tính nguy cơ — hàm THUẦN, không I/O, phải có unit test
  lib/               # Hạ tầng dùng chung: env, db, errors, http
  types/api.ts       # Hợp đồng API dùng chung với FE
prisma/schema.prisma # Schema DB (cột geometry PostGIS truy vấn qua $queryRaw)
scripts/             # Nhập dữ liệu tĩnh (đường OSM, điểm ngập lịch sử)
docs/                # ARCHITECTURE.md + flows/
tests/unit/
```

## Quy ước

- Route handler luôn bọc bằng `handle()` (`src/lib/http.ts`); lỗi nghiệp vụ ném `AppError`.
- Validate mọi input bằng zod tại route.
- Không import `db` trong route handler — đi qua module.
- Truy vấn không gian (bbox, gần nhất) dùng `$queryRaw` với tham số template, không nối chuỗi SQL.
- Đổi `risk-model.ts` (trọng số/ngưỡng) → tăng `MODEL_VERSION` nếu kết quả thay đổi, cập nhật test.

## Lệnh

```
cp .env.example .env    # lần đầu — Prisma chỉ đọc .env
docker compose up -d     # PostGIS
npm run db:migrate
npm run dev              # http://localhost:4000
npm test
npm run typecheck
```
