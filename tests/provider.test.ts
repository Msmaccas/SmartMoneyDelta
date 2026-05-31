import path from 'path';
import { getInsiderTransactions, getBuybackAnnouncements, getOwnershipChanges, getPricePoints } from '@smd/data';

describe('fixture providers', () => {
  const fixture = path.resolve(__dirname, '../fixtures/raw/synthetic_cases.json');
  beforeAll(() => {
    process.env.FIXTURE_PATH = fixture;
  });
  test('insider provider returns expected count', () => {
    const res = getInsiderTransactions();
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.state).toBe('OK');
  });
  test('buyback provider returns expected count', () => {
    const res = getBuybackAnnouncements();
    expect(res.data.length).toBeGreaterThan(0);
  });
  test('ownership provider returns expected count', () => {
    const res = getOwnershipChanges();
    expect(res.data.length).toBe(2);
  });
  test('price provider returns expected count', () => {
    const res = getPricePoints();
    expect(res.data.length).toBe(4);
  });
});