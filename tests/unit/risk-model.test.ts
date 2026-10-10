import { describe, expect, it } from 'vitest';
import { computeFactors, levelOf, scoreOf } from '@/modules/prediction/risk-model';

describe('risk-model', () => {
  it('khô ráo, triều thấp, đường cao => NONE', () => {
    const f = computeFactors({ rain3hMm: 0, tideCm: 100, historyCount: 0, elevationM: 3 });
    expect(levelOf(scoreOf(f))).toBe('NONE');
  });

  it('mưa lớn + triều cường + điểm ngập cũ => HIGH', () => {
    const f = computeFactors({ rain3hMm: 90, tideCm: 170, historyCount: 3, elevationM: 1 });
    expect(levelOf(scoreOf(f))).toBe('HIGH');
  });
});
