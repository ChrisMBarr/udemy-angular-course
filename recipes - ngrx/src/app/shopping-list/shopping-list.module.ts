//Angular
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//Modules
import { SharedModule } from '../shared/shared.module';

//Components
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list.component';


@NgModule({
  declarations:[
    ShoppingEditComponent,
    ShoppingListComponent,
  ],
  imports:[
    SharedModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: ShoppingListComponent }
    ])
  ]
})
export class ShoppingListModule {}
