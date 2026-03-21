'use client';

import { useMemo, useState } from 'react';
import {
  AlternativeIdentificationMode,
  CreateExamPayload,
  Question,
} from '@/lib/types';

interface ExamFormProps {
  questions: Question[];
  isLoading: boolean;
  onSubmit: (payload: CreateExamPayload) => Promise<void>;
}

export default function ExamForm({
  questions,
  isLoading,
  onSubmit,
}: ExamFormProps) {
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState<AlternativeIdentificationMode>('letter');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => {
    return title.trim().length > 0 && selectedQuestionIds.length > 0;
  }, [selectedQuestionIds.length, title]);

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestionIds((current) => {
      if (current.includes(questionId)) {
        return current.filter((id) => id !== questionId);
      }

      return [...current, questionId];
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!canSubmit) {
      setError('Exam title and at least one selected question are required');
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        identificationMode: mode,
        questionIds: selectedQuestionIds,
      });
      setTitle('');
      setMode('letter');
      setSelectedQuestionIds([]);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Failed to create exam'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Exam</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2 text-gray-800">Exam Title</label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Example: Math Test - Unit 1"
          disabled={isLoading}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2 text-gray-800">
          Alternative Identification
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('letter')}
            disabled={isLoading}
            className={`px-3 py-2 rounded text-sm transition ${
              mode === 'letter'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Letter (A, B, C...)
          </button>
          <button
            type="button"
            onClick={() => setMode('powerOf2')}
            disabled={isLoading}
            className={`px-3 py-2 rounded text-sm transition ${
              mode === 'powerOf2'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Power of 2 (1, 2, 4...)
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2 text-gray-800">
          Select Questions ({selectedQuestionIds.length})
        </label>
        {questions.length === 0 ? (
          <p className="text-sm text-gray-500 p-3 bg-gray-100 rounded">
            Create questions first to build an exam.
          </p>
        ) : (
          <div className="max-h-56 overflow-auto border border-gray-200 rounded-md divide-y divide-gray-200">
            {questions.map((question) => (
              <label
                key={question.id}
                className="flex items-start gap-2 p-3 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedQuestionIds.includes(question.id)}
                  onChange={() => toggleQuestion(question.id)}
                  disabled={isLoading}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">{question.description}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!canSubmit || isLoading}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 transition"
      >
        {isLoading ? 'Saving...' : 'Create Exam'}
      </button>
    </form>
  );
}