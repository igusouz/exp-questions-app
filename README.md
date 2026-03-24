# Questions Manager

Fullstack Next.js application to manage closed questions, create exams from those questions, grade CSV responses, and generate randomized exam PDFs.

## Features

- Single landing page with tab navigation:
  - `Questions` area
  - `Exams` area
- Question CRUD (create, read, update, delete)
- Dynamic alternatives with `isCorrect` boolean
- Exam creation from existing questions
- Alternative identification modes:
  - `letter` (A, B, C...)
  - `powerOf2` (1, 2, 4, 8...)
- Answer key CSV export
- Student answer CSV grading:
  - `strict` mode (all-or-nothing)
  - `lenient` mode (proportional)
- PDF generation in ZIP with randomized question/alternative order for N copies
- Pre-populated seed data for quick local testing (questions + exams)
- Unit tests for core utilities and store seed integrity

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Route Handlers (API backend)
- In-memory runtime store
- `pdf-lib` + `jszip` for PDF/ZIP generation

## Project Structure

```text
src/
  app/
    api/
      questions/
        route.ts
        [id]/route.ts
      exams/
        route.ts
        [id]/route.ts
        [id]/answer-key/route.ts
        [id]/grade/route.ts
        [id]/generate-pdfs/route.ts
    page.tsx
  components/
    QuestionForm.tsx
    QuestionList.tsx
    ExamForm.tsx
    ExamList.tsx
  lib/
    types.ts
    store.ts
    utils.ts
    store.test.ts
    utils.test.ts
vitest.config.ts
```

## Core Data Models

### Alternative

```ts
{ id: string; description: string; isCorrect: boolean }
```

### Question

```ts
{ id: string; description: string; alternatives: Alternative[]; createdAt: string; updatedAt: string }
```

### Exam

```ts
{ id: string; title: string; questionIds: string[]; identificationMode: 'letter' | 'powerOf2'; createdAt: string; updatedAt: string }
```

## API Endpoints

### Questions

- `GET /api/questions`
- `POST /api/questions`
- `GET /api/questions/[id]`
- `PUT /api/questions/[id]`
- `DELETE /api/questions/[id]`

### Exams

- `GET /api/exams`
- `POST /api/exams`
- `GET /api/exams/[id]`
- `PUT /api/exams/[id]`
- `DELETE /api/exams/[id]`
- `GET /api/exams/[id]/answer-key` (CSV export)
- `POST /api/exams/[id]/grade` (CSV import + grading)
- `POST /api/exams/[id]/generate-pdfs` (ZIP with N randomized PDFs)

## CSV Grading Format

Student answers CSV supports optional header and expects at least 2 columns:

```csv
questionId,answer
q123,A|C
q456,B
```

For `powerOf2` mode, `answer` must be numeric (sum value).

## PDF Generation Rules

- Generates N copies with randomized question and alternative order
- Header contains only:
  - Subject
  - Teacher
  - Date
- Footer contains: Exam ID
- Student info (Name, CPF) is placed at the end section of the exam
- Output is downloaded as ZIP (`exam-<id>-pdfs.zip`)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

Default startup includes sample questions/exams so CSV grading and PDF generation can be tested immediately.

Production build:

```bash
npm run build
npm run start
```

## Testing

Run unit tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Notes

- Storage is intentionally in-memory at runtime.
- Data resets when the server restarts.
- This behavior is expected for the current MVP scope.
