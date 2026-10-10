import type { RiskFactors, RiskLevel } from '@/types/api';

/**
 * MÔ HÌNH v1 — rule-based, hàm thuần (không I/O) để dễ test.
 * Mọi thay đổi trọng số/ngưỡng => cập nhật docs/flows/flood-prediction.md mục "Công thức".
 */
export const MODEL_VERSION = 'rule-v1';

export const WEIGHTS = { rain: 0.4, tide: 0.25, history: 0.25, elevation: 0.1 } as const;

export interface RiskInput {
  rain3hMm: number;        // tổng mưa 3 giờ tới
  tideCm: number | null;   // mực triều trạm Phú An
  historyCount: number;    // số điểm ngập lịch sử trên đoạn đường
  elevationM: number | null;
}

const clamp = (x: number) => Math.max(0, Math.min(1, x));

export function computeFactors(i: RiskInput): RiskFactors {
  return {
    rain: clamp(i.rain3hMm / 80),                        // 80mm/3h ≈ mưa rất to
    tide: i.tideCm == null ? 0 : clamp((i.tideCm - 130) / 40), // >130cm bắt đầu nguy cơ, 170cm = max
    history: clamp(i.historyCount / 3),
    elevation: i.elevationM == null ? 0.5 : clamp((2 - i.elevationM) / 2), // càng thấp càng nguy cơ
  };
}

export function scoreOf(f: RiskFactors): number {
  return clamp(
    f.rain * WEIGHTS.rain + f.tide * WEIGHTS.tide + f.history * WEIGHTS.history + f.elevation * WEIGHTS.elevation,
  );
}

export function levelOf(score: number): RiskLevel {
  if (score >= 0.7) return 'HIGH';
  if (score >= 0.45) return 'MEDIUM';
  if (score >= 0.2) return 'LOW';
  return 'NONE';
}

export function estimateDepthCm(score: number): number | null {
  return score < 0.2 ? null : Math.round(score * 50);
}
