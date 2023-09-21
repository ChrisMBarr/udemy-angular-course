//Angular Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

//App Modules
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import * as fromApp from './store/app.reducer'

//Components
import { AppComponent } from './app.component';
import { CoreModule } from './core.module';
import { HeaderComponent } from './header/header.component';
import { AuthEffects } from './auth/store/auth.effects';
import { RecipeEffects } from './recipes/store/recipe.effects';

@NgModule({
  declarations: [
    //App Components
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    //Angular Modules
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects, RecipeEffects]),

    //DevTools
    StoreDevtoolsModule.instrument({logOnly: environment.production}),
    StoreRouterConnectingModule.forRoot(),

    //App Modules which are not lazy loaded
    AppRoutingModule,
    CoreModule,
    SharedModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
