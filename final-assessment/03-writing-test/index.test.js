import { test } from 'node:test';
import assert from 'node:assert';
import { sum } from './index.js';

test('Test fungsi sum', () => {
  assert.strictEqual(sum(2, 3), 5, 'Test Case 1 Gagal: 2 + 3 harusnya 5');

  assert.strictEqual(sum(5, 0), 5, 'Test Case 2 Gagal: 5 + 0 harusnya 5');

  assert.strictEqual(sum(-2, -3), -5, 'Test Case 3 Gagal: -2 + -3 harusnya -5');

  assert.strictEqual(sum(5, -2), 3, 'Test Case 4 Gagal: 5 + -2 harusnya 3');

  assert.strictEqual(sum(0, 0), 0, 'Test Case 5 Gagal: 0 + 0 harusnya 0');
});