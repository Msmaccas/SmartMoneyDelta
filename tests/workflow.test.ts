import path from 'path';
import { runDivergenceWorkflow } from '@smd/workflows';

describe('workflow', () => {
  const fixture = path.resolve(__dirname, '../fixtures/raw/synthetic_cases.json');
  beforeAll(() => {
    process.env.FIXTURE_PATH = fixture;
  });
  test('workflow returns divergence board', async () => {
    const result = await runDivergenceWorkflow();
    expect(result.details.length).toBeGreaterThan(0);
  });
});