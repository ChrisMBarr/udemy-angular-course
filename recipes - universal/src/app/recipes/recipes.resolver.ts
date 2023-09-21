import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';

export const recipeResolver: ResolveFn<Recipe[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const recipes = inject(RecipeService).getRecipes();

  if(recipes.length === 0){
    return inject(DataStorageService).fetchRecipes();
  } else {
    return recipes;
  }
}
