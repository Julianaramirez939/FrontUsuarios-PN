import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../../../global';
import { CrearRol } from '../../app/interfaces/crear-rol';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private readonly endpoint = `${API_URL}/api/roles`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  listarRoles(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('No disponible en este entorno'));
    }

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
        const mensaje = error?.error?.message || 'Error al obtener roles';
        return throwError(() => new Error(mensaje));
      })
    );
  }

  crearRol(rol: CrearRol): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('No disponible en este entorno'));
    }

    const token = sessionStorage.getItem('token');

    if (!token) {
      console.error('⚠️ No hay token en sessionStorage');
      return throwError(() => new Error('Token no disponible'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(this.endpoint, rol, { headers }).pipe(
      catchError((error) => {
        console.error('❌ Error al crear el rol:', error);
        const mensaje = error?.error?.message || 'Error al crear rol';
        return throwError(() => new Error(mensaje));
      })
    );
  }
  eliminarRol(id: string): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('No disponible en este entorno'));
    }

    const token = sessionStorage.getItem('token');

    if (!token) {
      console.error('⚠️ No hay token en sessionStorage');
      return throwError(() => new Error('Token no disponible'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.endpoint}/${id}`;

    return this.http.delete(url, { headers }).pipe(
      catchError((error) => {
        console.error('❌ Error al eliminar el rol:', error);
        const mensaje = error?.error?.message || 'Error al eliminar rol';
        return throwError(() => new Error(mensaje));
      })
    );
  }
}
