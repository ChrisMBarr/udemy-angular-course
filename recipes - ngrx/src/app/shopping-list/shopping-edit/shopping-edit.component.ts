import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions'
import * as fromApp from '../../store/app.reducer'

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm;
  editMode = false;
  editedItem: Ingredient;

  private subscription: Subscription;

  constructor(
    private store: Store<fromApp.IAppState>
  ) {}

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(stateData =>{
      if(stateData.editedIngredientIndex > -1){
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.form.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      } else {
        this.editMode = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ShoppingListActions.StopEdit());
    this.subscription.unsubscribe();
  }

  onSubmit(){
    const newIngredient = new Ingredient(this.slForm.value.name, this.slForm.value.amount);

    if(this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient))
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }

    this.onClear();
  }

  onDelete(){
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  onClear() {
    this.editMode = false;
    this.slForm.reset();
    this.editedItem = undefined;

    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
