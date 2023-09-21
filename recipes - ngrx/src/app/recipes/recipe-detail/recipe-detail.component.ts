import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer'
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions'
import { map, switchMap } from 'rxjs/operators';
import * as RecipesActions from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styles: ['a{cursor: pointer}']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.IAppState>
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params: Params) => +params['id']),
        switchMap(id => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map(recipesState => {
          return recipesState.recipes.find((r, idx) => {
            return idx === this.id;
          });
        })
      )
      .subscribe(recipe => {
        this.recipe = recipe;
      });
  }

  addIngredientsToShoppingList(){
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients))
  }

  onDeleteRecipe(){
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id))
    this.router.navigate(['/recipes']);
  }
}
