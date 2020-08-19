import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, selectAuthToken, selectIsLoggedIn } from '../reducers';
import { environment } from './../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  isLoggedIn: boolean;
  token: string;

  constructor(private store: Store<AppState>) {
    this.store.pipe(
      select(selectIsLoggedIn)
    ).subscribe(r => this.isLoggedIn = r);

    this.store.pipe(
      select(selectAuthToken)
    ).subscribe(r => this.token = r);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // If the url is for our API anf NOT for the authUrl
    if (req.url !== environment.authUrl) { // NOTE: Consider using a white-list of sites to send the token to.
      // then check to see if we are logged in. If we are, pass the authorization header along with the request
      if (this.isLoggedIn) {
        const newHeaders = req.headers.append('Authorization', 'Bearer ' + this.token);
        const authReq = req.clone({ headers: newHeaders });
        return next.handle(authReq);
      }
    } else {
      // otherwise, don't do anything
      return next.handle(req);
    }
  }
}
