/**
 * Alternative option in a question
 */
export interface Alternative {
  id: string;
  description: string;
  isCorrect: boolean;
}

/**
 * A closed question with multiple alternatives
 */
export interface Question {
  id: string;
  description: string;
  alternatives: Alternative[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Request payload for creating a question
 */
export interface CreateQuestionPayload {
  description: string;
  alternatives: Omit<Alternative, 'id'>[];
}

/**
 * Request payload for updating a question
 */
export interface UpdateQuestionPayload {
  description?: string;
  alternatives?: Omit<Alternative, 'id'>[];
}

export type AlternativeIdentificationMode = 'letter' | 'powerOf2';

export interface Exam {
  id: string;
  title: string;
  questionIds: string[];
  identificationMode: AlternativeIdentificationMode;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExamPayload {
  title: string;
  questionIds: string[];
  identificationMode: AlternativeIdentificationMode;
}

export interface UpdateExamPayload {
  title?: string;
  questionIds?: string[];
  identificationMode?: AlternativeIdentificationMode;
}

export interface ExamAlternativeView {
  id: string;
  description: string;
  isCorrect: boolean;
  identifier: string;
  powerOf2Value: number;
}

export interface ExamQuestionView {
  id: string;
  description: string;
  alternatives: ExamAlternativeView[];
  correctLetterAnswer: string[];
  correctPowerOf2Sum: number;
}

export interface ExamDetails extends Exam {
  questions: ExamQuestionView[];
}
