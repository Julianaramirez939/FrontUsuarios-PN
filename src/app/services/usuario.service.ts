import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../../../global';
import { CrearUsuario } from '../interfaces/crear-usuario'; 

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly endpoint = `${API_URL}/api/users`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token no disponible');
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  listarUsuarios(): Observable<any> {
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

  crearUsuario(usuario: CrearUsuario): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('No disponible en este entorno'));
    }

    try {
      const headers = this.getHeaders();
      return this.http.post(this.endpoint, usuario, { headers }).pipe(
        catchError((error) => {
          const errores: string[] = error?.error?.errors || [];
          return throwError(() => errores);
        })
      );
    } catch (e: any) {
      return throwError(() => e);
    }
  }

  eliminarUsuario(id: string): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('No disponible en este entorno'));
    }

    try {
      const headers = this.getHeaders();
      const url = `${this.endpoint}/${id}`;
      return this.http.delete(url, { headers }).pipe(
        catchError((error) => {
          const errores: string[] = error?.error?.errors || [];
          return throwError(() => errores);
        })
      );
    } catch (e: any) {
      return throwError(() => e);
    }
  }

  actualizarUsuario(id: string, usuario: CrearUsuario): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('No disponible en este entorno'));
    }

    try {
      const headers = this.getHeaders();
      return this.http.put(`${this.endpoint}/${id}`, usuario, { headers }).pipe(
        catchError((error) => {
          const errores: string[] = error?.error?.errors || [];
          return throwError(() => errores);
        })
      );
    } catch (e: any) {
      return throwError(() => e);
    }
  }
}
