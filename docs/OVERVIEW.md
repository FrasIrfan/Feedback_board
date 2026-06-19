# Task Feedback Board - Project Overview

## Project Description
A full-stack application for team members to submit technical issues and track their progress.

## Tech Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Django REST Framework
- **Database**: PostgreSQL

## Data Model: Issue
| Field       | Type                          | Description                    |
|-------------|-------------------------------|--------------------------------|
| id          | UUID/Integer                  | Unique identifier              |
| title       | String (max 200)              | Issue title                    |
| description | Text                          | Detailed description           |
| priority    | Enum: Low, Medium, High       | Issue priority level           |
| status      | Enum: Open, In Progress, Done | Current status                 |
| created_at  | DateTime                      | Auto-generated timestamp       |

## API Endpoints
| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | /api/issues/        | List all issues          |
| POST   | /api/issues/        | Create a new issue       |
| PATCH  | /api/issues/{id}/   | Update an issue's status |

## Project Structure
```
Feedback_board/
├── backend/                 # Django REST Framework
│   ├── config/              # Django project settings
│   ├── issues/              # Issues app
│   └── requirements.txt     # Python dependencies
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── app/             # Next.js app router
│   │   ├── components/      # React components
│   │   ├── lib/             # API client, types
│   │   └── styles/          # Global styles
│   └── package.json         # Node dependencies
└── docs/                    # Documentation
    ├── OVERVIEW.md          # This file
    ├── DESIGN.md            # Frontend UI/UX specification
    ├── MILESTONE_1.md       # Backend setup
    ├── MILESTONE_2.md       # Frontend setup
    └── MILESTONE_3.md       # Integration & polish
```

## Milestones Summary
1. **Milestone 1**: Backend Setup (Django + PostgreSQL + API)
2. **Milestone 2**: Frontend Setup (Next.js + TypeScript + Tailwind)
3. **Milestone 3**: Integration & Polish (Connect, validate, responsive)
