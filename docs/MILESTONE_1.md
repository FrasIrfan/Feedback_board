# Milestone 1: Backend Setup

## Objective
Set up Django REST Framework with PostgreSQL and create the Issues API.

## Tasks

### 1.1 Project Initialization
- [x] Create Django project with `django-admin startproject config .`
- [x] Create issues app with `python manage.py startapp issues`
- [x] Install dependencies: Django, djangorestframework, psycopg2-binary, django-cors-headers

### 1.2 Database Configuration
- [x] Configure PostgreSQL connection in `settings.py`
- [x] Set up environment variables for database credentials
- [x] Create database: `feedback_board`

### 1.3 Issue Model
- [x] Define Issue model with fields:
  - `title` (CharField, max_length=200)
  - `description` (TextField)
  - `priority` (CharField with choices: low, medium, high)
  - `status` (CharField with choices: open, in_progress, done)
  - `created_at` (DateTimeField, auto_now_add=True)
- [x] Run migrations

### 1.4 API Implementation
- [x] Create IssueSerializer with validation
- [x] Implement IssueViewSet with list, create, partial_update actions
- [x] Configure URL routing

### 1.5 CORS Configuration
- [x] Install and configure django-cors-headers
- [x] Allow requests from frontend origin (localhost:3000)

### 1.6 Validation
- [x] Title required, max 200 characters
- [x] Description required
- [x] Priority must be one of: low, medium, high
- [x] Status must be one of: open, in_progress, done

## Deliverables
- Working Django project with PostgreSQL connection
- Issue model with migrations applied
- REST API endpoints: GET, POST, PATCH
- Backend validation with meaningful error messages

## Testing
```bash
# Start server
python manage.py runserver 8000

# Test endpoints
curl http://localhost:8000/api/issues/
curl -X POST http://localhost:8000/api/issues/ -H "Content-Type: application/json" -d '{"title": "Test", "description": "Test desc", "priority": "high"}'
```

## Files to Create
```
backend/
├── config/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── issues/
│   ├── __init__.py
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── manage.py
└── requirements.txt
```
