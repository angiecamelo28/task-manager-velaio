import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor() { }

    public error(message: string, title?: string) {
        Swal.fire({
            title: title || 'Oops...',
            text: message,
            icon: 'error',
            toast: true,
            position: 'top-end',
            background: '#fbf2ef',
            color: 'black',
            showConfirmButton: false,
            timer: 5000
        });
    }

    public success(message: string) {
        Swal.fire({
            title: 'OK',
            text: message,
            icon: 'success',
            toast: true,
            position: 'top-end',
            background: '#eef3ff',
            color: 'black',
            showConfirmButton: false,
            timer: 5000
        });
    }

    public warning(message: string) {
        Swal.fire({
            title: 'Advertencia',
            text: message,
            icon: 'warning',
            toast: true,
            position: 'top-end',
            background: '#fef5e5',
            color: 'black',
            showConfirmButton: false,
            timer: 5000
        });
    }

    public info(message: string) {
        Swal.fire({
            title: 'Información',
            text: message,
            icon: 'info',
            toast: true,
            position: 'top-end',
            background: '#d1ebff',
            color: 'black',
            showConfirmButton: false,
            timer: 4000
        });
    }
}
