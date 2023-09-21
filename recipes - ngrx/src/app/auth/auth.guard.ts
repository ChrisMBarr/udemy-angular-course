import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { map, take } from "rxjs/operators";
import { inject } from "@angular/core";
import * as fromApp from '../store/app.reducer'
import { Store } from "@ngrx/store";

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  return inject<Store<fromApp.IAppState>>(Store).select('auth')
  .pipe(
    take(1),
    map(authState => {
      return authState.user;
    }),
    map(user => {
      const isAuth = !!user;
      if(isAuth){
        return true;
      } else {
        return router.createUrlTree(['/auth'])
      }
    })
  );
};
