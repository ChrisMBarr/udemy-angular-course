//Angular
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

//Components/Directives
import { AlertComponent } from "./alert/alert.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { PlaceholderDirective } from "./placeholder.directive";
import { DropdownDirective } from "./dropdown.directive";

@NgModule({
  declarations:[
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective
  ],
  imports:[
    CommonModule
  ],
  exports:[
    CommonModule,
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective,
  ]
})
export class SharedModule{}
