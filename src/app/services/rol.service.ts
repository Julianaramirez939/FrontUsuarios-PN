import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../../../global';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private readonly endpoint = `${API_URL}/api/roles`;

  constructor(private http: HttpClient) {}

  listarRoles(): Observable<any> {
    const token = sessionStorage.getItem('token');

    if (!token) {
      console.error('⚠️ No hay token en sessionStorage');
      return throwError(() => new Error('Token no disponible'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(this.endpoint, { headers }).pipe(
      catchError((error) => {
        console.error('❌ Error al hacer la solicitud HTTP:', error);
        const mensaje = error?.error?.message || 'Error al obtener roles';
        return throwError(() => new Error(mensaje));
      })
    );
  }
}
