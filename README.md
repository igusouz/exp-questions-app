# Questions Manager

A modern, fullstack Next.js application for managing closed questions with multiple alternatives. Built with TypeScript, Tailwind CSS, and leveraging Next.js App Router with Route Handlers for API logic.

## Features

✅ **Create Questions** - Add new questions with descriptions  
✅ **Dynamic Alternatives** - Add, remove, and toggle "correct" status for alternatives  
✅ **Edit Questions** - Update existing questions and their alternatives  
✅ **Delete Questions** - Remove questions with confirmation  
✅ **Responsive UI** - Modern, clean design using Tailwind CSS  
✅ **Type-Safe** - Full TypeScript support throughout  
✅ **RESTful API** - Clean API endpoints using Next.js Route Handlers  

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Framework**: Next.js 16+ (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **API**: Next.js Route Handlers
- **Storage**: In-memory (easily replaceable with a database)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── questions/
│   │       ├── route.ts           # GET, POST endpoints
│   │       └── [id]/
│   │           └── route.ts       # GET, PUT, DELETE endpoints
│   ├── layout.tsx                 # Root layout with Tailwind
│   └── page.tsx                   # Main page component
├── components/
│   ├── QuestionForm.tsx           # Form for creating/editing questions
│   └── QuestionList.tsx           # List display component
├── lib/
│   ├── types.ts                   # TypeScript interfaces
│   └── utils.ts                   # Utility functions
```

## Data Structure

### Question
```typescript
{
  id: string;
  description: string;
  alternatives: Alternative[];
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
}
```

### Alternative
```typescript
{
  id: string;
  description: string;
  isCorrect: boolean;
}
```

## API Endpoints

### Get All Questions
```
GET /api/questions
Response: { status: 'success', data: Question[] }
```

### Create Question
```
POST /api/questions
Body: {
  description: string;
  alternatives: { description: string; isCorrect: boolean }[]
}
Response: { status: 'success', data: Question }
```

### Get Single Question
```
GET /api/questions/[id]
Response: { status: 'success', data: Question }
```

### Update Question
```
PUT /api/questions/[id]
Body: {
  description?: string;
  alternatives?: { description: string; isCorrect: boolean }[]
}
Response: { status: 'success', data: Question }
```

### Delete Question
```
DELETE /api/questions/[id]
Response: { status: 'success', message: 'Question deleted successfully' }
```

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

## Key Components

### QuestionForm.tsx
- **Purpose**: Form for creating and editing questions
- **Props**:
  - `question?`: Optional question to edit
  - `onSubmit`: Callback when form is submitted
  - `onCancel`: Callback to cancel editing
- **Features**:
  - Real-time form validation
  - Dynamic alternative management
  - Error handling and display

### QuestionList.tsx
- **Purpose**: Display list of questions
- **Props**:
  - `questions`: Array of questions to display
  - `onEdit`: Callback to edit a question
  - `onDelete`: Callback to delete a question
  - `isLoading`: Loading state indicator
- **Features**:
  - Shows correct/incorrect alternatives
  - Edit and delete buttons
  - Creation and update timestamps

### Page Component (page.tsx)
- **Purpose**: Main application container
- **Responsibilities**:
  - Manage global questions state
  - Handle API calls (fetch, create, update, delete)
  - Coordinate form and list components
  - Error handling and display

## Validation Rules

✓ Question description is required  
✓ At least one alternative is required  
✓ All alternatives must have descriptions  
✓ At least one alternative must be marked as correct  

## Usage Example

1. **Create a Question**:
   - Enter the question description
   - Click "+ Add Alternative"
   - Fill in alternative descriptions
   - Toggle "Correct" checkbox for the right answer(s)
   - Click "Save Question"

2. **Edit a Question**:
   - Click "Edit" on any question
   - Modify the description and alternatives
   - Click "Save Question"

3. **Delete a Question**:
   - Click "Delete" on any question
   - Confirm the deletion

## Future Enhancement Ideas

- Database integration (PostgreSQL, MongoDB)
- User authentication
- Question categories/tags
- Difficulty levels
- Question statistics/analytics
- Export to PDF
- Batch import from CSV

## Notes

- The current implementation uses in-memory storage. For production, replace with a database.
- IDs are generated using simple random strings. Consider using UUIDs for production.
- The API is stateless and will reset on server restart.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hooks API](https://react.dev/reference/react/hooks)
