import path from 'path';
import { getInsiderTransactions } from '@smd/data';

describe('hostile inputs', () => {
  test('invalid data produces low confidence', () => {
    const hostilePath = path.resolve(__dirname, '../fixtures/hostile/invalid_cases.json');
    process.env.FIXTURE_PATH = hostilePath;
    const res = getInsiderTransactions();
    // expect some warnings and low confidence
    expect(res.state).toBe('LOW_CONFIDENCE');
    expect(res.warnings && res.warnings.length).toBeGreaterThan(0);
  });
});