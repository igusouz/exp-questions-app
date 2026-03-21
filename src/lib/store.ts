import { Exam, Question } from '@/lib/types';

const seededTimestamp = new Date().toISOString();

const seededQuestions: Question[] = [
  {
    id: 'q-math-001',
    description: 'What is the value of 12 + 8?',
    alternatives: [
      { id: 'q-math-001-a', description: '18', isCorrect: false },
      { id: 'q-math-001-b', description: '20', isCorrect: true },
      { id: 'q-math-001-c', description: '22', isCorrect: false },
      { id: 'q-math-001-d', description: '24', isCorrect: false },
    ],
    createdAt: seededTimestamp,
    updatedAt: seededTimestamp,
  },
  {
    id: 'q-math-002',
    description: 'Select all prime numbers below 10.',
    alternatives: [
      { id: 'q-math-002-a', description: '2', isCorrect: true },
      { id: 'q-math-002-b', description: '3', isCorrect: true },
      { id: 'q-math-002-c', description: '4', isCorrect: false },
      { id: 'q-math-002-d', description: '5', isCorrect: true },
    ],
    createdAt: seededTimestamp,
    updatedAt: seededTimestamp,
  },
  {
    id: 'q-science-001',
    description: 'Water boils at which temperature at sea level?',
    alternatives: [
      { id: 'q-science-001-a', description: '90°C', isCorrect: false },
      { id: 'q-science-001-b', description: '95°C', isCorrect: false },
      { id: 'q-science-001-c', description: '100°C', isCorrect: true },
      { id: 'q-science-001-d', description: '110°C', isCorrect: false },
    ],
    createdAt: seededTimestamp,
    updatedAt: seededTimestamp,
  },
  {
    id: 'q-history-001',
    description: 'Which civilizations are from ancient Mesopotamia?',
    alternatives: [
      { id: 'q-history-001-a', description: 'Sumerians', isCorrect: true },
      { id: 'q-history-001-b', description: 'Babylonians', isCorrect: true },
      { id: 'q-history-001-c', description: 'Aztecs', isCorrect: false },
      { id: 'q-history-001-d', description: 'Assyrians', isCorrect: true },
    ],
    createdAt: seededTimestamp,
    updatedAt: seededTimestamp,
  },
  {
    id: 'q-logic-001',
    description: 'Which statements are logical operators?',
    alternatives: [
      { id: 'q-logic-001-a', description: 'AND', isCorrect: true },
      { id: 'q-logic-001-b', description: 'OR', isCorrect: true },
      { id: 'q-logic-001-c', description: 'NOT', isCorrect: true },
      { id: 'q-logic-001-d', description: 'SUM', isCorrect: false },
    ],
    createdAt: seededTimestamp,
    updatedAt: seededTimestamp,
  },
];

const seededExams: Exam[] = [
  {
    id: 'exam-letter-001',
    title: 'Sample Exam - Letter Mode',
    questionIds: ['q-math-001', 'q-math-002', 'q-science-001'],
    identificationMode: 'letter',
    createdAt: seededTimestamp,
    updatedAt: seededTimestamp,
  },
  {
    id: 'exam-power-001',
    title: 'Sample Exam - Power of 2 Mode',
    questionIds: ['q-history-001', 'q-logic-001', 'q-math-002'],
    identificationMode: 'powerOf2',
    createdAt: seededTimestamp,
    updatedAt: seededTimestamp,
  },
];

const store = {
  questions: seededQuestions,
  exams: seededExams,
};

export function getQuestionsStore(): Question[] {
  return store.questions;
}

export function setQuestionsStore(questions: Question[]): void {
  store.questions = questions;
}

export function getExamsStore(): Exam[] {
  return store.exams;
}

export function setExamsStore(exams: Exam[]): void {
  store.exams = exams;
}