export type Priority = 'low' | 'medium' | 'high';

export interface BoardData {
  id: number;
  title: string;
  created_at: string;
  columns: ColumnData[];
}

export interface ColumnData {
  id: number;
  board: number;
  title: string;
  position: number;
  color: string;
  cards: CardData[];
}

export interface CardData {
  id: number;
  column: number;
  title: string;
  description: string;
  position: number;
  color: string;
  created_at: string;
  updated_at: string;
  comment_count: number;
  issue_id: number | null;
  issue_key: string | null;
  priority: Priority | null;
  column_title: string;
  board_title: string;
}

export interface CommentData {
  id: number;
  card: number;
  body: string;
  created_at: string;
}

export interface IssueData {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  column: number;
  card: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateIssueData {
  title: string;
  description: string;
  priority: Priority;
  column: number;
}

export interface UpdateIssueData {
  title?: string;
  description?: string;
  priority?: Priority;
  column?: number;
}

export interface UpdateCardData {
  title?: string;
  description?: string;
  column?: number;
  position?: number;
  color?: string;
}

export interface ApiError {
  [field: string]: string[];
}
