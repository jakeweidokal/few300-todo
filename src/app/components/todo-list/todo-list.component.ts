import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, selectAllTodoList } from 'src/app/reducers';
import * as actions from '../../actions/todo.actions';
import { TodoItem } from './../../models/todo-item';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  items$: Observable<TodoItem[]>;

  constructor(
    private dialogRef: MatDialogRef<TodoListComponent>,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.items$ = this.store.pipe(
      select(selectAllTodoList)
    );
  }

  drop(evt: CdkDragDrop<any[]>): void {
    if (evt.previousIndex !== evt.currentIndex) {
      this.store.dispatch(actions.todoItemSorted({
        id: evt.item.element.nativeElement.dataset.id,
        previousIndex: evt.previousIndex,
        currentIndex: evt.currentIndex
      }));
    }
  }

  done(): void {
    this.dialogRef.close();
  }

}
