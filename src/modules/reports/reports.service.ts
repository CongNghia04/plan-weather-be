import { db } from '@/lib/db';
import type { CreateReportRequest } from '@/types/api';

/**
 * Lưu báo cáo ngập từ người dùng.
 * TODO: gắn segmentId = đoạn đường gần nhất (ST_DWithin 30m) + rate limit theo IP.
 */
export async function createReport(input: CreateReportRequest) {
  const rows = await db.$queryRaw<{ id: string }[]>`
    INSERT INTO "FloodReport" (id, "depthCm", note, geom, "reportedAt")
    VALUES (gen_random_uuid()::text, ${input.depthCm}, ${input.note ?? null},
            ST_SetSRID(ST_MakePoint(${input.lng}, ${input.lat}), 4326), now())
    RETURNING id`;
  return rows[0];
}
