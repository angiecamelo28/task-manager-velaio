import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Task } from '../core/models/model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = environment.base_url;

  constructor(private http: HttpClient) { }

  /**
   * Método para obtener todas las tareas
   */
  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  /**
   * Método para crear una nueva tarea (en caso de que la API lo permita)
   * @param task Información de la tarea a crear
   */
  createTask(task: Task): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, task);
  }

  /**
   * Método para marcar una tarea como completada
   * @param id 
   * @param task 
   */
  updateTask(id: number, task: Task): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, task);
  }
}
