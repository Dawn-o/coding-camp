import { test } from 'node:test';
import assert from 'node:assert';
import sum from './index.js';

test('Test function sum with various scenarios', async (t) => {
    await t.test('should correctly add two positive numbers', () => {
        assert.strictEqual(sum(2, 3), 5);
        assert.strictEqual(sum(0, 5), 5);
        assert.strictEqual(sum(10, 20), 30);
    });

    await t.test('should handle zero correctly', () => {
        assert.strictEqual(sum(0, 0), 0);
    });

    await t.test('should return 0 when any number is negative', () => {
        assert.strictEqual(sum(-1, 5), 0);
        assert.strictEqual(sum(5, -1), 0);
        assert.strictEqual(sum(-1, -1), 0);
    });

    await t.test('should return 0 for non-number inputs', () => {
        assert.strictEqual(sum('2', 3), 0);
        assert.strictEqual(sum(2, '3'), 0);
        assert.strictEqual(sum('a', 'b'), 0);
        assert.strictEqual(sum(null, 5), 0);
        assert.strictEqual(sum(5, undefined), 0);
        assert.strictEqual(sum({}, []), 0);
    });
});