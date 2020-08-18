import { ActionReducerMap, createSelector } from '@ngrx/store';
import { TodoItem } from './../models/todo-item';
import * as fromProjects from './projects.reducer';
import * as fromTodos from './todos.reducer';

export interface AppState {
  projects: fromProjects.ProjectState;
  todos: fromTodos.TodoState;
}

export const reducers: ActionReducerMap<AppState> = {
  projects: fromProjects.reducer,
  todos: fromTodos.reducer
};

// Selectors

// One per "branch" of the state

const selectProjectsBranch = (state: AppState) => state.projects;
const selectTodosBranch = (state: AppState) => state.todos;

// Any helpers?

const { selectEntities: selectTodoEntities } = fromTodos.adapter.getSelectors(selectTodosBranch);
const selectTodoSorts = createSelector(selectTodosBranch, b => b.sort);

// Selectors fro components

// Observable<TodoItem[]>

export const selectAllTodoList = createSelector(
  selectTodoEntities,
  selectTodoSorts,
  (todos, sort) => sort.map(s => todos[s]) as TodoItem[]
);

export const selectInboxTodoList = createSelector(
  selectAllTodoList,
  (todos) => todos.filter(t => !t.project)
);
