'use client';

import { useState, useEffect } from 'react';
import { Question, Alternative } from '@/lib/types';
import { generateId } from '@/lib/utils';

interface QuestionFormProps {
  question?: Question;
  onSubmit: (formData: {
    description: string;
    alternatives: Omit<Alternative, 'id'>[];
  }) => Promise<void>;
  onCancel: () => void;
}

export default function QuestionForm({
  question,
  onSubmit,
  onCancel,
}: QuestionFormProps) {
  const [description, setDescription] = useState('');
  const [alternatives, setAlternatives] = useState<
    (Omit<Alternative, 'id'> & { tempId?: string })[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form with existing question data
  useEffect(() => {
    if (question) {
      setDescription(question.description);
      setAlternatives(
        question.alternatives.map((alt) => ({
          description: alt.description,
          isCorrect: alt.isCorrect,
          tempId: alt.id,
        }))
      );
    }
  }, [question]);

  const handleAddAlternative = () => {
    setAlternatives([
      ...alternatives,
      {
        description: '',
        isCorrect: false,
        tempId: generateId(),
      },
    ]);
  };

  const handleRemoveAlternative = (tempId?: string) => {
    setAlternatives(alternatives.filter((alt) => alt.tempId !== tempId));
  };

  const handleToggleCorrect = (tempId?: string) => {
    setAlternatives(
      alternatives.map((alt) =>
        alt.tempId === tempId ? { ...alt, isCorrect: !alt.isCorrect } : alt
      )
    );
  };

  const handleUpdateAlternative = (
    tempId: string | undefined,
    newDescription: string
  ) => {
    setAlternatives(
      alternatives.map((alt) =>
        alt.tempId === tempId ? { ...alt, description: newDescription } : alt
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!description.trim()) {
      setError('Question description is required');
      return;
    }

    if (alternatives.length === 0) {
      setError('At least one alternative is required');
      return;
    }

    if (alternatives.some((alt) => !alt.description.trim())) {
      setError('All alternatives must have a description');
      return;
    }

    if (!alternatives.some((alt) => alt.isCorrect)) {
      setError('At least one alternative must be marked as correct');
      return;
    }

    try {
      setIsLoading(true);
      const formData = {
        description: description.trim(),
        alternatives: alternatives.map(({ tempId, ...alt }) => alt),
      };
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        {question ? 'Edit Question' : 'New Question'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2 text-gray-800">
          Question Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter the question description"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-semibold text-gray-800">Alternatives</label>
          <button
            type="button"
            onClick={handleAddAlternative}
            disabled={isLoading}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:bg-gray-400 transition"
          >
            + Add Alternative
          </button>
        </div>

        <div className="space-y-3">
          {alternatives.map((alt) => (
            <div
              key={alt.tempId}
              className="flex gap-2 items-start p-3 border border-gray-200 rounded-md bg-gray-50"
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={alt.description}
                  onChange={(e) =>
                    handleUpdateAlternative(alt.tempId, e.target.value)
                  }
                  placeholder="Alternative description"
                  disabled={isLoading}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={alt.isCorrect}
                  onChange={() => handleToggleCorrect(alt.tempId)}
                  disabled={isLoading}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm font-medium">Correct</span>
              </label>

              <button
                type="button"
                onClick={() => handleRemoveAlternative(alt.tempId)}
                disabled={isLoading}
                className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:bg-gray-400 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition"
        >
          {isLoading ? 'Saving...' : 'Save Question'}
        </button>
      </div>
    </form>
  );
}
