import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import * as RecipeActions from '../store/recipe.actions'
import * as fromApp from '../../store/app.reducer'

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  private storeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.IAppState>){}

  private initForm(){
    let recipeName = '';
    let recipeImgPath = '';
    let recipeDesc = '';
    let recipeIngredients = new FormArray([]);

    if(this.editMode){
      this.storeSub = this.store.select('recipes')
        .pipe(map(recipeState => {
          return recipeState.recipes.find((r, idx) => idx === this.id)
        }))
        .subscribe(recipe => {
          recipeName = recipe.name;
          recipeImgPath = recipe.imagePath;
          recipeDesc = recipe.description;
          if(recipe['ingredients']) {
            for(let i of recipe.ingredients){
              recipeIngredients.push(new FormGroup({
                'name': new FormControl(i.name),
                'amount': new FormControl(i.amount, [Validators.required, Validators.pattern(/^\d+$/)])
              }))
            }
          }
        })
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imgPath': new FormControl(recipeImgPath, Validators.required),
      'description': new FormControl(recipeDesc, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    })
  }

  ngOnDestroy(): void {
    if(this.storeSub){
      this.storeSub.unsubscribe();
    }
  }

  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^\d+$/)])
    }))
  }

  onDeleteIngredient(index: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onNavigateAway(){
    this.router.navigate(['../'], {relativeTo: this.route})
  }

  onSubmit(){
    const newRecipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imgPath'],
      this.recipeForm.value['ingredients'],
    );

    if(this.editMode){
      this.store.dispatch(new RecipeActions.UpdateRecipe({
        index: this.id,
        newRecipe: newRecipe
      }));
    } else {
      this.store.dispatch(new RecipeActions.AddRecipe(newRecipe));
    }

    this.onNavigateAway();
  }
}
