import type { Issue, CreateIssueData, UpdateIssueData } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiClientError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`API request failed with status ${status}`);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiClientError(res.status, body);
  }

  return res.json();
}

export function getIssues(): Promise<Issue[]> {
  return request<Issue[]>('/issues/');
}

export function createIssue(data: CreateIssueData): Promise<Issue> {
  return request<Issue>('/issues/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateIssueStatus(id: number, data: UpdateIssueData): Promise<Issue> {
  return request<Issue>(`/issues/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export { ApiClientError };
