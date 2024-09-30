import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Pagina404Component } from './pagina404/pagina404.component';
import { TaskManagerComponent } from './core/pages/task-manager/task-manager.component';
import { UsersComponent } from './core/pages/users/users.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  },
  {
    path: 'task-manager',
    component: TaskManagerComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  { 
    path: '**', 
    component: Pagina404Component
   },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
