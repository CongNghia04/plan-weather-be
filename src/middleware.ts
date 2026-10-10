import { NextResponse, type NextRequest } from 'next/server';

/** CORS cho FE (Vite) gọi sang BE */
export function middleware(req: NextRequest) {
  const origin = process.env.FE_ORIGIN ?? '';
  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (req.method === 'OPTIONS') return new NextResponse(null, { status: 204, headers });
  const res = NextResponse.next();
  Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export const config = { matcher: '/api/v1/:path*' };
