export interface TodoItem {
  id: string;
  name: string;
  completed: boolean;
  project?: string;
  dueDate?: string;
}
