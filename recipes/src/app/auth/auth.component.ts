import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, IAuthLoginResponseData, IAuthSignUpResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

  private closeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router){}

  ngOnDestroy(): void {
    if(this.closeSub){
      this.closeSub.unsubscribe();
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

    let authObs: Observable<IAuthLoginResponseData | IAuthSignUpResponseData>;

    if(this.isLoginMode){
      authObs = this.authService.login(email, pass);
    } else {
      authObs = this.authService.signUp(email, pass)
    }

    authObs.subscribe({
      next: responseData => {
        console.log(responseData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: errorMessage => {
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      }
    });

    form.reset();
  }

  private showErrorAlert(errorMessage: string){
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const cmpRef = hostViewContainerRef.createComponent(AlertComponent);

    cmpRef.instance.message = errorMessage;
    this.closeSub = cmpRef.instance.close.subscribe(()=>{
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    })
  }
}
