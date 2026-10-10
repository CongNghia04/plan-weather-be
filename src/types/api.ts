/**
 * HỢP ĐỒNG API (API contract) — FE có bản sao ở plan-weather-fe/src/types/api.ts.
 * Sửa file này => phải sửa bản bên FE và docs/flows/api-contract.md.
 */
export type RiskLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface StreetSummary {
  id: string;
  name: string;
  district: string;
  ward: string | null;
}

export interface RiskFactors {
  rain: number;      // 0..1
  tide: number;      // 0..1
  history: number;   // 0..1
  elevation: number; // 0..1
}

export interface SegmentPrediction {
  segmentId: string;
  streetName: string;
  district: string;
  validAt: string; // ISO
  riskScore: number;
  riskLevel: RiskLevel;
  depthCmEst: number | null;
  factors: RiskFactors;
  geometry: GeoJSON.LineString;
}

export interface PredictionMapResponse {
  validAt: string;
  modelVer: string;
  features: SegmentPrediction[];
}

export interface StreetDetailResponse {
  street: StreetSummary;
  timeline: Pick<SegmentPrediction, 'validAt' | 'riskScore' | 'riskLevel' | 'depthCmEst'>[];
  historicalFloodPoints: { description: string; cause: string; maxDepthCm: number | null }[];
}

export interface CreateReportRequest {
  lat: number;
  lng: number;
  depthCm: number;
  note?: string;
}
