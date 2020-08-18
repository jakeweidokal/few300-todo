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
  sort: string[];
}

export const adapter = createEntityAdapter<TodoEntity>();

// const initialState = adapter.getInitialState();
const initialState: TodoState = {
  ids: ['1', '2', '3'],
  entities: {
    1: { id: '1', name: 'Change light bulb', project: 'House', completed: false },
    2: { id: '2', name: 'Clean garage', completed: true },
    3: { id: '3', name: 'Take car to shop', completed: false, dueDate: '2020-08-20' }
  },
  sort: ['1', '2', '3']
};

const reducerFunction = createReducer(
  initialState,
  on(actions.todoItemSorted, (s, a) => {
    const newSort = move(s.sort, a.previousIndex, a.currentIndex);
    return { ...s, sort: newSort };
  })
);

export function reducer(state: TodoState = initialState, action: Action): TodoState {
  return reducerFunction(state, action);
}

function move<T>(arr: T[], oldIndex: number, newIndex: number): T[] {
  arr = [...arr];
  while (oldIndex < 0) {
    oldIndex += arr.length;
  }
  while (newIndex < 0) {
    newIndex += arr.length;
  }
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length;
    while ((k--) + 1) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
}

