# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## Project: Task Feedback Board

### Tech Stack (Do Not Deviate)
- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **Backend**: Django 6, Django REST Framework 3.17
- **Database**: PostgreSQL 16
- **DnD**: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities

### Project Structure
```
Feedback_board/
├── backend/           # Django REST Framework (issues app)
│   └── issues/        # All models, views, serializers, seed command
├── frontend/          # Next.js application
│   ├── src/app/       # App Router pages
│   ├── src/components/# React components (flat)
│   └── src/lib/       # API client, types, colors, indicators
└── docs/              # Documentation
```

### Data Model

| Model | Key Fields | Notes |
|-------|------------|-------|
| Board | title, created_at | Single board; app uses `.first()` |
| Column | board (FK), title, position, color | Sortable, hex color |
| Card | column (FK), title, description, position, color, created_at, updated_at | Computed: comment_count, issue_key, priority |
| Comment | card (FK), body, created_at | Ordered by created_at |
| Issue | title, description, priority, column (FK, PROTECT), card (OneToOne, CASCADE), created_at, updated_at | Key format: `{PREFIX}-{id}` |

### API Contract (Do Not Change)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/board/` | Board with nested columns + cards |
| POST | `/api/columns/` | Create column |
| PATCH | `/api/columns/{id}/` | Update column |
| DELETE | `/api/columns/{id}/` | Delete column |
| PATCH | `/api/cards/{id}/` | Update card (move, reorder) |
| DELETE | `/api/cards/{id}/` | Delete card (cascades issue) |
| GET | `/api/cards/{id}/comments/` | List comments |
| POST | `/api/cards/{id}/comments/` | Add comment |
| POST | `/api/issues/` | Create issue + card |
| PATCH | `/api/issues/{id}/` | Update issue (syncs to card) |
| GET | `/api/issues/` | List issues |

### Issue ↔ Card Sync
| Trigger | Direction | What syncs |
|---------|-----------|------------|
| `POST /api/issues/` | Issue → Card | Creates Card; sets color from priority |
| `PATCH /api/issues/{id}/` | Issue → Card | Title, description, color, column |
| `PATCH /api/cards/{id}/` | Card → Issue | Title, description, column |
| Drag card (column change) | Card → Issue | Via `sync_issue_from_card` |

### Dependencies

**Backend** (no others without approval):
- Django, djangorestframework, psycopg2-binary, django-cors-headers, python-dotenv

**Frontend** (no others without approval):
- create-next-app defaults, react-grab (dev only), @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities

### Restrictions

1. **No Authentication/Authorization** — Single-user, no login
2. **No External Services** — No cloud storage, email, or third-party APIs
3. **No Over-Engineering**
   - No Redux/Zustand — React state and props only
   - No custom hooks unless truly reusable
   - No context providers for simple state
   - No pagination unless data grows large
4. **Styling Rules**
   - Tailwind CSS only — no CSS modules, styled-components, or external UI libraries
   - Follow `docs/DESIGN.md` for all frontend UI/UX decisions
   - No custom theme configuration beyond defaults
5. **Code Organization**
   - Backend: Single `issues` app, no splitting into multiple apps
   - Frontend: Flat component structure in `components/`, no nested folders
   - Keep files under 200 lines

### Development Rules

1. **Test Each Endpoint** before moving from backend to frontend
2. **Validate on Both Ends** — Frontend for UX, backend as source of truth
3. **Handle All States** — Loading, error, empty, success for every async operation
4. **Run `npm run build` and `npm run lint`** after any frontend changes

### Naming Conventions
- **Backend**: snake_case (Python convention)
- **Frontend**: camelCase for variables, PascalCase for components
- **API fields**: snake_case (serialized from Django)
- **CSS classes**: Tailwind utilities only
