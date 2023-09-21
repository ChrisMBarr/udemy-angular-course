import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

  private closeSub: Subscription;
  private storeSub: Subscription

  constructor(
    private store: Store<fromApp.IAppState>){}

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if(this.error){
        this.showErrorAlert(this.error)
      }
    });
  }

  ngOnDestroy(): void {
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }
    if(this.storeSub){
      this.storeSub.unsubscribe();
    }
  }

  onSwitchmode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if(form.invalid){
      return;
    }
    const email = form.value.email;
    const pass = form.value.password;

    this.isLoading = true;

    if(this.isLoginMode){
      this.store.dispatch(new AuthActions.LoginStart({email: email, password: pass}))
    } else {
      this.store.dispatch(new AuthActions.SignupStart({email: email, password: pass}))
    }

    form.reset();
  }

  private showErrorAlert(errorMessage: string){
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const cmpRef = hostViewContainerRef.createComponent(AlertComponent);

    cmpRef.instance.message = errorMessage;
    this.closeSub = cmpRef.instance.close.subscribe(()=>{
      this.store.dispatch(new AuthActions.ClearError());
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    })
  }
}
