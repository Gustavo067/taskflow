export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  tags?: string[];
  assignee?: User;
  createdBy: User;
  history: { from: string; to: string; date: string }[];
  createdAt: string;
  updatedAt: string;
}

export const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'A Fazer' },
  { id: 'in_progress', label: 'Em Andamento' },
  { id: 'in_review', label: 'Em Revisão' },
  { id: 'done', label: 'Concluído' },
];