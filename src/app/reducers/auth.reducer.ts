import { Action, createReducer, on } from '@ngrx/store';
import * as actions from '../actions/auth.actions';


export interface AuthState {
  isLoggedIn: boolean;
  userName?: string;
  token?: string;
}

const initialState: AuthState = {
  isLoggedIn: false
};

const reducerFunction = createReducer(
  initialState,
  on(actions.loginFailed, actions.logOutRequested, (s, a) => initialState),
  on(actions.loginSucceeded, (s, a) => ({
    isLoggedIn: true,
    userName: a.username,
    token: a.token
  }))
);

export function reducer(state: AuthState, action: Action) {
  return reducerFunction(state, action);
}
