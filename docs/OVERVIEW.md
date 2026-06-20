# Task Feedback Board - Project Overview

## Project Description
A Trello-style Kanban application for managing work items as cards on a board with drag-and-drop, priority tracking, and threaded comments.

## Tech Stack
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS v4, @dnd-kit
- **Backend**: Django 6, Django REST Framework
- **Database**: PostgreSQL 16

## Data Model

### Entity Relationship
```
Board → Column → Card → Comment
                ↘ Issue ↗ (linked via OneToOne with Card)
```

### Board
| Field | Type | Notes |
|-------|------|-------|
| `title` | String (200) | Display name in header |
| `created_at` | DateTime | Auto-generated |

### Column
| Field | Type | Notes |
|-------|------|-------|
| `board` | FK → Board | CASCADE delete |
| `title` | String (200) | e.g. Backlog, In Progress |
| `position` | PositiveInteger | Sort order (0-based) |
| `color` | String (7) | Hex accent, default `#5e6ad2` |

### Card
| Field | Type | Notes |
|-------|------|-------|
| `column` | FK → Column | CASCADE delete |
| `title` | String (200) | Required |
| `description` | Text | Optional |
| `position` | PositiveInteger | Order within column |
| `color` | String (7) | Accent; blank = default |
| `created_at` | DateTime | Auto-generated |
| `updated_at` | DateTime | Auto-updated |

Computed fields: `comment_count`, `issue_id`, `issue_key`, `priority`, `column_title`, `board_title`

### Comment
| Field | Type | Notes |
|-------|------|-------|
| `card` | FK → Card | CASCADE delete |
| `body` | Text | Feedback text |
| `created_at` | DateTime | Ordered ascending |

### Issue
| Field | Type | Notes |
|-------|------|-------|
| `title` | String (200) | Required, max 200 chars |
| `description` | Text | Required |
| `priority` | Enum: low/medium/high | Required |
| `column` | FK → Column | PROTECT — cannot delete column with issues |
| `card` | OneToOne → Card | Nullable; auto-created on issue create |
| `created_at` | DateTime | Auto-generated |
| `updated_at` | DateTime | Auto-updated |

Issue key format: `{BOARD_PREFIX}-{issue.id}` (e.g. `TFB-42`)

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/board/` | First board with nested columns and cards |
| POST | `/api/columns/` | Create a new status column |
| PATCH | `/api/columns/{id}/` | Update column (title, color) |
| DELETE | `/api/columns/{id}/` | Delete column (blocked if issues exist) |
| PATCH | `/api/cards/{id}/` | Update card (move, reorder, edit) |
| DELETE | `/api/cards/{id}/` | Delete card (cascades to linked issue) |
| GET | `/api/cards/{id}/comments/` | List comments for a card |
| POST | `/api/cards/{id}/comments/` | Add comment to a card |
| GET | `/api/issues/` | List all issues |
| POST | `/api/issues/` | Create issue + linked card |
| PATCH | `/api/issues/{id}/` | Update issue + sync to card |

## Sync Rules
- Creating an issue auto-creates a linked card
- Updating an issue syncs title, description, priority, and column to the card
- Moving a card (drag-and-drop) syncs position and column back to the issue
- Deleting a card cascades to the linked issue

## Issue ↔ Card Color Mapping
| Priority | Color |
|----------|-------|
| High | `#e5484d` |
| Medium | `#5e6ad2` |
| Low | `#8a8f98` |

## Project Structure
```
Feedback_board/
├── backend/
│   ├── config/              # Django project settings
│   ├── issues/              # All models, views, serializers, seed command
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js app router (main page)
│   │   ├── components/      # React components (BoardPage, Column, CardTile, etc.)
│   │   └── lib/             # API client, types, colors, indicators
│   └── package.json         # Node dependencies (incl. @dnd-kit)
└── docs/
    ├── OVERVIEW.md          # This file
    ├── DESIGN.md            # Frontend design system (1996 Dell aesthetic)
    ├── TECHNICAL.md         # Full technical specification
    ├── MISSING.md           # Implementation plan
    ├── project-status.md    # Task completion tracking
    └── MILESTONE_*.md       # Per-milestone task breakdowns
```

## Seed Data
`python manage.py seed_board` creates:
- 1 board: "Task Feedback Board"
- 4 columns: Backlog (#5e6ad2), In Progress (#828fff), Review (#7a7fad), Done (#27a644)
- Skips if board already exists
