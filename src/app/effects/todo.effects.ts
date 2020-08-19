import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import * as actions from '../actions/todo.actions';
import { TodoEntity } from '../reducers/todos.reducer';


@Injectable()
export class TodosEffects {

  // addTodo -> call POST api -> (addTodoSucceeded | addTodoFailed)
  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.addTodo),
      switchMap(a => this.client.post<TodoEntity>(environment.apiUrl + 'todos', {
        name: a.payload.name,
        project: a.payload.project,
        dueDate: a.payload.dueDate,
        completed: a.payload.completed
      }).pipe(
        map(response => actions.addTodoSucceeded({ oldId: a.payload.id, payload: response }))
      ))
    ), { dispatch: true }
  );

  // loadTodos -> go to the api -> (loadTodosSucceeded | loadTodosFailed)
  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.loadTodos),
      switchMap(() => this.client.get<{ data: TodoEntity[] }>(environment.apiUrl + 'todos')
        .pipe(
          map(response => actions.loadTodosSucceeded({ todos: response.data }))
        ))
    ), { dispatch: true }
  );

  constructor(private actions$: Actions, private client: HttpClient) { }
}
