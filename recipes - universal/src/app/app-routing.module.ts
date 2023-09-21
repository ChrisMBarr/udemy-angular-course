import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

//Lazy-load individual modules
const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: ()=> import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'shopping-list',
    loadChildren: ()=> import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule)
  },
  {
    path: 'recipes',
    loadChildren: ()=> import('./recipes/recipes.module').then(m => m.RecipesModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabledBlocking' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
