import { db } from '@/lib/db';
import type { PredictionMapResponse } from '@/types/api';
import { getTideLevel } from '@/modules/tide/tide.service';
import { MODEL_VERSION, computeFactors, estimateDepthCm, levelOf, scoreOf } from './risk-model';

/**
 * Bước 3 của luồng ingest: tính dự đoán cho mọi đoạn đường tại các mốc giờ tới.
 * TODO: lấy rain3hMm theo gridKey của trọng tâm đoạn đường (ST_Centroid) bằng $queryRaw.
 */
export async function runPredictions(hoursAhead = 24): Promise<number> {
  const segments = await db.streetSegment.findMany({
    select: { id: true, elevationM: true, _count: { select: { floodPoints: true } } },
  });
  const now = new Date();
  now.setMinutes(0, 0, 0);
  let count = 0;

  for (let h = 0; h < hoursAhead; h++) {
    const validAt = new Date(now.getTime() + h * 3600_000);
    const tideCm = await getTideLevel(validAt);
    for (const s of segments) {
      const rain3hMm = 0; // TODO: truy vấn WeatherForecast theo gridKey của đoạn đường
      const factors = computeFactors({ rain3hMm, tideCm, historyCount: s._count.floodPoints, elevationM: s.elevationM });
      const riskScore = scoreOf(factors);
      await db.floodPrediction.upsert({
        where: { segmentId_validAt_modelVer: { segmentId: s.id, validAt, modelVer: MODEL_VERSION } },
        create: { segmentId: s.id, validAt, riskScore, riskLevel: levelOf(riskScore), depthCmEst: estimateDepthCm(riskScore), factors: { ...factors }, modelVer: MODEL_VERSION },
        update: { riskScore, riskLevel: levelOf(riskScore), depthCmEst: estimateDepthCm(riskScore), factors: { ...factors } },
      });
      count++;
    }
  }
  return count;
}

/**
 * Luồng đọc bản đồ: trả các đoạn đường có nguy cơ >= LOW trong bbox tại validAt.
 * TODO: $queryRaw với ST_Intersects(geom, ST_MakeEnvelope(...)) + ST_AsGeoJSON(geom).
 */
export async function getPredictionMap(
  bbox: [number, number, number, number],
  validAt: Date,
): Promise<PredictionMapResponse> {
  void bbox;
  return { validAt: validAt.toISOString(), modelVer: MODEL_VERSION, features: [] };
}
