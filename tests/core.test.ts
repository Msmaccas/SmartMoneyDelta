import { DataState } from '@smd/core';

describe('core enums', () => {
  test('DataState has expected values', () => {
    expect(DataState.OK).toBe('OK');
    expect(DataState.NOT_AVAILABLE).toBe('NOT_AVAILABLE');
  });
});