import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

declare var $: any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public users: Array<any> = [];

  ngOnInit(): void {
    this.getUsers();
  }
  constructor(
    private alert: AlertService,
    private usersSrv: UserService
  ) {
  }

  /**
  * Obtiene todos los usuarios con su información (Nombre, edad y habilidades)
  */
  getUsers() {
    this.spinner();
    this.usersSrv.getUsers().subscribe({
      next: (resp: any) => {
        //this.users = resp;
        this.users = [
          {
            userId: 1,
            name: 'Carlos Pérez',
            age: 25,
            skills: ['JavaScript', 'Angular', 'TypeScript']
          },
          {
            userId: 2,
            name: 'María Gómez',
            age: 30,
            skills: ['Python', 'Django', 'Machine Learning']
          },
          {
            userId: 3,
            name: 'Juan Rodríguez',
            age: 28,
            skills: ['HTML', 'CSS', 'JavaScript']
          },
          {
            userId: 4,
            name: 'Ana Morales',
            age: 22,
            skills: ['Java', 'Spring', 'MySQL']
          },
          {
            userId: 5,
            name: 'Luis Fernández',
            age: 35,
            skills: ['PHP', 'Laravel', 'Vue.js']
          }
        ];
        $(document).ready(function () {
          $('.footable').footable({
            paginate: true,
            limitNavigation: 3,
            breakpoints: {
            }
          });
        });
      },
      error: (err: any) => {
        this.alert.error(err.error?.errors);
      },
      complete: () => {
        this.spinner();
      }
    });
  }

  /***
* Activar/desactivar el spinner de carga
*/
  spinner() {
    $(function () {
      $('#ibox').children('.ibox-content').toggleClass('sk-loading');
    })
  }

}
