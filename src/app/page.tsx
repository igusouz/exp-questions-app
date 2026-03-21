'use client';

import { useEffect, useState } from 'react';
import QuestionForm from '@/components/QuestionForm';
import QuestionList from '@/components/QuestionList';
import ExamForm from '@/components/ExamForm';
import ExamList from '@/components/ExamList';
import {
  Question,
  Alternative,
  Exam,
  ExamDetails,
  CreateExamPayload,
} from '@/lib/types';

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamDetails | undefined>();
  const [editingQuestion, setEditingQuestion] = useState<Question | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all questions on mount
  useEffect(() => {
    fetchQuestions();
    fetchExams();
  }, []);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/questions');
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      setQuestions(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExams = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/exams');
      if (!response.ok) throw new Error('Failed to fetch exams');
      const data = await response.json();
      setExams(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exams');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formData: {
    description: string;
    alternatives: Omit<Alternative, 'id'>[];
  }) => {
    try {
      setIsLoading(true);

      if (editingQuestion) {
        // Update existing question
        const response = await fetch(`/api/questions/${editingQuestion.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to update question');
        const data = await response.json();

        setQuestions(
          questions.map((q) => (q.id === editingQuestion.id ? data.data : q))
        );
      } else {
        // Create new question
        const response = await fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to create question');
        const data = await response.json();
        setQuestions([...questions, data.data]);
      }

      setEditingQuestion(undefined);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (questionId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete question');

      setQuestions(questions.filter((q) => q.id !== questionId));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete question');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateExam = async (payload: CreateExamPayload) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create exam');
      }

      const data = await response.json();
      setExams((current) => [...current, data.data]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create exam');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewExam = async (examId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/exams/${examId}`);
      if (!response.ok) throw new Error('Failed to load exam preview');
      const data = await response.json();
      setSelectedExam(data.data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exam preview');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/exams/${examId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete exam');

      setExams((current) => current.filter((exam) => exam.id !== examId));
      setSelectedExam((current) => {
        if (!current || current.id !== examId) {
          return current;
        }

        return undefined;
      });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete exam');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Questions Manager
          </h1>
          <p className="text-gray-600">
            Manage your closed questions and alternatives
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <QuestionForm
              question={editingQuestion}
              onSubmit={handleFormSubmit}
              onCancel={() => setEditingQuestion(undefined)}
            />
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Questions ({questions.length})
            </h2>
            <QuestionList
              questions={questions}
              onEdit={setEditingQuestion}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ExamForm
              questions={questions}
              isLoading={isLoading}
              onSubmit={handleCreateExam}
            />
          </div>

          <div className="lg:col-span-2">
            <ExamList
              exams={exams}
              selectedExam={selectedExam}
              isLoading={isLoading}
              onViewExam={handleViewExam}
              onDeleteExam={handleDeleteExam}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
