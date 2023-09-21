import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private recipes: Recipe[] = [] /*[
    new Recipe(
      'Chorizo & mozzarella gnocchi bake',
      'Upgrade cheesy tomato pasta with gnocchi, chorizo and mozzarella for a comforting bake that makes an excellent midweek meal',
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505',
      [
        new Ingredient('Cream Cheese', 1),
        new Ingredient('Greek yogurt', 1),
        new Ingredient('Chives', 1),
        new Ingredient('Dill', 1),
        new Ingredient('Ground Pepper', 1),
        new Ingredient('Bread', 2),
        new Ingredient('English cucumbers', 3)
      ]
    ),
    new Recipe(
      'Cucumber Sandwich',
      'This creamy, crunchy cucumber sandwich recipe strikes a lovely balance between decadent and light.',
      'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F44%2F2022%2F03%2F01%2Fcucumber-sandwich.jpg',
      [
        new Ingredient('Olive oil', 1),
        new Ingredient('Onion', 1),
        new Ingredient('Garlic cloves', 2),
        new Ingredient('Chorizo sausage', 1),
        new Ingredient('Cans copped tomatos', 2),
        new Ingredient('Mozzarella ball', 1),
        new Ingredient('Basil', 1),
        new Ingredient('Green salad', 1)
      ]
    )
  ];*/

  recipesChanged = new Subject<Recipe[]>;

  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    //Slice returns a copy of the array instead of a reference
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe){
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number){
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
