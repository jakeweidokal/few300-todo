import { ActionReducerMap, createSelector } from '@ngrx/store';
import { DashboardProject, Project, TodoItem } from '../models';
import * as fromAuth from './auth.reducer';
import * as fromProjects from './projects.reducer';
import * as fromTodos from './todos.reducer';
import * as fromUiHints from './ui-hints.reducer';

export interface AppState {
  projects: fromProjects.ProjectState;
  todos: fromTodos.TodoState;
  uiHints: fromUiHints.UiHintsState;
  auth: fromAuth.AuthState;
}

export const reducers: ActionReducerMap<AppState> = {
  projects: fromProjects.reducer,
  todos: fromTodos.reducer,
  uiHints: fromUiHints.reducer,
  auth: fromAuth.reducer
};

// Selectors

// One per "branch" of the state

const selectProjectsBranch = (state: AppState) => state.projects;
const selectTodosBranch = (state: AppState) => state.todos;
const selectUiHintsBranch = (state: AppState) => state.uiHints;
const selectAuthBranch = (state: AppState) => state.auth;

// Any helpers?

const { selectEntities: selectTodoEntities, selectAll: selectAllTodos } = fromTodos.adapter.getSelectors(selectTodosBranch);
const { selectAll: selectAllProjects } = fromProjects.adapter.getSelectors(selectProjectsBranch);
const selectInboxTodoSorts = createSelector(selectUiHintsBranch, b => b.inboxSort);

// Selectors fro components

// Observable<TodoItem[]>

export const selectAllProjectsList = createSelector(
  selectAllProjects,
  p => p as Project[]
);

export const selectSortedInboxTodos = createSelector(
  selectInboxTodoSorts,
  selectTodoEntities,
  (sort, entities) => sort.map(s => entities[s]) as TodoItem[]
);

export const selectInboxTodoList = createSelector(
  selectSortedInboxTodos,
  (todos) => todos.filter(t => !t.project)
);

export const selectDashBoardProjects = createSelector(
  selectAllProjectsList,
  selectAllTodos,
  (projects, todos) => projects.map(p => ({
    ...p,
    count: todos.filter(t => t.project === p.name).length
  } as DashboardProject))
);

export const selectListForProject = createSelector(
  selectAllTodos,
  (todos, props) => todos.filter((t: fromTodos.TodoEntity) => t.project === props.name) as TodoItem[]
);

export const selectIsLoggedIn = createSelector(
  selectAuthBranch,
  (b => b.isLoggedIn)
);

export const selectLoggedInUserName = createSelector(
  selectAuthBranch,
  b => b.userName
);

export const selectAuthToken = createSelector(
  selectAuthBranch,
  b => b.token
);
