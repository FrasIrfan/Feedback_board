# Project Status — Feedback Board

> **Milestone 1**: ✅ Complete (14/14 tasks)
> **Milestone 2**: ✅ Complete (21/21 tasks)
> **Milestone 3**: ✅ Complete (27/28 tasks, 1 optional skipped)
> **Milestone 4**: ✅ Complete (Kanban board, DnD, comments, full API)
> **Date**: 2026-06-21

---

# Milestone 1 — Backend

## 1.1 Project Initialization — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Create Django project | ✅ | `django-admin startproject config .` — project root at `backend/` |
| Create issues app | ✅ | `python manage.py startapp issues` — app at `backend/issues/` |
| Install dependencies | ✅ | Django 6.0.6, DRF 3.17.1, psycopg2-binary 2.9.12, django-cors-headers 4.9.0 |

## 1.2 Database Configuration — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Configure PostgreSQL in `settings.py` | ✅ | `DATABASES` reads from env vars with dev fallbacks |
| Set up environment variables | ✅ | `settings.py` uses `os.environ.get()` with fallbacks; `.env.example` created |
| Create database | ✅ | Database `feedback_board` created in local PostgreSQL 16 |

## 1.3 Issue Model — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| `title` CharField max_length=200 | ✅ | `models.CharField(max_length=200)` |
| `description` TextField | ✅ | `models.TextField()` |
| `priority` with choices | ✅ | `CharField` with `Priority.TextChoices`: `low`, `medium`, `high` |
| `status` with choices | ✅ | Replaced by `column` FK in M4 |
| `created_at` auto_now_add | ✅ | `DateTimeField(auto_now_add=True)` |
| Run migrations | ✅ | `0001_initial` created and applied successfully |

## 1.4 API Implementation — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| IssueSerializer with validation | ✅ | Custom validators for title length, priority enum |
| IssueViewSet | ✅ | `ModelViewSet` with `get`, `post`, `patch` |
| URL routing | ✅ | Router at `api/issues/` |

## 1.5 CORS Configuration — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Install django-cors-headers | ✅ | v4.9.0 installed |
| Allow frontend origin | ✅ | `CORS_ALLOWED_ORIGINS = ['http://localhost:3000']` |

## 1.6 Validation — ✅ Complete

| Rule | Status | Verified |
|------|--------|----------|
| Title required, max 200 chars | ✅ | `POST` with no title → `"title":["This field is required."]`; 201 chars → `"Ensure this field has no more than 200 characters."` |
| Priority valid enum | ✅ | `"urgent"` → `"\"urgent\" is not a valid choice."` |
| Column required | ✅ | `POST` with no column → validation error |

---

# Milestone 2 — Frontend

## 2.1 Project Initialization — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Create Next.js project | ✅ | Next.js 16.2.9 with TypeScript + Tailwind v4 |
| Configure project structure | ✅ | App Router, `src/` directory, `components/` and `lib/` folders |
| Set up env variables | ✅ | `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000/api` |

## 2.2 TypeScript Types — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Issue, Card, Column, Board, Comment interfaces | ✅ | Full type definitions in `types.ts` |
| Priority type | ✅ | `type Priority = 'low' | 'medium' | 'high'` |
| API data types | ✅ | `BoardData`, `ColumnData`, `CardData`, `CommentData`, `IssueData` |

## 2.3 API Client — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Fetch wrapper | ✅ | Generic `request<T>()` with JSON headers, error handling |
| `getBoard()` | ✅ | `GET /api/board/` → nested Board with columns + cards |
| `createIssue()` / `updateIssue()` | ✅ | Issue CRUD via issues API |
| `updateCard()` | ✅ | Card move/reorder via cards API |
| `getComments()` / `createComment()` | ✅ | Comment CRUD via cards/{id}/comments/ |
| `createColumn()` / `updateColumn()` | ✅ | Column management |
| Error handling | ✅ | `ApiClientError` class with status + parsed body |

---

# Milestone 3 — Integration & Polish

## 3.1 Frontend-Backend Integration — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Configure API base URL | ✅ | `NEXT_PUBLIC_API_URL` in `.env.local` |
| Board loads on mount | ✅ | `getBoard()` → `GET /api/board/` |
| Create/edit issues | ✅ | `createIssue()` / `updateIssue()` |
| Card drag updates server | ✅ | `updateCard()` on drag end |
| CORS configured | ✅ | Backend allows `localhost:3000` |

## 3.2 Loading States — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Board skeleton loader | ✅ | 4 animated column skeletons |
| Loading state on form submit | ✅ | Button shows "Saving..." and is disabled |
| Disabled buttons during API calls | ✅ | `disabled` prop with reduced opacity |
| Optimistic UI for DnD | ✅ | Cards move immediately in state, revert on API failure |

## 3.3 Error Handling — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Backend validation errors displayed | ✅ | Per-field errors shown below inputs |
| User-friendly messages | ✅ | "Is the server running?" etc. |
| Network error with retry | ✅ | Error state has "Retry" button |
| Toast notifications | ✅ | Bottom-center, auto-dismiss 3s, success & error variants |
| Drag revert on failure | ✅ | Reloads board from API + error toast |

---

# Milestone 4 — Kanban Board & Full API

## 4.1 Data Model Expansion — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Board model | ✅ | `title`, `created_at`; app uses `Board.objects.first()` |
| Column model | ✅ | `board` FK, `title`, `position`, `color` (hex) |
| Card model | ✅ | `column` FK, `title`, `description`, `position`, `color`, timestamps |
| Comment model | ✅ | `card` FK, `body`, `created_at`; ordered ascending |
| Issue model: `column` FK | ✅ | `PROTECT` — cannot delete column with issues |
| Issue model: `card` OneToOne | ✅ | Auto-created on issue create; cascading delete |
| Issue model: `updated_at` | ✅ | `auto_now=True` |
| Issue model: removed `status` | ✅ | Replaced by `column` FK |

## 4.2 Seed Data — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| `seed_board` management command | ✅ | Creates 1 board + 4 columns (Backlog, In Progress, Review, Done) |
| Data migration for existing issues | ✅ | Maps old status values to columns, seeds board |
| Skips if board exists | ✅ | Idempotent |

## 4.3 API Endpoints — ✅ Complete

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/board/` | First board with nested columns + cards |
| POST | `/api/columns/` | Create column (position auto-assigned) |
| PATCH | `/api/columns/{id}/` | Update column (title, color, position) |
| GET/POST | `/api/cards/{id}/comments/` | List/add comments |
| PATCH | `/api/cards/{id}/` | Update card + sync to linked issue |
| DELETE | `/api/cards/{id}/` | Delete card (cascades to issue) |
| POST | `/api/issues/` | Create issue + auto-create linked card |
| PATCH | `/api/issues/{id}/` | Update issue + sync to card |

## 4.4 Issue ↔ Card Sync — ✅ Complete

| Trigger | Direction | What syncs |
|---------|-----------|------------|
| `POST /api/issues/` | Issue → Card | Creates Card with matching title, description, column; sets card color from priority |
| `PATCH /api/issues/{id}/` | Issue → Card | Updates title, description, color, column; repositions if column changed |
| `PATCH /api/cards/{id}/` | Card → Issue | Updates issue title, description, column |
| Drag card (column change) | Card → Issue | Via `perform_update` → `sync_issue_from_card` |

## 4.5 Card Computed Fields — ✅ Complete

| Field | Source |
|-------|--------|
| `comment_count` | `Card.comments.count()` (serializer method) |
| `issue_id` | Related Issue's ID |
| `issue_key` | `{BOARD_PREFIX}-{issue.id}` (e.g. `TFB-42`) |
| `priority` | Related Issue's priority |
| `column_title` | Card's column title |
| `board_title` | Card's column's board title |

## 4.6 Frontend — Board View — ✅ Complete

| Feature | Details |
|---------|---------|
| Load board on mount | BoardPage fetches board via API |
| Horizontal scroll columns | `overflow-x-auto` on main area |
| Error state | Message with retry button |
| Toast notifications | Success/error toasts, 3s auto-dismiss |
| Board title in header | Shows `board.title` |
| "New Issue" button | Opens create modal, defaults to first column |

## 4.7 Frontend — Column Management — ✅ Complete

| Feature | Details |
|---------|---------|
| 4 seed columns visible | Backlog, In Progress, Review, Done |
| Column title + card count | Header shows count |
| Column color dot | Accent from `column.color` |
| Edit column title | Inline edit mode (pencil icon) |
| Edit column color | ColorPicker in edit mode |
| Add column from board | "New status" button at end of board |
| Empty column state | "No issues yet" / "Drop cards here" |
| "New issue" button per column | Opens create modal with column pre-selected |

## 4.8 Frontend — Issue/Card Management — ✅ Complete

| Feature | Details |
|---------|---------|
| Create issue (header + column button) | Opens modal |
| Create issue (column button) | Pre-selects that column |
| "Create more" toggle | Keeps modal open after create |
| Edit issue (click card) | Opens same modal in edit mode |
| Issue key display | e.g. `TFB-1` on card face and modal |
| Title (required, max 200) | Auto-expanding textarea |
| Description | Optional multiline |
| Priority selector | Low / Medium / High pill menu |
| Status (column) selector | Dropdown with column options |
| Save issue | PATCH via issues API |
| Delete issue | Two-step confirm; deletes card (cascades issue) |
| Created / updated dates | Shown in edit mode |

## 4.9 Frontend — Card Display — ✅ Complete

| Feature | Details |
|---------|---------|
| Issue key | Top-left identifier |
| Title | With status icon |
| Priority pill | Colored dot + label |
| Board name pill | Cube icon + board title |
| Status icon | Varies by column name (done/progress/default) |
| Assignee placeholder | Not implemented (decorative only per spec) |
| Created / updated dates | Short format on card face |

## 4.10 Frontend — Drag-and-Drop — ✅ Complete

| Feature | Details |
|---------|---------|
| Library | `@dnd-kit/core` + `@dnd-kit/sortable` |
| Drag card within column | Reorder via sortable |
| Drag card across columns | Updates column + position |
| Drag overlay preview | Rotated/scaled card ghost |
| Optimistic UI during drag | Live preview in `handleDragOver` |
| Revert on invalid drop | Returns to original position |
| Revert on API failure | Reloads board + error toast |
| Collision detection | `closestCorners` strategy |
| Click vs drag disambiguation | Suppresses click after drag |

## 4.11 Frontend — Feedback (Comments) — ✅ Complete

| Feature | Details |
|---------|---------|
| View comments in edit modal | Loaded on modal open |
| Post new comment | From edit issue modal |
| Comment timestamps | Locale-formatted |
| Empty state | "No feedback yet." |

## 4.12 Frontend — Accessibility — ✅ Complete

| Feature | Details |
|---------|---------|
| Escape closes modal | CreateIssueForm |
| ARIA dialog attributes | `role="dialog"`, `aria-modal`, labels |
| Focus on title input | Auto-focused on modal open |
| Loading/error/empty states | All async operations covered |

## 4.13 Dependencies Added — ✅ Complete

| Dependency | Version | Purpose |
|------------|---------|---------|
| `@dnd-kit/core` | 6.x | Drag-and-drop context |
| `@dnd-kit/sortable` | 10.x | Sortable card behavior |
| `@dnd-kit/utilities` | 10.x | CSS transform utilities |
| `python-dotenv` | 1.x | Env file loading (backend) |

## 4.14 Django Admin — ✅ Complete

All models registered: Board, Column, Card, Comment, Issue.

---

## Full API Verification (Milestone 4)

```
GET /api/board/
→ 200 {"title":"Task Feedback Board","columns":[{"title":"Backlog","cards":[...]},...]}

POST /api/issues/
→ 201 {"title":"Test","priority":"high","column":1,"card":1,"issue_key":"TFB-1"}

PATCH /api/cards/1/
→ 200 {"title":"Moved","column":3,"column_title":"Review","position":0}

POST /api/cards/1/comments/
→ 201 {"body":"Feedback text","created_at":"..."}

POST /api/columns/
→ 201 {"title":"New Col","color":"#5e6ad2","position":4}

GET /api/issues/
→ 200 [{"id":1,"title":"Test","column":1,...}]
```

---

## Build Verification

- [x] TypeScript compilation: no errors
- [x] ESLint: no errors
- [x] Next.js production build: success
- [x] Django backend: migrations applied, server starts
- [x] All API endpoints verified
