import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Project } from 'src/app/models';
import { AppState } from 'src/app/reducers';
import * as todoActions from '../../actions/todo.actions';
import { selectAllProjectsList } from './../../reducers/index';

@Component({
  selector: 'app-todo-entry',
  templateUrl: './todo-entry.component.html',
  styleUrls: ['./todo-entry.component.scss']
})
export class TodoEntryComponent implements OnInit {

  form: FormGroup;
  projects$: Observable<Project[]>;

  constructor(
    private fromBuilder: FormBuilder,
    private bottomSheetRef: MatBottomSheetRef<TodoEntryComponent>,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.projects$ = this.store.pipe(
      select(selectAllProjectsList)
    );
    this.form = this.fromBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      project: [],
      dueDate: []
    });
  }

  submit(): void {
    console.log(this.form.value);
    this.store.dispatch(todoActions.todoAdded({
      ...this.form.value,
      dueDate: this.form.value.dueDate.toISOString()
    }));
    this.form.reset();
    this.bottomSheetRef.dismiss();
  }

  cancel(): void {
    this.bottomSheetRef.dismiss();
  }

}
