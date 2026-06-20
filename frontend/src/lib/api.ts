import type {
  BoardData, ColumnData, CardData, CommentData,
  IssueData, CreateIssueData, UpdateIssueData, UpdateCardData,
} from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export class ApiClientError extends Error {
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

export function getBoard(): Promise<BoardData> {
  return request<BoardData>('/board/');
}

export function createColumn(data: { title: string; color?: string }): Promise<ColumnData> {
  return request<ColumnData>('/columns/', { method: 'POST', body: JSON.stringify(data) });
}

export function updateColumn(id: number, data: { title?: string; color?: string; position?: number }): Promise<ColumnData> {
  return request<ColumnData>(`/columns/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}

export function deleteColumn(id: number): Promise<void> {
  return request<void>(`/columns/${id}/`, { method: 'DELETE' });
}

export function updateCard(id: number, data: UpdateCardData): Promise<CardData> {
  return request<CardData>(`/cards/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}

export function deleteCard(id: number): Promise<void> {
  return request<void>(`/cards/${id}/`, { method: 'DELETE' });
}

export function getComments(cardId: number): Promise<CommentData[]> {
  return request<CommentData[]>(`/cards/${cardId}/comments/`);
}

export function createComment(cardId: number, body: string): Promise<CommentData> {
  return request<CommentData>(`/cards/${cardId}/comments/`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

export function createIssue(data: CreateIssueData): Promise<IssueData> {
  return request<IssueData>('/issues/', { method: 'POST', body: JSON.stringify(data) });
}

export function updateIssue(id: number, data: UpdateIssueData): Promise<IssueData> {
  return request<IssueData>(`/issues/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}

export function getIssues(): Promise<IssueData[]> {
  return request<IssueData[]>('/issues/');
}

export function getIssue(id: number): Promise<IssueData> {
  return request<IssueData>(`/issues/${id}/`);
}
