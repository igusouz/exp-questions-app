<!-- Workspace-specific custom instructions for Copilot -->

# Questions Manager - Development Guidelines

## Project Overview

This is a fullstack Next.js application for managing closed questions with multiple alternatives. The project uses:
- **Next.js 16+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hooks** for state management
- **In-memory storage** (easily replaceable with a database)

## Key Technologies & Patterns

### API Routes (Route Handlers)
- Located in `src/app/api/questions/` directory
- RESTful endpoints: GET, POST, PUT, DELETE
- Use dynamic route segments `[id]` for individual resources
- Always return consistent JSON responses with `{ status, data, message }`

### Component Structure
- **Client Components**: `QuestionForm.tsx`, `QuestionList.tsx`, `page.tsx` (all use `'use client'`)
- **Styling**: Tailwind CSS utility classes
- **Props**: Typed interfaces for all component props

### State Management
- Use `useState` for form state and UI state
- Use `useEffect` for fetching data on component mount
- API calls use native `fetch` API with proper error handling

## Type-Safe Development

All types/interfaces are defined in `src/lib/types.ts`:
- `Question`: Complete question with alternatives
- `Alternative`: Individual answer option
- `CreateQuestionPayload`: Request validation
- `UpdateQuestionPayload`: Partial updates

## Validation Rules

When modifying forms or API logic:
- Question description is required and cannot be empty
- At least one alternative is required per question
- All alternatives must have descriptions
- At least one alternative must be marked as correct

## Common Development Tasks

### Adding a New Feature
1. Define types in `src/lib/types.ts`
2. Add API logic in `src/app/api/questions/route.ts` or `[id]/route.ts`
3. Create/update components in `src/components/`
4. Update state management in `src/app/page.tsx`
5. Test with `npm run dev`

### Styling Customization
- Use Tailwind's predefined classes
- Responsive design: `sm:`, `lg:`, `xl:` prefixes
- Color scheme: Blue accents (`bg-blue-`, `text-blue-`), Red for destructive (`bg-red-`)

### API Response Format
Always use consistent response format:
```typescript
// Success
{ status: 'success', data: T }

// Error
{ status: 'error', message: string }
```

## Storage & Database

Current implementation uses in-memory array. To add database:
1. Update API routes to use database queries instead of in-memory array
2. Modify `src/lib/types.ts` as needed for database schema
3. Consider using ORMs like Prisma or TypeORM

## Testing

- Manual testing via the UI at `http://localhost:3000`
- Use browser DevTools Network tab to inspect API calls
- Test all CRUD operations before deploying

## Performance Considerations

- Component re-renders are optimized with proper dependency arrays
- Fetch requests include proper error handling
- Loading states prevent duplicate submissions
- Confirmation dialogs prevent accidental deletions

## Code Quality Standards

- Keep functions small and focused
- Use descriptive variable names
- Add JSDoc comments to exported functions
- Follow existing code style for consistency
- Always include proper TypeScript types

## Debugging Tips

1. Check browser console for client-side errors
2. Use DevTools Network tab for API issues
3. Check server terminal for route handler errors
4. Use React DevTools to inspect component state
5. Verify TypeScript compilation: `npm run build`
