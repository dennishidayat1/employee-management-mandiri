import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login').then(m => m.Login)
  },
  {
    path: 'employees',
    loadComponent: () =>
      import('./features/employee-list/employee-list').then(m => m.EmployeeList)
  },
  {
    path: 'employee/:username',
    loadComponent: () =>
      import('./features/employee-detail/employee-detail').then(m => m.EmployeeDetail),
  },
  {
    path: 'employee/:username/edit',
    loadComponent: () => import('./features/employee-detail/employee-detail').then(m => m.EmployeeDetail)
  },
  {
    path: 'employee/new',
    loadComponent: () => import('./features/employee-detail/employee-detail').then(m => m.EmployeeDetail)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
