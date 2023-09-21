import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { User } from "./user.model";

export interface IAuthSignUpResponseData{
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

export interface IAuthLoginResponseData extends IAuthSignUpResponseData{
  registered: boolean;
}

interface IUserFromStorage {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  private static BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private static STORAGE_KEY = 'userData';
  private autoLogoutTimer = null;

  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router){}

  signUp(email: string, password: string){
    return this.http.post<IAuthSignUpResponseData>(
      `${AuthService.BASE_URL}:signUp?key=${environment.firebaseAPIKey}`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      })
    );
  }

  login(email: string, password: string){
    return this.http
    .post<IAuthLoginResponseData>(
      `${AuthService.BASE_URL}:signInWithPassword?key=${environment.firebaseAPIKey}`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      })
    );
  }

  autoLogin(){
    const userData: IUserFromStorage = JSON.parse(localStorage.getItem(AuthService.STORAGE_KEY));
    if(!userData){
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if(loadedUser.token){
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogOut(expirationDuration);
    }
  }

  logout(){
    this.user.next(null);
    localStorage.removeItem(AuthService.STORAGE_KEY);
    if(this.autoLogoutTimer){
      clearTimeout(this.autoLogoutTimer);
    }
    this.autoLogoutTimer = null;
    this.router.navigate(['/auth']);
  }

  autoLogOut(epirationDurationMs: number){
    this.autoLogoutTimer = setTimeout(()=>{
      this.logout();
    }, epirationDurationMs)
  }

  private handleAuthentication(email: string, localId: string, idToken: string, expiresIn: number){
    const expiresInMs = expiresIn * 1000;
    const expDate = new Date(new Date().getTime() + expiresInMs);
    const user = new User(email, localId, idToken, expDate);

    this.user.next(user);
    this.autoLogOut(expiresInMs)
    localStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse){
    //console.log(errorRes)

    let errorMessage = 'An unknown error occurred!'

    if(!errorRes.error || !errorRes.error.error){
      return throwError(errorMessage);
    }

    switch (errorRes.error.error.message){
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists!'
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email was not found. Have you signed up?'
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'That password is not correct.'
        break;
    }

    return throwError(errorMessage);
  }
}
