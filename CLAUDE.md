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
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Django REST Framework
- **Database**: PostgreSQL

### Project Structure
```
Feedback_board/
├── backend/         # Django REST Framework
├── frontend/        # Next.js application
└── docs/            # Documentation & milestones
```

### Data Model Constraints
**Issue** must contain exactly these fields:
| Field       | Type                              | Validation                    |
|-------------|-----------------------------------|-------------------------------|
| title       | string                            | Required, max 200 chars       |
| description | text                              | Required                      |
| priority    | enum: `low`, `medium`, `high`     | Required, must be valid value |
| status      | enum: `open`, `in_progress`, `done` | Default: `open`             |
| created_at  | datetime                          | Auto-generated                |

### API Contract (Do Not Change)
| Method | Endpoint            | Purpose                |
|--------|---------------------|------------------------|
| GET    | /api/issues/        | List all issues        |
| POST   | /api/issues/        | Create new issue       |
| PATCH  | /api/issues/{id}/   | Update issue (status)  |

### Restrictions

1. **No Additional Dependencies** without explicit approval
   - Backend: Django, djangorestframework, psycopg2-binary, django-cors-headers only
   - Frontend: create-next-app defaults + `react-grab` (dev-only, for UI element context in development)

2. **No Authentication/Authorization** - Keep it simple, no user system

3. **No Additional Models** - Only the Issue model, no comments, tags, or users

4. **No External Services** - No cloud storage, email, or third-party APIs

5. **No Over-Engineering**
   - No Redux/Zustand - use React state and props
   - No custom hooks unless truly reusable
   - No context providers for simple state
   - No pagination unless data grows large

6. **Styling Rules**
   - Tailwind CSS only - no CSS modules, styled-components, or external UI libraries
   - Follow `docs/design.md` for all frontend UI/UX decisions
   - No custom theme configuration beyond defaults
   - Mobile-first responsive design

7. **Code Organization**
   - Backend: Single `issues` app, no splitting into multiple apps
   - Frontend: Flat component structure in `components/`, no nested folders
   - Keep files under 200 lines

### Development Rules

1. **Follow Milestones** - Complete in order: Backend → Frontend → Integration
2. **Test Each Endpoint** before moving to frontend
3. **Validate on Both Ends** - Frontend for UX, backend as source of truth
4. **Handle All States** - Loading, error, empty, success for every async operation

### Naming Conventions
- **Backend**: snake_case (Python convention)
- **Frontend**: camelCase for variables, PascalCase for components
- **API fields**: snake_case (serialized from Django)
- **CSS classes**: Tailwind utilities only