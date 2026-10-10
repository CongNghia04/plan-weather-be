import { db } from '@/lib/db';
import type { StreetSummary } from '@/types/api';

export async function searchStreets(q: string, limit = 20): Promise<StreetSummary[]> {
  return db.streetSegment.findMany({
    where: { name: { contains: q, mode: 'insensitive' } },
    select: { id: true, name: true, district: true, ward: true },
    distinct: ['name', 'district'],
    take: limit,
  });
}

export async function findStreetById(id: string) {
  return db.streetSegment.findUnique({
    where: { id },
    select: { id: true, name: true, district: true, ward: true, elevationM: true, floodPoints: true },
  });
}
