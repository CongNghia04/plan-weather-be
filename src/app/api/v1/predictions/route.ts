import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { handle } from '@/lib/http';
import { getPredictionMap } from '@/modules/prediction/prediction.service';

const Query = z.object({
  bbox: z
    .string()
    .transform((s) => s.split(',').map(Number))
    .pipe(z.tuple([z.number(), z.number(), z.number(), z.number()])), // minLng,minLat,maxLng,maxLat
  at: z.coerce.date().optional(),
});

/** GET /api/v1/predictions?bbox=106.6,10.7,106.8,10.85&at=2026-10-09T18:00:00+07:00 */
export const GET = handle(async (req: NextRequest) => {
  const { bbox, at } = Query.parse(Object.fromEntries(req.nextUrl.searchParams));
  return NextResponse.json(await getPredictionMap(bbox, at ?? new Date()));
});
