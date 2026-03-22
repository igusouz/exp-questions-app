import { describe, expect, it } from 'vitest';
import { getExamsStore, getQuestionsStore } from '@/lib/store';

describe('store seed data', () => {
  it('starts with pre-populated questions', () => {
    const questions = getQuestionsStore();

    expect(questions.length).toBeGreaterThanOrEqual(5);
    expect(questions.some((question) => question.id === 'q-math-001')).toBe(true);
  });

  it('starts with pre-populated exams', () => {
    const exams = getExamsStore();

    expect(exams.length).toBeGreaterThanOrEqual(2);
    expect(exams.some((exam) => exam.id === 'exam-letter-001')).toBe(true);
    expect(exams.some((exam) => exam.id === 'exam-power-001')).toBe(true);
  });

  it('references only existing question ids in seeded exams', () => {
    const questions = getQuestionsStore();
    const exams = getExamsStore();
    const validQuestionIds = new Set(questions.map((question) => question.id));

    exams.forEach((exam) => {
      exam.questionIds.forEach((questionId) => {
        expect(validQuestionIds.has(questionId)).toBe(true);
      });
    });
  });
});
