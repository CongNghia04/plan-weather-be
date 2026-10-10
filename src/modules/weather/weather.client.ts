import { env } from '@/lib/env';

export interface HourlyRain {
  time: string;
  rainMm: number;
}

/** Lấy dự báo lượng mưa theo giờ từ Open-Meteo cho một toạ độ */
export async function fetchHourlyRain(lat: number, lng: number): Promise<HourlyRain[]> {
  const url = `${env.OPEN_METEO_BASE_URL}/forecast?latitude=${lat}&longitude=${lng}&hourly=precipitation&timezone=Asia%2FHo_Chi_Minh&forecast_days=2`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const data = (await res.json()) as { hourly: { time: string[]; precipitation: number[] } };
  return data.hourly.time.map((time, i) => ({ time, rainMm: data.hourly.precipitation[i] }));
}
