import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer'
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  subscription: Subscription
  recipes: Recipe[] = [];

  constructor(private store: Store<fromApp.IAppState>){}

  ngOnInit() {
    this.subscription = this.store.select('recipes')
    .pipe(map(recipesState => recipesState.recipes))
    .subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
