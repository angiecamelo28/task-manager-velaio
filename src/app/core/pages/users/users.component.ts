import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { User } from '../../models/model';

declare var $: any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {
  @ViewChild('userModal') userModal!: ElementRef;
  public users: Array<any> = [];
  public isEditing: boolean = false;
  public userForm: FormGroup;

  ngOnInit(): void {
    this.getUsers();
  }
  constructor(
    private alert: AlertService,
    private usersSrv: UserService,
    private fb: FormBuilder,
  ) {
    this.userForm = this.fb.group({
      userId: [0],
      name: ['', [Validators.required, Validators.minLength(5)]],
      age: [0, [Validators.required, Validators.min(18)]],
      skills: this.fb.array([])
    });
  }

  ngAfterViewInit(): void {
    $(this.userModal.nativeElement).modal();
  }

  get skills(): FormArray {
    return this.userForm.get('skills') as FormArray;
  }

  // Método para agregar una nueva habilidad al FormArray de habilidades
  addSkill() {
    this.skills.push(this.fb.control('', Validators.required));
  }

  // Método para eliminar una habilidad del FormArray
  removeSkill(index: number) {
    this.skills.removeAt(index);
  }


  /**
  * Obtiene todos los usuarios con su información (Nombre, edad y habilidades)
  */
  getUsers() {
    this.spinner();
    this.usersSrv.getUsers().subscribe({
      next: (resp: any) => {
        this.users = resp;
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


  /**
   * Elimina un usuario
   * @param id Identificación del usuario
   */
  delete(id: number) {
    Swal.fire({
      text: '¿Deseas eliminar este usuario?',
      title: 'Advertencia',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#59ac9c',
      cancelButtonColor: '#bab2b0',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.spinner();
        this.usersSrv.deleteUser(id).subscribe({
          next: (resp: any) => {
            this.alert.success(resp.response);
            this.getUsers();
          },
          error: (err: any) => {
            this.alert.error(err.error?.errors);
          },
          complete: () => {
            this.spinner();
          }
        });
      }
    })


  }

  saveUser() {

    if (this.userForm.valid) {
      this.spinner();
      if (this.isEditing) {
        const userId = this.userForm.value.userId;
        this.usersSrv.updateUser(userId, this.userForm.value).subscribe({
          next: (resp: any) => {
            this.alert.success(resp.response);
            this.users = [];
            this.getUsers();
          },
          error: (err: any) => {
            this.alert.error(err.error?.errors);
          }
        });

      } else {
        this.usersSrv.createUser(this.userForm.value).subscribe({
          next: (resp: any) => {
            this.alert.success(resp.response);
            this.users = [];
            this.getUsers();
          },
          error: (err: any) => {
            this.alert.error(err.error?.errors);
          }
        });
      }
      this.spinner();
      this.users = [];
      this.closeModal();
      this.userForm.reset();
      this.getUsers();
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  /**
   * Cierra el modal de creación/edición de usuario
   */
  closeModal() {
    $(this.userModal.nativeElement).modal('hide');
    this.userForm.reset();
    this.isEditing = false;

  }

  openModal() {
    $(this.userModal.nativeElement).modal('show');
  }

  /**
   * Llena el formulario del usuario
   * @param user Información del usuario
   */
  fillOutForm(user: User) {
    this.isEditing = true;
    this.userForm.patchValue({
      userId: user.userId,
      name: user.name,
      age: user.age
    });
    const skillsFormArray = this.userForm.get('skills') as FormArray;
    skillsFormArray.clear();
    user.skills.forEach((skill: string) => {
      skillsFormArray.push(this.fb.control(skill, Validators.required));
    });
    $(this.userModal.nativeElement).modal('show');

  }


  /**
    * Verifica si un campo específico del formulario del usuario es inválido.
    * @param field El nombre del campo a verificar.
    * @returns  `true` si el campo está vacío o es nulo y el formulario ha sido enviado, de lo contrario `false`.
    */
  public invalidField = (field: string): boolean => {
    const control = this.userForm.get(field);
    return control !== null && control.invalid && (control.dirty || control.touched);
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
