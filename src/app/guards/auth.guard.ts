import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

function checkAuth(authService: AuthService, router: Router): boolean {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    console.log('AuthGuard: User not authenticated, redirecting to login');
    router.navigate(['/login'], { 
      queryParams: { returnUrl: router.routerState.snapshot.url }
    });
    return false;
  }
  return true;
}

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Check authentication first
  if (!checkAuth(authService, router)) {
    return false;
  }

  // 2. Get the user's role and required roles from route data
  const userRole = authService.getUserRole();
  const requiredRoles = route.data?.['roles'] as string[];

  console.log('\n--- AuthGuard Check ---');
  console.log('Route:', state.url);
  console.log('User Role:', userRole);
  console.log('Required Roles:', requiredRoles || 'None');
  console.log('Stored Token:', !!authService.getToken());
  console.log('---------------------\n');

  // 3. If no specific roles required, allow access
  if (!requiredRoles || requiredRoles.length === 0) {
    console.log('AuthGuard: No role requirements, access granted');
    return true;
  }

  // 4. Check if user has any of the required roles
  if (userRole && requiredRoles.includes(userRole)) {
    console.log('AuthGuard: Role requirement satisfied, access granted');
    return true;
  }

  // 5. If we get here, the user doesn't have the required role
  console.warn(`AuthGuard: Access denied. Required one of: ${requiredRoles.join(', ')}. User role: ${userRole}`);
  router.navigate(['/dashboard/inicio']);
  return false;
};

// Admin-specific guard
export const adminGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!checkAuth(authService, router)) {
    return false;
  }
  
  const userRole = authService.getUserRole();
  
  if (userRole === 'admin') {
    console.log('AdminGuard: Admin access granted');
    return true;
  }
  
  console.warn('AdminGuard: Admin role required');
  router.navigate(['/dashboard/inicio']);
  return false;
};
