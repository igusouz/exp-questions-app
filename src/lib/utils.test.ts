import { describe, expect, it } from 'vitest';
import {
  calculateCorrectPowerOf2Sum,
  getLetterIdentifier,
  getPowerOf2Value,
  lenientLetterScore,
  parseCsvRows,
  parseLetterAnswer,
  strictLetterScore,
} from '@/lib/utils';

describe('utils', () => {
  it('maps identifiers correctly', () => {
    expect(getLetterIdentifier(0)).toBe('A');
    expect(getLetterIdentifier(3)).toBe('D');
    expect(getPowerOf2Value(0)).toBe(1);
    expect(getPowerOf2Value(4)).toBe(16);
  });

  it('calculates power-of-2 sum from correct alternatives', () => {
    const result = calculateCorrectPowerOf2Sum([
      { isCorrect: true },
      { isCorrect: false },
      { isCorrect: true },
      { isCorrect: true },
    ]);

    expect(result).toBe(13);
  });

  it('parses csv rows ignoring blank lines and trimming values', () => {
    const rows = parseCsvRows('questionId,answer\n q1 , A|C \n\nq2, B ');

    expect(rows).toEqual([
      ['questionId', 'answer'],
      ['q1', 'A|C'],
      ['q2', 'B'],
    ]);
  });

  it('parses letter answers with separators and normalizes order', () => {
    expect(parseLetterAnswer('c|a; b')).toEqual(['A', 'B', 'C']);
  });

  it('scores strict letter answers as exact match only', () => {
    expect(strictLetterScore(['A', 'C'], ['C', 'A'])).toBe(1);
    expect(strictLetterScore(['A', 'C'], ['A'])).toBe(0);
    expect(strictLetterScore(['A', 'C'], ['A', 'B'])).toBe(0);
  });

  it('scores lenient letter answers proportionally with penalties', () => {
    expect(lenientLetterScore(['A', 'C'], ['A'])).toBe(0.5);
    expect(lenientLetterScore(['A', 'C'], ['A', 'B'])).toBe(0);
    expect(lenientLetterScore(['A', 'C'], ['A', 'C', 'D'])).toBe(0.5);
  });
});
