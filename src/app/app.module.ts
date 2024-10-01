import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilterPipe } from './pipes/filter.pipe';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { Pagina404Component } from './pagina404/pagina404.component';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { TaskManagerComponent } from './core/pages/tasks/task-manager/task-manager.component';
import { UsersComponent } from './core/pages/users/users.component';
import { TaskItemComponent } from './core/pages/tasks/task-item/task-item.component';
import { TaskFormComponent } from './core/pages/tasks/task-form/task-form.component';

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    Pagina404Component,
    TaskManagerComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    TaskItemComponent,
    TaskFormComponent,
    ToastrModule.forRoot(),
  ],
  exports: [
    HttpClientModule

  ],
  providers: [
    provideAnimations(),
    provideToastr()],
  bootstrap: [AppComponent]
})
export class AppModule { }
