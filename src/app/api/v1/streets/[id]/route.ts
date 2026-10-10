import { NextResponse, type NextRequest } from 'next/server';
import { handle } from '@/lib/http';
import { NotFoundError } from '@/lib/errors';
import { findStreetById } from '@/modules/streets/streets.repository';
import type { StreetDetailResponse } from '@/types/api';

/** GET /api/v1/streets/:id — thông tin đường + điểm ngập lịch sử + timeline dự đoán */
export const GET = handle(async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;
  const s = await findStreetById(id);
  if (!s) throw new NotFoundError('Street');
  const body: StreetDetailResponse = {
    street: { id: s.id, name: s.name, district: s.district, ward: s.ward },
    timeline: [], // TODO: FloodPrediction 24h tới của segment
    historicalFloodPoints: s.floodPoints.map((p) => ({ description: p.description, cause: p.cause, maxDepthCm: p.maxDepthCm })),
  };
  return NextResponse.json(body);
});
