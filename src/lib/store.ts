import { Exam, Question } from '@/lib/types';

const store = {
  questions: [] as Question[],
  exams: [] as Exam[],
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