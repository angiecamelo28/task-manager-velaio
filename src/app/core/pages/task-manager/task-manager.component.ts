import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import Swal from 'sweetalert2';
import { AlertService } from '../../services/alert.service';

declare var $: any;
@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css']
})
export class TaskManagerComponent implements OnInit {
  public tasks: Array<any> = [];
  public filteredTasks: Array<any> = [];
  public tiposDocumentos: Array<any> = [];
  public reservasAprobadas: Array<any> = [];
  public detalleReserva: any = [];
  public espacios: Array<any> = [];
  public eventos: any[] = [];
  public reserva: any = {};
  public today: string;
  public image = 'assets/img/icons/evento.png';
  p: number = 1;
  itemsPerPage: number = 6;
  previousPage: number | undefined;
  public eventosListos: boolean = false;
  public cantidadMaxima: number = 0;
  public formEditar!: FormGroup;

  constructor(
    private tasksSrv: TaskService,
    private formBuilder: FormBuilder,
    private alert: AlertService
  ) {
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.obtenerEspacios();
    this.obtenerReservas();
    this.construirFormularioEditar();
  }


  /**
   * Filtra las preordenes de acuerdo a los valores del formulario de filtro avanzado
   */
  filtrar(event:any) {
    let value = event.target.value;
    this.filteredTasks = this.tasks.filter((task: any) => task.completed != null && task.completed == value);
    this.p = 1;
  }
  /**
   * Obtiene todos los espacios físicos registrados en la base de datos.  
   */
  obtenerEspacios() {

  }

  /**
  * Obtiene todos los tasks.
  */
  obtenerReservas() {
    this.spinner();
    this.tasksSrv.getTasks().subscribe({
      next: (resp: any) => {
        //this.tasks = resp;
        this.tasks = [
          {
            "userId": 1,
            "id": 1,
            "title": "Tarea A",
            "date": "2024-01-01",
            "completed": false
          },
          {
            "userId": 1,
            "id": 2,
            "title": "Tarea B",
            "date": "2024-01-01",
            "completed": true
          },
          {
            "userId": 1,
            "id": 3,
            "title": "Tarea C",
            "date": "2024-01-01",
            "completed": false
          },
          {
            "userId": 1,
            "id": 4,
            "title": "Tarea D",
            "date": "2024-01-01",
            "completed": true
          },
          {
            "userId": 1,
            "id": 5,
            "title": "Tarea E",
            "date": "2024-01-01",
            "completed": false
          },
          {
            "userId": 1,
            "id": 6,
            "title": "Tarea F",
            "date": "2024-01-01",
            "completed": false
          },
          {
            "userId": 1,
            "id": 7,
            "title": "Tarea G",
            "date": "2024-01-01",
            "completed": false
          },
          {
            "userId": 1,
            "id": 8,
            "title": "Tarea H",
            "date": "2024-01-01",
            "completed": true
          },
          {
            "userId": 1,
            "id": 9,
            "title": "Tarea I",
            "date": "2024-01-01",
            "completed": false
          },
          {
            "userId": 1,
            "id": 10,
            "title": "Tarea L",
            "date": "2024-01-01",
            "completed": true
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

  private transformarReservasAEventos(tasks: any[]): any[] {
    return tasks
      .filter(reserva => reserva.estado !== 'cancelado')
      .map(reserva => ({
        title: reserva.descripcion,
        start: reserva.fechaInicio + 'T' + reserva.horaInicio,
        end: reserva.fechaFin + 'T' + reserva.horaFin,
      }));
  }

  /**
  * Cancela una reserva.
  * @param reserva Información de la reserva a cancelar
  */
  cancelarReserva(reserva: any) {
    Swal.fire({
      title: 'Motivo de la cancelación',
      input: 'textarea',
      inputPlaceholder: 'Ingrese el motivo de la cancelación aquí...',
      showCancelButton: true,
      confirmButtonColor: '#013B71',
      cancelButtonColor: '#bab2b0',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((inputResult: any) => {
      if (inputResult.isConfirmed && inputResult.value) {
        const razon = inputResult.value;
        Swal.fire({
          text: '¿Estás seguro que deseas cancelar esta reserva? No podrás revertir esta acción.',
          title: 'Advertencia',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#013B71',
          cancelButtonColor: '#bab2b0',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar'
        }).then((result: any) => {
          if (result.isConfirmed) {
            this.spinner();
            const { id, ...reservaSinId } = reserva;
            reservaSinId.estado = 'cancelado';
            reservaSinId.comentarios = razon;

            /*  this.tasksSrv.patch(reserva.id, reservaSinId).subscribe((resp: any) => {
               this.spinner();
               if (resp.success) {
                 Swal.fire(
                   'Cancelado!',
                   'La reserva ha sido cancelada correctamente.',
                   'success'
                 );
                 this.enviarCorreoRechazo(reserva.email, reserva, razon);
                 this.obtenerReservas();
               } else {
                 Swal.fire({
                   icon: 'error',
                   title: 'Error',
                   text: resp.errors,
                   showConfirmButton: false,
                   timer: 1500
                 });
               }
             }); */
          }
        });
      }
    });
  }

  /**
   * Aceptar una reserva.
   * @param reserva Información de la reserva a aceptar
   */
  aceptarReserva(reserva: any) {
    /*    Swal.fire({
         text: '¿Estás seguro que aprobar esta reserva? No podrás revertir esta acción.',
         title: 'Advertencia',
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#013B71',
         cancelButtonColor: '#bab2b0',
         confirmButtonText: 'Aceptar',
         cancelButtonText: 'Cancelar'
       }).then((result: any) => {
         if (result.isConfirmed) {
           this.spinner();
           const { id, ...reservaSinId } = reserva;
           reservaSinId.estado = 'aprobado';
           this.tasksSrv.patch(reserva.id, reservaSinId).subscribe((resp: any) => {
             this.spinner();
             if (resp.success) {
               Swal.fire(
                 'Aprobada!',
                 'La reserva ha sido aprobada correctamente.',
                 'success'
               );
               this.enviarCorreoAprobacion(reserva.email,reserva);
               this.obtenerReservas();
             } else {
               Swal.fire({
                 icon: 'error',
                 title: 'Error',
                 text: resp.errors,
                 showConfirmButton: false,
                 timer: 1500
               });
             }
           });
         }
       }); */
  }


  /**
   * Muestra el detalle de la reserva
   * @param reserva Información de la reserva
   */
  verDetalle(reserva: any) {
    this.detalleReserva = reserva;
  }

  /**
  * Se envia un correo electrónico al usuario si la reserva se aprueba
  * @param email Correo electrónico de usuario quién realiza la reserva
  */
  enviarCorreoAprobacion(email: string, reserva: any) {
    const espacio = this.obtenerNombreEspacio(reserva.espacioId) || '';
    /*  this.notificacionesSrv.aprobacionReserva(email,reserva, espacio).subscribe({
       next: (res: any) => {
         if (res.success) {
           Swal.fire({
             icon: 'success',
             title: 'Correo enviado',
             text: 'El correo ha sido enviado correctamente.',
             showConfirmButton: false,
             timer: 1500
           });
         }
       },
       error: (err: any) => {
         Swal.fire({
           icon: 'error',
           title: 'Error',
           text: err.error.errors,
           showConfirmButton: false,
           timer: 1500
         })
       }
     }
     ) */
  }

  /**
 * Se envia un correo electrónico al usuario si la reserva se rechaza
 * @param email Correo electrónico de usuario quién realiza la reserva
 */
  enviarCorreoRechazo(email: string, reserva: any, razon: string) {

  }


  /**
   * Inicializa el formulario para editar una reserva
   */
  construirFormularioEditar() {
    this.formEditar = this.formBuilder.group({
      id: [0, [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      horaInicio: ['', [Validators.required, this.timeRangeValidator()]],
      horaFin: ['', [Validators.required, this.timeRangeValidator()]],
      tipoDocumento: ['', [Validators.required]],
      documento: [0, [Validators.required]],
      nombres: ['', [Validators.required]],
      tipoEvento: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: [0, [Validators.required]],
      cantidad: [0, [Validators.required]],
      espacioId: [0, [Validators.required]],
      nombreDocente: [''],
      programa: [''],
    }, { validator: this.dateRangeValidator() })
  }


  /**
   * Configura el formulario de edición con los datos del reserva proporcionado.
   * @param reserva El objeto reserva cuyas propiedades se utilizarán para llenar el formulario de edición.
   */
  llenarFormulario(reserva: any) {
    this.obtenerReservasAprobadas(reserva.id);
    this.formEditar.patchValue({
      id: reserva.id,
      fechaInicio: reserva.fechaInicio,
      fechaFin: reserva.fechaFin,
      horaInicio: reserva.horaInicio,
      horaFin: reserva.horaFin,
      tipoDocumento: reserva.tipoDocumento,
      documento: reserva.documento,
      nombres: reserva.nombre,
      tipoEvento: reserva.tipoEvento,
      apellidos: reserva.apellidos,
      email: reserva.email,
      telefono: reserva.telefono,
      descripcion: reserva.descripcion,
      precio: reserva.precio,
      cantidad: reserva.cantidad,
      espacioId: reserva.espacioId,
      nombreDocente: reserva.nombreDocente,
      programa: reserva.programa,
    });
    this.formEditar.controls['id'].setValue(reserva.id);
    const res = this.espacios.find(esp => esp.id === reserva.espacioId);
    this.cantidadMaxima = res ? res.capacidad : 0;
  }

  /**
   * Valida si la cantidad de personas excede la capacidad máxima del espacio.
   * @returns `true` si la cantidad de personas excede la capacidad máxima del espacio, de lo contrario `false`.
   */
  excederCapacidad() {
    return this.formEditar.value.cantidad > this.cantidadMaxima;
  }

  /**
   * Cambia las validaciones del formulario según el tipo de documento seleccionado.
   * @param event Información del tipo de documento
   */
  onChangeDocumento(event: any) {
    const tipoIdentificacion = event.target.value;
    if (tipoIdentificacion == 3) {
      this.agregarValidaciones();
    }
    else {
      this.quitarValidaciones()
    }
  }

  /**
   * Busca la cantidad máxima de personas permitidas en el espacio seleccionado.
   * @param event Información del espacio seleccionado
   */
  onChangeEspacio(event: any) {
    const espacio = Number(event.target.value);
    if (espacio) {
      const res = this.espacios.find(esp => esp.id === espacio);
      this.cantidadMaxima = res.capacidad;
      const precio = this.obtenerPrecioConDescuento(espacio);
      this.formEditar.controls['precio'].setValue(precio);
    }
  }

  /**
   * Se agregan validaciones para el carnet estudiantil
   */
  agregarValidaciones() {
    this.formEditar.controls['nombreDocente'].setValidators([Validators.required]);
    this.formEditar.controls['programa'].setValidators([Validators.required]);
  }

  /**
   * Se quitan las validaciones para los docentes
   */
  quitarValidaciones() {
    this.formEditar.controls['nombreDocente'].setValidators(null);
    this.formEditar.controls['programa'].setValidators(null);
  }

  /**
     * Obtener las tasks aprobadas
     */
  obtenerReservasAprobadas(id: number) {
    /*  this.tasksSrv.get().subscribe((resp: any) => {
       this.spinner();
       if (resp.success) {
         this.reservasAprobadas = resp.response.filter((reserva: { estado: string; id: number }) => 
           reserva.estado === "aprobado" && reserva.id !== id
         );
         
       } else {
         Swal.fire({
           icon: 'error',
           title: 'Error',
           text: resp.errors,
           showConfirmButton: false,
           timer: 1500
         });
       }
     }); */
  }

  /**
   * Verifica la disponibilidad del espacio
   * @param nuevaReserva Reserva a verificar
   * @returns Si hay disponibilidad en el espacio seleccionado
   */
  disponibilidadReserva(nuevaReserva: any) {
    if (!this.reservasAprobadas || this.reservasAprobadas.length === 0) {
      return true;
    }
    return !this.reservasAprobadas.some(reserva => {
      return reserva.id === "aprobado" &&
        reserva.espacioId === nuevaReserva.espacioId &&
        this.solapaHorario(reserva, nuevaReserva);
    });
  }

  /**
   * Verifica si la nueva reserva se solapa con una reserva existente.
   * @param reservaExistente Reserva existente
   * @param nuevaReserva Nuevo reserva
   * @returns Si la nueva reserva se solapa con una reserva existente
   */
  solapaHorario(reservaExistente: any, nuevaReserva: any) {
    const inicioExistente = new Date(reservaExistente.fechaInicio + 'T' + reservaExistente.horaInicio);
    const finExistente = new Date(reservaExistente.fechaFin + 'T' + reservaExistente.horaFin);
    const inicioNueva = new Date(nuevaReserva.fechaInicio + 'T' + nuevaReserva.horaInicio);
    const finNueva = new Date(nuevaReserva.fechaFin + 'T' + nuevaReserva.horaFin);
    return inicioNueva < finExistente && finNueva > inicioExistente;
  }


  obtenerPrecioConDescuento(id: number): number {
    const precioBase = this.espacios.find(e => e.id === id)?.precio || 0;
    const tipoDocumentoId = Number(this.formEditar.value.tipoDocumento);
    const idCarnetEstudiantil = 3;
    const idCarnetDocente = 4;
    const idCarnetAdministrativo = 5;

    let descuento = 0;
    /*   if (tipoDocumentoId === idCarnetEstudiantil || tipoDocumentoId === idCarnetDocente || tipoDocumentoId === idCarnetAdministrativo) {
        descuento = this.descuentos[id]?.descuentoInterno || 0;
      } else {
        descuento = this.descuentos[id]?.descuentoExterno || 0;
      } */

    const precioConDescuento = precioBase - descuento;
    return precioConDescuento;
  }

  /**
  * Edita la información de la reserva si el formulario es válido.
  * @returns 
  */
  editarReserva() {

    if (this.formEditar.valid) {
      this.spinnerModal();
      Swal.fire({
        title: 'Advertencia',
        text: '¿Estás seguro de editar esta reserva?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#59ac9c',
        cancelButtonColor: '#bab2b0',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result: any) => {
        if (result.isConfirmed) {
          const id = this.formEditar.value.id;
          if (this.disponibilidadReserva(this.formEditar.value)) {
            const data: any = {
              fechaInicio: this.formEditar.value.fechaInicio,
              fechaFin: this.formEditar.value.fechaFin,
              horaInicio: this.formEditar.value.horaInicio,
              horaFin: this.formEditar.value.horaFin,
              descripcion: this.formEditar.value.descripcion,
              estado: "pendiente",
              tipoEvento: this.formEditar.value.tipoEvento,
              precio: this.obtenerPrecioConDescuento(id),
              cantidad: this.formEditar.value.cantidad,
              espacioId: this.formEditar.value.espacioId,
              documento: this.formEditar.value.documento,
              tipoDocumento: this.formEditar.value.tipoDocumento,
              nombre: this.formEditar.value.nombres,
              apellidos: this.formEditar.value.apellidos,
              email: this.formEditar.value.email,
              telefono: this.formEditar.value.telefono,
              nombreDocente: this.formEditar.value.nombreDocente,
              programa: this.formEditar.value.programa,
              comentarios: ''
            }
            this.tasksSrv.createTask(data).subscribe((resp: any) => {
              if (resp.success) {
                this.spinnerModal();
                Swal.fire({
                  icon: 'success',
                  title: 'OK',
                  text: 'Información actualizada correctamente',
                  showConfirmButton: false,
                  timer: 1500
                });
                const closeModalButton = document.getElementById('btnCloseModalEdit');
                if (closeModalButton) {
                  this.ngOnInit();
                  closeModalButton.click();
                }
              }
              else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: resp.errors,
                  showConfirmButton: false,
                  timer: 1500
                });
              }

            })
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'El espacio no está disponible en el horario seleccionado.',
              showConfirmButton: true
            });
          }

        }
      });
    }
    else {
      return;
    }
  }

  /**
   * Obtiene el nombre del espacio físico reservado mediante el id del espacio.
   * @param idEspacio Identificador del espacio físico
   * @returns Nombre del espacio
   */
  public obtenerNombreEspacio(idEspacio: string): string | undefined {
    const res = this.espacios.find(oc => oc.id === idEspacio);
    return res ? res.nombre : undefined;
  }





  /* Verifica si un campo específico del formulario de reserva es inválido.
   * @param campo El nombre del campo a verificar.
   * @returns `true` si el campo está vacío o es nulo y el formulario ha sido enviado, de lo contrario `false`.
   */
  public invalidField = (campo: string): boolean => {
    const control = this.formEditar.get(campo);
    return control !== null && control.invalid && (control.dirty || control.touched);
  }

  /**
   * Validador personalizado para verificar que la fecha de inicio sea menor a la fecha de fin.
   */
  dateRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDate = control.get('fechaInicio')?.value;
      const endDate = control.get('fechaFin')?.value;
      if (!startDate || !endDate) {
        return null;
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
      if (diff > 2) {
        return { 'dateRangeInvalid': true };
      }
      return null;
    };
  }

  /**
   * Validador personalizado para verificar que la hora de inicio y fin estén en el rango permitido.
   */
  timeRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const time = control.value;
      if (!time) {
        return null;
      }

      const hour = parseInt(time.split(':')[0], 10);
      if (hour < 8 || hour > 18) {
        return { 'timeRangeInvalid': true };
      }

      return null;
    };
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
      $('#updateModal').children('.modal-body').toggleClass('sk-loading');
    })
  }


}
