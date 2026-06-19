export type Priority = 'low' | 'medium' | 'high';
export type Status = 'open' | 'in_progress' | 'done';

export interface Issue {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  created_at: string;
}

export interface CreateIssueData {
  title: string;
  description: string;
  priority: Priority;
}

export interface UpdateIssueData {
  status: Status;
}

export interface ApiError {
  [field: string]: string[];
}
