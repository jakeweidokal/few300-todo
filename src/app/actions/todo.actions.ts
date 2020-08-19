import { createAction, props } from '@ngrx/store';
import { TodoEntity } from '../reducers/todos.reducer';

export const todoItemSorted = createAction(
  '[todo] todo item sorted',
  props<{ id: string, previousIndex: number, currentIndex: number }>()
);

let inc = 0;
export const todoAdded = createAction(
  '[todo] todo item added',
  ({ name, project, dueDate }: { name: string, project: string, dueDate: string }) => ({
    payload: {
      id: 'TEMPID' + inc++,
      name,
      project,
      dueDate
    } as TodoEntity
  })
);

export const addTodo = createAction(
  '[todos] add todo',
  props<{ payload: TodoEntity }>()
);

export const addTodoSucceeded = createAction(
  '[todos] add todo succeeded',
  props<{ oldId: string, payload: TodoEntity }>()
);

export const addTodoFailed = createAction(
  '[todos] add todo failed',
  props<{ payload: TodoEntity, message: string }>()
);

export const loadTodos = createAction(
  '[todos] load todos'
);

export const loadTodosSucceeded = createAction(
  '[todos] load todos succeeded',
  props<{ todos: TodoEntity[] }>()
);

export const loadTodosFailed = createAction(
  '[todos] load todos failed',
  props<{ error: string }>()
);
