import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private baseUrl = 'https://ng-recipes-45b13-default-rtdb.firebaseio.com/recipes.json';

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

  storeRecipes(){
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(this.baseUrl, recipes)
      .subscribe(response => {
        //console.log(response);
      });
  }

  fetchRecipes(){
    return this.http
      .get<Recipe[]>(this.baseUrl)
      .pipe(
        map(recipes => {
          return recipes.map(r => {
            return {
              ...r,
              ingrients: r.ingredients ? r.ingredients : []
            }
          })
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes)
        })
      );
  }

}
