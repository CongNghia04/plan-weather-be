import { db } from '@/lib/db';
import { fetchHourlyRain } from './weather.client';

/** Lưới phủ TP.HCM (bước ~0.05° ≈ 5.5km) */
export const HCM_GRID = (() => {
  const pts: { lat: number; lng: number }[] = [];
  for (let lat = 10.65; lat <= 10.95; lat += 0.05)
    for (let lng = 106.55; lng <= 106.85; lng += 0.05) pts.push({ lat: +lat.toFixed(2), lng: +lng.toFixed(2) });
  return pts;
})();

export const gridKeyOf = (lat: number, lng: number) =>
  `${(Math.round(lat * 20) / 20).toFixed(2)},${(Math.round(lng * 20) / 20).toFixed(2)}`;

/** Bước 1 của luồng ingest: kéo mưa cho toàn bộ lưới và upsert vào DB */
export async function ingestWeather(): Promise<number> {
  let count = 0;
  for (const p of HCM_GRID) {
    const hours = await fetchHourlyRain(p.lat, p.lng);
    const gridKey = gridKeyOf(p.lat, p.lng);
    for (const h of hours) {
      const forecastAt = new Date(h.time);
      await db.weatherForecast.upsert({
        where: { gridKey_forecastAt: { gridKey, forecastAt } },
        create: { gridKey, forecastAt, rainMm: h.rainMm },
        update: { rainMm: h.rainMm, fetchedAt: new Date() },
      });
      count++;
    }
  }
  return count;
}
