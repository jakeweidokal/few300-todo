import { state } from '@angular/animations';
import { Action, createReducer, on } from '@ngrx/store';
import * as actions from '../actions/todo.actions';
export interface UiHintsState {
  inboxSort: string[];
}
const initialState: UiHintsState = {
  inboxSort: []
};
const reducerFunction = createReducer(
  initialState,
  on(actions.addTodoSucceeded, (s, a) => {
    if (!a.payload.project) {
      const newSort = replaceIdWithNewId(s, a);
      return { ...s, inboxSort: newSort };
    } else {
      return s;
    }
  }),
  on(actions.loadTodosSucceeded, (s, a) => {
    const ids = a.todos.filter(t => !t.project).map(t => t.id);
    return ({ ...s, inboxSort: ids }); // Sort them in the order that they come from the API
  }),
  on(actions.todoItemSorted, (state, action) => {
    const newSort = move(state.inboxSort, action.previousIndex, action.currentIndex);
    return { ...state, inboxSort: newSort };
  }),
  on(actions.todoAdded, (s, a) => !a.payload.project ? { ...state, inboxSort: [a.payload.id, ...s.inboxSort] } : s)
);

export function reducer(state: UiHintsState, action: Action): UiHintsState {
  return reducerFunction(state, action);
}

function replaceIdWithNewId(state: UiHintsState, action): string[] {
  const idx = state.inboxSort.indexOf(action.oldId);
  const newSort = Object.assign([], state.inboxSort, { [idx]: action.payload.id });
  return newSort;
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
