# Milestone 2: Frontend Setup

## Objective
Build the Next.js frontend with TypeScript and Tailwind CSS, creating all UI components.

## Tasks

### 2.1 Project Initialization
- [x] Create Next.js project with TypeScript and Tailwind CSS
- [x] Configure project structure (App Router)
- [x] Set up environment variables for API URL

### 2.2 TypeScript Types
- [x] Define Issue interface
- [x] Define Priority and Status enums/types
- [x] Define API response types
- [x] Define form data types

### 2.3 API Client
- [x] Create API client module with fetch wrapper
- [x] Implement `getIssues()` function
- [x] Implement `createIssue()` function
- [x] Implement `updateIssueStatus()` function
- [x] Handle error responses

### 2.4 Components

#### IssueCard Component
- [x] Display issue title, description, priority, status, date
- [x] Priority badge with color coding (orange=high, blue=medium, green=low)
- [x] Status dropdown for quick status change
- [x] Responsive card layout

#### IssueForm Component
- [x] Title input field
- [x] Description textarea
- [x] Priority select dropdown
- [x] Submit button with loading state
- [x] Form validation with error display

#### IssueList Component
- [x] Map and render IssueCard components
- [x] Empty state when no issues
- [x] Loading skeleton state
- [x] Error state with retry option

### 2.5 Main Page
- [x] Page header with title
- [x] "New Issue" button to toggle form
- [x] IssueList displaying all issues
- [x] Responsive layout (mobile-first)

## Deliverables
- Complete Next.js project structure
- All React components with TypeScript
- Tailwind CSS styling (mobile-responsive)
- API client ready for integration

## Files to Create
```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── IssueCard.tsx
│   │   ├── IssueForm.tsx
│   │   ├── IssueList.tsx
│   │   └── StatusDropdown.tsx
│   └── lib/
│       ├── api.ts
│       └── types.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## UI Design
All visual and UX decisions are defined in [`design.md`](./design.md). Refer to that file for layout, colors, components, and states.
