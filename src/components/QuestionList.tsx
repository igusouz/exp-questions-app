'use client';

import { Question } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface QuestionListProps {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => Promise<void>;
  isLoading?: boolean;
}

export default function QuestionList({
  questions,
  onEdit,
  onDelete,
  isLoading = false,
}: QuestionListProps) {
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await onDelete(id);
      } catch (error) {
        alert('Failed to delete question');
      }
    }
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
        <p>No questions yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div
          key={question.id}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {question.description}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Created: {formatDate(question.createdAt)}
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(question)}
                disabled={isLoading}
                className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(question.id)}
                disabled={isLoading}
                className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50 transition"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Alternatives:
            </h4>
            <div className="space-y-2">
              {question.alternatives.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-3 rounded-md text-sm ${
                    alt.isCorrect
                      ? 'bg-green-100 border border-green-300'
                      : 'bg-gray-100 border border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{alt.description}</span>
                    {alt.isCorrect && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded font-semibold">
                        Correct
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              Updated: {formatDate(question.updatedAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
