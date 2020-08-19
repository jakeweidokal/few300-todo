import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DashboardProject } from 'src/app/models';
import { AppState } from 'src/app/reducers';
import { loadTodos } from './../../actions/todo.actions';
import { selectDashBoardProjects } from './../../reducers/index';
import { TodoEntryComponent } from './../todo-entry/todo-entry.component';
import { TodoListComponent } from './../todo-list/todo-list.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  projects$: Observable<DashboardProject[]>;
  routeQueryParams$: Subscription;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet
  ) {
    this.store.dispatch(loadTodos());
  }

  ngOnInit(): void {
    this.routeQueryParams$ = this.route.queryParams.subscribe(params => {
      if (params.inbox) {
        this.showList();
      }
      if (params.project) {
        this.showProject(params.project);
      }
    });
    this.projects$ = this.store.pipe(
      select(selectDashBoardProjects)
    );
  }

  addItem(): void {
    const config: MatBottomSheetConfig = {
      disableClose: true,
      autoFocus: true
    };
    this.bottomSheet.open(TodoEntryComponent, config);
  }

  private showProject(project: string): void {
    const dlg = this.dialog.open(TodoListComponent, { disableClose: false, data: { filter: project } });
    dlg.afterClosed().subscribe(_ => this.router.navigate(['dashboard']));
  }

  private showList(): void {
    const dlg = this.dialog.open(TodoListComponent, { disableClose: false, data: { filter: 'inbox' } });
    dlg.afterClosed().subscribe(_ => this.router.navigate(['dashboard']));
  }

}
