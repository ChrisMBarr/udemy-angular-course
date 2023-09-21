import { Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import * as RecipesActions from './recipe.actions'
import { Recipe } from "../recipe.model";
import * as fromApp from '../../store/app.reducer'

@Injectable()
export class RecipeEffects {
  fetchRecipesEffect = createEffect(
    () => this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(fetchAction => {
        return this.http
          .get<Recipe[]>('https://ng-recipes-45b13-default-rtdb.firebaseio.com/recipes.json')
      }),
      map(recipes => {
        return recipes.map(r => {
          return {
            ...r,
            ingrients: r.ingredients ? r.ingredients : []
          }
        })
      }),
      map(recipes => {
        return new RecipesActions.SetRecipes(recipes);
      })
    )
  );

  storeRecipes = createEffect(
    () => this.actions$.pipe(
      ofType(RecipesActions.STORE_RECIPES),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([actionData, recipesState]) => {
        return this.http.put(
          'https://ng-recipes-45b13-default-rtdb.firebaseio.com/recipes.json',
          recipesState.recipes
        );
      }),
      map(recipes => {
       return
      }),
      map(recipes => {
        return new RecipesActions.StoreRecipes();
      })
    ),
    {dispatch: false}
  );
  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.IAppState>){}
}
