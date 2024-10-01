import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../core/models/model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.base_url;

  constructor(private http: HttpClient) { }

  /**
   * Método para obtener todas los usuarios
   */
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  /**
   * Método para crear un nuevo usuario (en caso de que la API lo permita)
   * @param user Información del usuario a crear
   */
  createUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, user);
  }

  /**
   * Método para marcar una usuario como completada
   * @param id Identificación del usuario
   * @param user Información del usuario a actualizar
   */
  updateUser(id: number, user: User): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, user);
  }

  /**
   * Método para eliminar un usuario
   * @param id Identificación del usuario
   */
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`);
  }
}
