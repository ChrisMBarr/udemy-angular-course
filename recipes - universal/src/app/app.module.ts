//Angular Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,

    //App Modules which are not lazy loaded
    AppRoutingModule,
    CoreModule,
    SharedModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
