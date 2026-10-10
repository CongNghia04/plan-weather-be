import { db } from '@/lib/db';

export const MAIN_STATION = 'PHU_AN';

/**
 * Bước 2 của luồng ingest: nhập dự báo triều.
 * TODO: nguồn dữ liệu (Đài KTTV Nam Bộ) chưa có API công khai — tạm nhập tay/CSV.
 */
export async function ingestTide(rows: { forecastAt: Date; levelCm: number }[]): Promise<number> {
  for (const r of rows) {
    await db.tideForecast.upsert({
      where: { station_forecastAt: { station: MAIN_STATION, forecastAt: r.forecastAt } },
      create: { station: MAIN_STATION, ...r },
      update: { levelCm: r.levelCm },
    });
  }
  return rows.length;
}

export async function getTideLevel(at: Date): Promise<number | null> {
  const row = await db.tideForecast.findFirst({
    where: { station: MAIN_STATION, forecastAt: { lte: at } },
    orderBy: { forecastAt: 'desc' },
  });
  return row?.levelCm ?? null;
}
