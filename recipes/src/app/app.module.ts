//Angular Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

//App Modules
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

//Components
import { AppComponent } from './app.component';
import { Coremodule as CoreModule } from './core.module';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    //App Components
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    //Angular Modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    //App Modules which are not lazy loaded
    AppRoutingModule,
    CoreModule,
    SharedModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
