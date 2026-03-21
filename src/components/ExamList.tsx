'use client';

import { useState } from 'react';
import { Exam, ExamDetails } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ExamListProps {
  exams: Exam[];
  selectedExam?: ExamDetails;
  isLoading: boolean;
  onViewExam: (examId: string) => Promise<void>;
  onDeleteExam: (examId: string) => Promise<void>;
  onDownloadAnswerKey: (examId: string) => Promise<void>;
  onGradeCsv: (
    examId: string,
    gradingMode: 'strict' | 'lenient',
    csvContent: string
  ) => Promise<void>;
  onGeneratePdfs: (payload: {
    examId: string;
    subject: string;
    teacherName: string;
    date: string;
    copies: number;
    studentName?: string;
    studentCpf?: string;
  }) => Promise<void>;
  gradeSummary?: {
    gradingMode: string;
    totalScore: number;
    maxScore: number;
    percentage: number;
  };
}

export default function ExamList({
  exams,
  selectedExam,
  isLoading,
  onViewExam,
  onDeleteExam,
  onDownloadAnswerKey,
  onGradeCsv,
  onGeneratePdfs,
  gradeSummary,
}: ExamListProps) {
  const [gradingMode, setGradingMode] = useState<'strict' | 'lenient'>('strict');
  const [csvInput, setCsvInput] = useState('');
  const [subject, setSubject] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [copies, setCopies] = useState(1);
  const [studentName, setStudentName] = useState('');
  const [studentCpf, setStudentCpf] = useState('');

  const handleDelete = async (examId: string) => {
    const shouldDelete = window.confirm('Delete this exam?');
    if (!shouldDelete) {
      return;
    }

    await onDeleteExam(examId);
  };

  const handleGrade = async () => {
    if (!selectedExam) {
      return;
    }

    await onGradeCsv(selectedExam.id, gradingMode, csvInput);
  };

  const handleGeneratePdfs = async () => {
    if (!selectedExam) {
      return;
    }

    await onGeneratePdfs({
      examId: selectedExam.id,
      subject,
      teacherName,
      date: examDate,
      copies,
      studentName,
      studentCpf,
    });
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
            <h3 className="text-lg font-bold text-gray-900">Exam Preview: {selectedExam.title}</h3>
            <p className="text-sm text-gray-500">
              Created: {formatDate(selectedExam.createdAt)} · Mode:{' '}
              {selectedExam.identificationMode}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => onDownloadAnswerKey(selectedExam.id)}
                disabled={isLoading}
                className="px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                Download Answer Key (CSV)
              </button>
            </div>
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

          <div className="mt-6 border-t border-gray-200 pt-4">
            <h4 className="text-md font-bold text-gray-900 mb-2">Generate Randomized PDFs</h4>
            <p className="text-xs text-gray-500 mb-2">
              Header includes only Subject, Teacher and Date. Student info is placed at the end.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Subject"
                disabled={isLoading}
                className="p-2 border border-gray-300 rounded text-sm"
              />
              <input
                value={teacherName}
                onChange={(event) => setTeacherName(event.target.value)}
                placeholder="Teacher name"
                disabled={isLoading}
                className="p-2 border border-gray-300 rounded text-sm"
              />
              <input
                value={examDate}
                onChange={(event) => setExamDate(event.target.value)}
                placeholder="Date"
                disabled={isLoading}
                className="p-2 border border-gray-300 rounded text-sm"
              />
              <input
                type="number"
                min={1}
                max={100}
                value={copies}
                onChange={(event) => setCopies(Number(event.target.value || 1))}
                placeholder="Copies"
                disabled={isLoading}
                className="p-2 border border-gray-300 rounded text-sm"
              />
              <input
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                placeholder="Student name (optional)"
                disabled={isLoading}
                className="p-2 border border-gray-300 rounded text-sm"
              />
              <input
                value={studentCpf}
                onChange={(event) => setStudentCpf(event.target.value)}
                placeholder="Student CPF (optional)"
                disabled={isLoading}
                className="p-2 border border-gray-300 rounded text-sm"
              />
            </div>

            <button
              onClick={handleGeneratePdfs}
              disabled={
                isLoading || !subject.trim() || !teacherName.trim() || !examDate.trim()
              }
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition"
            >
              Generate PDFs (ZIP)
            </button>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <h4 className="text-md font-bold text-gray-900 mb-2">Grade Student CSV</h4>
            <p className="text-xs text-gray-500 mb-2">
              CSV format: questionId,answer (optional header line)
            </p>

            <div className="flex flex-wrap gap-2 mb-2">
              <button
                type="button"
                onClick={() => setGradingMode('strict')}
                className={`px-3 py-2 text-sm rounded ${
                  gradingMode === 'strict'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                Strict
              </button>
              <button
                type="button"
                onClick={() => setGradingMode('lenient')}
                className={`px-3 py-2 text-sm rounded ${
                  gradingMode === 'lenient'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                Lenient
              </button>
            </div>

            <textarea
              value={csvInput}
              onChange={(event) => setCsvInput(event.target.value)}
              placeholder="questionId,answer&#10;abc123,A|C&#10;def456,B"
              rows={6}
              disabled={isLoading}
              className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm"
            />

            <button
              onClick={handleGrade}
              disabled={isLoading || !csvInput.trim()}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition"
            >
              Grade CSV
            </button>

            {gradeSummary && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                <p>
                  Mode: <strong>{gradeSummary.gradingMode}</strong>
                </p>
                <p>
                  Score: <strong>{gradeSummary.totalScore.toFixed(2)}</strong> /{' '}
                  <strong>{gradeSummary.maxScore.toFixed(2)}</strong>
                </p>
                <p>
                  Percentage: <strong>{gradeSummary.percentage.toFixed(2)}%</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}