import { createAction, props } from '@ngrx/store';

export const todoItemSorted = createAction(
  '[todo] todo item sorted',
  props<{ id: string, previousIndex: number, currentIndex: number }>()
);
