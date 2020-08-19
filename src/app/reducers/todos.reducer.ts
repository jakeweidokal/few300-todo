import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as actions from '../actions/todo.actions';

export interface TodoEntity {
  id: string;
  name: string;
  completed: boolean;
  project?: string;
  dueDate?: string;
}

export interface TodoState extends EntityState<TodoEntity> {
}

export const adapter = createEntityAdapter<TodoEntity>();

const initialState = adapter.getInitialState();

const reducerFunction = createReducer(
  initialState,
  on(actions.todoAdded, (s, a) => adapter.addOne(a.payload, s)),
  on(actions.loadTodosSucceeded, (s, a) => adapter.addMany(a.todos, s)),
  on(actions.addTodoSucceeded, (s, a) => {
    const tempState = adapter.removeOne(a.oldId, s);
    return adapter.addOne(a.payload, tempState);
  })
);

export function reducer(state: TodoState = initialState, action: Action): TodoState {
  return reducerFunction(state, action);
}



