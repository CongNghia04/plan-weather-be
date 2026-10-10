import { NextResponse, type NextRequest } from 'next/server';
import { handle } from '@/lib/http';
import { AppError } from '@/lib/errors';
import { env } from '@/lib/env';
import { ingestWeather } from '@/modules/weather/weather.service';
import { runPredictions } from '@/modules/prediction/prediction.service';

/** POST /api/cron/ingest — chạy mỗi giờ (Vercel Cron / crontab). Xem docs/flows/data-ingestion.md */
export const POST = handle(async (req: NextRequest) => {
  if (req.headers.get('authorization') !== `Bearer ${env.CRON_SECRET}`) {
    throw new AppError('UNAUTHORIZED', 'Invalid cron secret', 401);
  }
  const weatherRows = await ingestWeather();
  const predictionRows = await runPredictions();
  return NextResponse.json({ weatherRows, predictionRows });
});
