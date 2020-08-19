import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, selectInboxTodoList } from 'src/app/reducers';
import * as actions from '../../actions/todo.actions';
import { TodoItem } from './../../models/todo-item';
import { selectListForProject } from './../../reducers/index';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  items$: Observable<TodoItem[]>;

  constructor(
    private dialogRef: MatDialogRef<TodoListComponent>,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) private data: { filter: string }
  ) { }

  ngOnInit(): void {
    console.log(this.data);

    switch (this.data.filter) {
      case 'inbox': {
        this.items$ = this.store.pipe(
          select(selectInboxTodoList)
        );
        break;
      }
      default: {
        this.items$ = this.store.pipe(
          select(selectListForProject, { name: this.data.filter })
        );
      }
    }


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
