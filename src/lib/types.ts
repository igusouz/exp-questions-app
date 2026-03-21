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
