import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { handle } from '@/lib/http';
import { searchStreets } from '@/modules/streets/streets.repository';

const Query = z.object({ q: z.string().trim().min(2) });

/** GET /api/v1/streets?q=nguyen huu canh */
export const GET = handle(async (req: NextRequest) => {
  const { q } = Query.parse(Object.fromEntries(req.nextUrl.searchParams));
  return NextResponse.json({ items: await searchStreets(q) });
});
