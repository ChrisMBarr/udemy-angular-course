import { AuthGuard } from '../auth/auth.guard';
import { NgModule } from '@angular/core';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { recipeResolver } from './recipes.resolver';
import { RecipesComponent } from './recipes.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',
    component: RecipesComponent,
    canActivate: [AuthGuard],
    children:[
      { path: '', component: RecipeStartComponent },
      { path: 'new', component: RecipeEditComponent },
      { path: ':id', component: RecipeDetailComponent, resolve: [recipeResolver] },
      { path: ':id/edit', component: RecipeEditComponent, resolve: [recipeResolver] },
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule {}
