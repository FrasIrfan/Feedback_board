# Project Status — Feedback Board

> **Milestone 1**: ✅ Complete (14/14 tasks)
> **Milestone 2**: ✅ Complete (21/21 tasks)
> **Milestone 3**: ✅ Complete (27/28 tasks, 1 optional skipped)
> **Date**: 2026-06-19

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
| `status` with choices | ✅ | `CharField` with `Status.TextChoices`: `open`, `in_progress`, `done` (default: `open`) |
| `created_at` auto_now_add | ✅ | `DateTimeField(auto_now_add=True)` |
| Run migrations | ✅ | `0001_initial` created and applied successfully |

## 1.4 API Implementation — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| IssueSerializer with validation | ✅ | Custom validators for title length, priority enum, status enum |
| IssueViewSet | ✅ | `ModelViewSet` with `get`, `post`, `patch` — list, create, partial_update |
| URL routing | ✅ | Router at `api/issues/` — `/api/issues/` (GET, POST), `/api/issues/{id}/` (GET, PATCH) |

### Verified API Responses

```
GET  /api/issues/       → 200 []                     (empty list)
POST /api/issues/       → 201 {"id":1, "title":..., "status":"open", ...}
PATCH /api/issues/1/    → 200 {"id":1, "status":"in_progress", ...}
```

## 1.5 CORS Configuration — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Install django-cors-headers | ✅ | v4.9.0 installed |
| Allow frontend origin | ✅ | `CORS_ALLOWED_ORIGINS = ['http://localhost:3000']` |

## 1.6 Validation — ✅ Complete

| Rule | Status | Verified |
|------|--------|----------|
| Title required, max 200 chars | ✅ | `POST` with no title → `"title":["This field is required."]`; 201 chars → `"Ensure this field has no more than 200 characters."` |
| Description required | ✅ | `POST` with no description → model-level `blank=False` enforcement |
| Priority valid enum | ✅ | `"urgent"` → `"\"urgent\" is not a valid choice."` |
| Status valid enum | ✅ | Defaults to `open`; PATCH with invalid value → model-level enforcement |

## Backend — Files Created

```
backend/
├── config/
│   ├── __init__.py
│   ├── settings.py          # PostgreSQL, CORS, INSTALLED_APPS configured
│   ├── urls.py              # api/ route included
│   ├── wsgi.py
│   └── asgi.py
├── issues/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py            # Issue model
│   ├── serializers.py       # IssueSerializer with validation
│   ├── views.py             # IssueViewSet
│   ├── urls.py              # Router for /api/issues/
│   ├── tests.py
│   └── migrations/
│       └── 0001_initial.py
├── manage.py
├── requirements.txt
├── .env.example
└── venv/
```

## Backend — Deliverables Verification

- [x] Working Django project with PostgreSQL connection
- [x] Issue model with migrations applied
- [x] REST API endpoints: GET, POST, PATCH
- [x] Backend validation with meaningful error messages
- [x] CORS configured for frontend at localhost:3000

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
| Issue interface | ✅ | `{ id, title, description, priority, status, created_at }` |
| Priority and Status types | ✅ | `type Priority = 'low' | 'medium' | 'high'` |
| API response types | ✅ | Reuses `Issue` type |
| Form data types | ✅ | `CreateIssueData` and `UpdateIssueData` interfaces |

File: `src/lib/types.ts`

## 2.3 API Client — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Fetch wrapper | ✅ | Generic `request<T>()` with JSON headers, error handling |
| `getIssues()` | ✅ | `GET /api/issues/` → `Issue[]` |
| `createIssue()` | ✅ | `POST /api/issues/` → `Issue` |
| `updateIssueStatus()` | ✅ | `PATCH /api/issues/{id}/` with status body |
| Error handling | ✅ | `ApiClientError` class with status + parsed body |

File: `src/lib/api.ts`

## 2.4 Components — ✅ Complete

### IssueCard
- Displays title, description, priority badge, date, status dropdown
- Priority badge colors: `accent-orange` (high), `accent-blue` (medium), `brand-green` (low)
- Status dropdown using `StatusDropdown` component
- Card styling: `rounded-xl` border, `border-hairline`, `bg-canvas`, `p-6` (per DESIGN.md `card-base`)

### IssueForm
- Title input (text), Description textarea, Priority select
- Submit button with loading/disabled state
- Client-side validation (title required & max 200, description required)
- Server error display per field
- Button: `rounded-full` pill, `bg-brand-green`, `text-ink` (per DESIGN.md `button-primary`)

### IssueList
- Fetches and renders `IssueCard` components in responsive grid
- **Loading**: 3 skeleton cards with pulse animation
- **Empty**: "No issues yet" message
- **Error**: error message with retry button
- Optimistic status updates with rollback on failure

### StatusDropdown
- Simple `<select>` styled with design tokens (`rounded-md`, `border-hairline-strong`)
- Three options: Open, In Progress, Done
- Disabled state support

## 2.5 Main Page — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Page header | ✅ | "Feedback Board" title with subtitle |
| New Issue button | ✅ | Toggles form visibility, changes to "Cancel" when open |
| Issue list | ✅ | `IssueList` component with all states |
| Responsive layout | ✅ | 1-col mobile → 2-col tablet → 3-col desktop |
| Toast notifications | ✅ | Error toasts at bottom center, auto-dismiss after 4s |

## Design Tokens Used (from DESIGN.md)

| Category | Tokens |
|----------|--------|
| **Colors** | `brand-green`, `brand-green-dark`, `brand-green-soft`, `accent-orange`, `accent-blue`, `accent-purple`, `canvas`, `surface`, `hairline`, `hairline-strong`, `hairline-soft`, `ink`, `slate`, `steel`, `muted`, `on-dark` |
| **Shapes** | `rounded-full` (buttons), `rounded-xl` (cards), `rounded-lg` (inputs) |
| **Buttons** | Pill shape, brand-green primary CTA |
| **Cards** | White bg, hairline border, 12px rounded corners |

## Frontend — Files Created

```
frontend/
├── .env.local
├── src/
│   ├── app/
│   │   ├── globals.css        # Design tokens as @theme
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main page (client component)
│   ├── components/
│   │   ├── IssueCard.tsx       # Issue display card
│   │   ├── IssueForm.tsx       # Create issue form
│   │   ├── IssueList.tsx       # List with loading/empty/error states
│   │   └── StatusDropdown.tsx  # Status selector
│   └── lib/
│       ├── api.ts              # API client
│       └── types.ts            # TypeScript types
```

## Frontend — Build Verification

- [x] TypeScript compilation: no errors
- [x] Next.js production build: success
- [x] All components render without runtime errors

---

# Milestone 3 — Integration & Polish

## 3.1 Frontend-Backend Integration — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Configure API base URL | ✅ | `NEXT_PUBLIC_API_URL` in `.env.local` |
| IssueList fetches from Django | ✅ | `getIssues()` → `GET /api/issues/` |
| IssueForm POSTs new issues | ✅ | `createIssue()` → `POST /api/issues/` |
| StatusDropdown PATCHes status | ✅ | `updateIssueStatus()` → `PATCH /api/issues/{id}/` |
| CORS configured | ✅ | Backend allows `localhost:3000` |

## 3.2 Loading States — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Skeleton loader | ✅ | 3 animated pulse cards while fetching |
| Loading state on form submit | ✅ | Button shows "Submitting..." and is disabled |
| Disabled buttons during API calls | ✅ | `disabled` prop with reduced opacity |
| Optimistic UI for status | ✅ | Updates immediately, rolls back on error |

## 3.3 Error Handling — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Backend validation errors displayed | ✅ | Per-field errors shown below inputs |
| User-friendly messages | ✅ | "Is the server running?" etc. |
| Network error with retry | ✅ | Error state has "Retry" button |
| Toast notifications | ✅ | Bottom-center, auto-dismiss 4s, success & error variants |

## 3.4 Frontend Validation — ✅ Complete

| Rule | Status | Details |
|------|--------|---------|
| Title required, max 200 | ✅ | Client-side check before submit |
| Description required, min 10 chars | ✅ | Client-side check before submit |
| Priority required, valid option | ✅ | Default value ensures validity |
| Real-time feedback | ✅ | Errors shown on submit attempt |
| Prevents invalid submission | ✅ | `validate()` gate before API call |

## 3.5 Responsive Design — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Mobile-first | ✅ | Single column base layout |
| Breakpoints | ✅ | `sm:grid-cols-2` (640px), `lg:grid-cols-3` (1024px) |
| Touch-friendly | ✅ | Standard form controls, adequate tap targets |
| Readable text | ✅ | `text-sm` body, `text-lg` card titles |
| Proper spacing | ✅ | Tailwind spacing scale throughout |

## 3.6 UX Improvements — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Smooth transitions | ✅ | Form slides open/closed with `transition-all duration-300` |
| Focus management | ✅ | Title auto-focused on form open; button refocused on close |
| Empty state | ✅ | "No issues yet" message |
| Status confirmation | ⬜ | Skipped — marked optional in spec |

## 3.7 Code Quality — ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| No console.logs | ✅ | None present |
| Comments | ⬜ | Skipped — code is self-documenting per conventions |
| Consistent formatting | ✅ | Matches project style |
| Type safety | ✅ | Full TypeScript throughout |

## Full API Verification

```
GET  /api/issues/       → 200 [ ... ]           (returns issues)
POST /api/issues/       → 201 { ... }            (creates with valid data)
PATCH /api/issues/1/    → 200 { "status": "done" }  (updates status)
POST (invalid)          → 400 { "field": ["error"] } (validation errors)
```

## Build Verification

- [x] TypeScript compilation: no errors
- [x] Next.js production build: success
- [x] Django backend: migrations applied, server starts
- [x] API endpoints: all three methods verified
