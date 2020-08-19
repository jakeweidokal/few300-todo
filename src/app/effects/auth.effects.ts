import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import * as authActions from '../actions/auth.actions';

@Injectable()
export class AuthEffects {

  loginSucceeded = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginSucceeded),
      tap(() => this.router.navigate(['dashboard']))
    ), { dispatch: false }
  );

  // loginRequested -> login at api -> (loginSucceeded | loginFailure)
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginRequested),
      switchMap(a => this.client.post<{ access_token: string }>(environment.authUrl, { username: a.username, password: a.password })
        .pipe(
          tap(r => localStorage.setItem('auth_token', r.access_token)),
          map(r => authActions.loginSucceeded({ username: a.username, token: r.access_token })),
          catchError(_ => of(authActions.loginFailed()))
        )
      )
    )
  );

  constructor(private actions$: Actions, private client: HttpClient, private router: Router) { }
}
