import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.shoppingListService.startedEditing.subscribe((index: number) => {
      this.editMode = true;
      this.editedItemIndex = index;
      this.editedItem = this.shoppingListService.getIngredient(index);
      this.slForm.form.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      })
    });
  }

  ngOnDestroy(): void {
  }

  onSubmit(){
    const ingredient = new Ingredient(this.slForm.value.name, this.slForm.value.amount);
    if(this.editMode) {
      this.shoppingListService.updateIngredient(this.editedItemIndex, ingredient);
    } else {
      this.shoppingListService.addIngredient(ingredient);
    }

    this.onClear();
  }

  onDelete(){
    this.shoppingListService.deleteIngredient(this.editedItemIndex)

    this.onClear();
  }

  onClear() {
    this.editMode = false;
    this.slForm.reset();
    this.editedItemIndex = undefined;
    this.editedItem = undefined;
  }
}
