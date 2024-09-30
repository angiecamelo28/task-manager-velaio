import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { Task } from '../../../models/model';
import Swal from 'sweetalert2';


declare var $: any;
@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css']
})
export class TaskManagerComponent implements OnInit, AfterViewInit {
  @ViewChild('taskModal') taskModal!: ElementRef;
  @ViewChild('taskDetailModal') taskDetailModal!: ElementRef;
  public tasks: Array<any> = [];
  public users: Array<any> = [];
  public filteredTasks: Array<any> = [];
  public taskDetails: any = [];
  public isEditing: boolean = false;
  p: number = 1;
  itemsPerPage: number = 6;
  previousPage: number | undefined;
  public taskForm: FormGroup;

  constructor(
    private tasksSrv: TaskService,
    private fb: FormBuilder,
    private alert: AlertService,
    private usersSrv: UserService
  ) {
    this.taskForm = this.fb.group({
      id: [0],
      title: ['', [Validators.required, Validators.minLength(5)]],
      date: ['', Validators.required],
      users: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getUsers();
    this.getTasks();
  }


  ngAfterViewInit(): void {
    $(this.taskModal.nativeElement).modal();
    $(this.taskDetailModal.nativeElement).modal();
  }


  /**
   * Añade una persona asignada a la tarea
   */
  newPerson(user?: any): FormGroup {
    return this.fb.group({
      userId: [user ? user.userId : 0],
      name: [user ? user.name : '', [Validators.required, Validators.minLength(5), this.uniqueNameValidator()]],
      age: [user ? user.age : '', [Validators.required, Validators.min(18)]],
      skills: this.fb.array(user ? user.skills.map((skill: string) => this.fb.control(skill, Validators.required)) : [this.fb.control('', Validators.required)])
    });
  }



  /**
    * Validación personalizada para asegurar que los nombres de las personas sean únicos
    */
  uniqueNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control?.parent?.parent as FormArray;
      if (!formArray) return null;
      const currentName = control.value;
      const allNames = formArray.controls.map(group => group.get('name')?.value);
      const duplicateCount = allNames.filter(name => name === currentName).length;
      return duplicateCount > 1 ? { duplicateName: true } : null;
    };
  }



  /**
   * Guarda la tarea si el formulario es válido
   */
  saveTask() {
    const usersArray = this.taskForm.get('users') as FormArray;
    const personWithEmptySkill = usersArray.controls.some((person: AbstractControl) => {
      const skillsArray = person.get('skills') as FormArray;
      return skillsArray.controls.some((skillControl: AbstractControl) => {
        const skillValue = skillControl.value?.trim();
        return !skillValue;
      });
    });
    if (personWithEmptySkill) {
      this.alert.warning('Hay una persona sin habilidades asignadas. Por favor, añade al menos una habilidad para cada persona.');
      return;
    }
    if (this.taskForm.valid) {
      if (this.isEditing) {
        const taskId = this.taskForm.value.id;
        this.alert.success('Tarea actualizada correctamente');
        /* this.tasksSrv.updateTask(taskId, this.taskForm.value).subscribe(() => {
          this.alert.success('Tarea actualizada correctamente');
        }); */
      } else {
        this.alert.success('Tarea creada correctamente');
        /* this.tasksSrv.createTask(this.taskForm.value).subscribe(() => {
          this.alert.success('Tarea creada correctamente');
        }); */
      }
      this.ngOnInit();
      usersArray.clear();
      $(this.taskModal.nativeElement).modal('hide');
      this.taskForm.reset();
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  /**
   * Llena el formulario de la tarea con la información de la tarea seleccionada
   * @param task Información de la tarea
   */
  fillOutForm(task: Task) {
    this.isEditing = true;
    this.taskForm.patchValue({
      id: task.id,
      title: task.title,
      date: task.date,
      users: task.users
    });
    const usersFormArray = this.taskForm.get('users') as FormArray;
    usersFormArray.clear();
    const usersForTask = this.getUsersForTask(task.users);
    usersForTask.forEach(user => {
      usersFormArray.push(this.newPerson(user));
    });
    $(this.taskModal.nativeElement).modal('show');

  }

  closeModal(modal: any) {
    if (modal == 'detail') {
      $(this.taskDetailModal.nativeElement).modal('hide');
    }
    else {
      const usersArray = this.taskForm.get('users') as FormArray;
      $(this.taskModal.nativeElement).modal('hide');
      usersArray.clear();
      this.taskForm.reset();
      this.isEditing = false;
    }
  }

  openModal() {
    $(this.taskModal.nativeElement).modal('show');
  }

  /**
   * Filtra las tareas basadas en su estado (finalizado o pendiente)
   */
  filter(event: any) {
    let value = event.target.value;
    value = value === 'true' ? true : value === 'false' ? false : '';
    this.filteredTasks = value === '' ? this.tasks : this.tasks.filter((task: any) => task.completed == value);
    this.p = 1;
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
  * Obtiene todos las tareas (Pendientes y completadas).
  */
  getTasks() {
    this.spinner();
    this.tasksSrv.getTasks().subscribe({
      next: (resp: any) => {
        //this.tasks = resp;
        this.tasks = [
          {
            id: 1,
            title: "Tarea A",
            date: "2024-01-01",
            completed: false,
            users: [1, 2]
          },
          {
            id: 2,
            title: "Tarea B",
            date: "2024-01-01",
            completed: true,
            users: [3, 4]
          },
          {
            id: 3,
            title: "Tarea C",
            date: "2024-01-01",
            completed: false,
            users: [4, 1]
          },
          {
            id: 4,
            title: "Tarea D",
            date: "2024-01-01",
            completed: true,
            users: [5, 4]
          }
        ];

        this.filteredTasks = this.tasks;
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
   * Obtiene los usuarios asociados a una tarea.
   * @param userIds Identificación del usuario
   */
  getUsersForTask(userIds: number[] | undefined) {
    if (!userIds) {
      return [];
    }
    return this.users.filter(user => userIds.includes(user.userId));
  }

  /**
   * Finalizar o completar una reserva.
   * @param reserva Información de la reserva a aceptar
   */
  markAsCompleted(task: Task) {
    task.completed = true;
    this.alert.success('Tarea completada correctamente');
    /* this.tasksSrv.updateTask(task.id,task).subscribe(response => {
      this.alert.success('Tarea completada correctamente');
    }); */
  }


  /**
   * Muestra el detalle de la tarea
   * @param task Información de la tarea seleccionada
   */
  seeDetails(task: any) {
    this.taskDetails = task;
    $(this.taskDetailModal.nativeElement).modal('show');
  }



  onPageChange(page: number): void {
    this.p = page;
  }

  /***
* Activar/desactivar el spinner de carga
*/
  spinner() {
    $(function () {
      $('#ibox').children('.ibox-content').toggleClass('sk-loading');
    })
  }

  /**
   * Activa el modal de edición de reserva
   */
  spinnerModal() {
    $(function () {
      $('#modal').children('.modal-body').toggleClass('sk-loading');
    })
  }


}
