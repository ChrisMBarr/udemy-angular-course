import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Recipe } from './recipe.model';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';
import { Actions, ofType } from '@ngrx/effects';
import { take, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

export const recipeResolver: ResolveFn<Recipe[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const store = inject<Store<fromApp.IAppState>>(Store);
  const actions$ = inject(Actions);

  return store.select('recipes').pipe(
    take(1),
    map(recipesState => recipesState.recipes),
    switchMap(recipes => {
      if(recipes.length === 0){
        store.dispatch(new RecipesActions.FetchRecipes());
        return actions$.pipe(
          ofType(RecipesActions.SET_RECIPES),
          take(1)
        );
      } else {
        return of(recipes);
      }
    })
  );
}
