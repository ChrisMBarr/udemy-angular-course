import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, } from '@ngrx/effects'
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface IAuthSignUpResponseData{
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

interface IUserFromStorage {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: string;
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

  return new AuthActions.AuthenticateSuccess({
      email: email,
      userId: userId,
      token: token,
      expirationDate: expirationDate,
      redirect: true
    });
};

const handleError = (errorRes) => {
  let errorMessage = 'An unknown error occurred';
  if (!errorRes.error || !errorRes.error.error) {
      return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
          errorMessage = 'The email address is already in use by another account.';
          break;
      case 'OPERATION_NOT_ALLOWED':
          errorMessage = 'Password sign-in is disabled for this project.';
          break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
          break;
      case 'EMAIL_NOT_FOUND':
          errorMessage ='There is no user record corresponding to this identifier. The user may have been deleted.';
          break;
      case 'INVALID_PASSWORD':
          errorMessage = 'The password is invalid.';
          break;
      case 'USER_DISABLED':
          errorMessage = 'The user account has been disabled by an administrator.';
          break;
      default:
          break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {

  authSignup = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignupStart) => {
        return this.http.post<IAuthSignUpResponseData>(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
          {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true
          }
        )
        .pipe(
          tap((resData) => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map(resData => {
           return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
          }),
          catchError(errorRes => {
            return handleError(errorRes)
          })
        )
      })

    )
  );

  authLogin = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart)=> {
        return this.http.post<IAuthSignUpResponseData>(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }
        )
        .pipe(
          tap((resData) => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map(resData => {
           return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
          }),
          catchError(errorRes => {
            return handleError(errorRes)
          })
        )
      })
    )
  );

  authRedirect = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.AUTHENTICATE_SUCCESS),
      tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
        if(authSuccessAction.payload.redirect){
          this.router.navigate(['/']);
        }
      })
    ),
    { dispatch: false }
  );

  autoLogin = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: IUserFromStorage = JSON.parse(localStorage.getItem('userData'));
        if(!userData){
          return { type: 'DUMMY' };
        }

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if(loadedUser.token){
          const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);

          return new AuthActions.AuthenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false
          })
        }
        return { type: 'DUMMY' };
      })
    )
  )

  authLogout = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      tap(() => {
        this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/auth'])
      })
    ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {}
}
