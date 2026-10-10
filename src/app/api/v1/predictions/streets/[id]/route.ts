import { NextResponse, type NextRequest } from 'next/server';
import { handle } from '@/lib/http';

/** GET /api/v1/predictions/streets/:id — timeline dự đoán 24h của một đường. TODO */
export const GET = handle(async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const { id } = await ctx.params;
  return NextResponse.json({ segmentId: id, timeline: [] });
});
