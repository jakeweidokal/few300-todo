import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../reducers';
import { selectIsLoggedIn } from './../reducers/index';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  loggedIn: boolean;

  constructor(store: Store<AppState>, private router: Router) {
    store.pipe(
      select(selectIsLoggedIn)
    ).subscribe(on => this.loggedIn = on);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.loggedIn) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
