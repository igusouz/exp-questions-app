'use client';

import { Exam, ExamDetails } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ExamListProps {
  exams: Exam[];
  selectedExam?: ExamDetails;
  isLoading: boolean;
  onViewExam: (examId: string) => Promise<void>;
  onDeleteExam: (examId: string) => Promise<void>;
}

export default function ExamList({
  exams,
  selectedExam,
  isLoading,
  onViewExam,
  onDeleteExam,
}: ExamListProps) {
  const handleDelete = async (examId: string) => {
    const shouldDelete = window.confirm('Delete this exam?');
    if (!shouldDelete) {
      return;
    }

    await onDeleteExam(examId);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Exams ({exams.length})</h2>

        {exams.length === 0 ? (
          <p className="text-gray-500">No exams created yet.</p>
        ) : (
          <div className="space-y-3">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="border border-gray-200 rounded-md p-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-800">{exam.title}</p>
                  <p className="text-sm text-gray-500">
                    {exam.questionIds.length} question(s) · Mode: {exam.identificationMode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewExam(exam.id)}
                    disabled={isLoading}
                    className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(exam.id)}
                    disabled={isLoading}
                    className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedExam && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">Exam Preview: {selectedExam.title}</h3>
            <p className="text-sm text-gray-500">
              Created: {formatDate(selectedExam.createdAt)} · Mode:{' '}
              {selectedExam.identificationMode}
            </p>
          </div>

          <div className="space-y-4">
            {selectedExam.questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-md p-4">
                <p className="font-semibold text-gray-800 mb-2">
                  {index + 1}. {question.description}
                </p>

                <div className="space-y-1 mb-3">
                  {question.alternatives.map((alternative) => (
                    <div
                      key={alternative.id}
                      className={`text-sm p-2 rounded ${
                        alternative.isCorrect
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <strong>{alternative.identifier}</strong> - {alternative.description}
                    </div>
                  ))}
                </div>

                <div className="text-sm text-gray-700">
                  <p>
                    Correct letter key: <strong>{question.correctLetterAnswer.join(', ')}</strong>
                  </p>
                  <p>
                    Correct power-of-2 sum: <strong>{question.correctPowerOf2Sum}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}