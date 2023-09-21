import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer'
import * as AuthActions from '../auth/store/auth.actions'

@Injectable({providedIn: 'root'})
export class AuthService {
  private autoLogoutTimer = null;

  constructor(private store: Store<fromApp.IAppState>){}

  setLogoutTimer(epirationDurationMs: number){
    this.autoLogoutTimer = setTimeout(()=>{
      this.store.dispatch(new AuthActions.Logout())
    }, epirationDurationMs)
  }

  clearLogoutTimer() {
    if(this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
      this.autoLogoutTimer = null;
    }
  }
}
