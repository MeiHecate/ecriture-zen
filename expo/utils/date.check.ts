// Run with: TZ=Europe/Paris bun utils/date.check.ts
import assert from 'node:assert/strict';
import { calendarDaysBetween } from './date';

const now = new Date(2026, 8, 30, 9, 0);
// Yesterday evening is less than 24 hours ago but still "yesterday".
assert.equal(calendarDaysBetween(new Date(2026, 8, 29, 22, 0), now), 1);
assert.equal(calendarDaysBetween(new Date(2026, 8, 30, 0, 10), now), 0);
assert.equal(calendarDaysBetween(new Date(2026, 8, 27, 23, 59), now), 3);
// Across the October daylight-saving change.
assert.equal(calendarDaysBetween(new Date(2026, 9, 24, 12), new Date(2026, 9, 26, 1)), 2);

console.log('date: ok');
