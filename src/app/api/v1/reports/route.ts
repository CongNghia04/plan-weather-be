import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { handle } from '@/lib/http';
import { createReport } from '@/modules/reports/reports.service';

const Body = z.object({
  lat: z.number().min(10.3).max(11.2),
  lng: z.number().min(106.3).max(107.1),
  depthCm: z.number().int().min(0).max(200),
  note: z.string().max(500).optional(),
});

/** POST /api/v1/reports — người dùng báo ngập */
export const POST = handle(async (req: NextRequest) => {
  const body = Body.parse(await req.json());
  return NextResponse.json(await createReport(body), { status: 201 });
});
