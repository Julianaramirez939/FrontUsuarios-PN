import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../../../global';

@Injectable({
  providedIn: 'root',
})
export class PermisoService {
  private readonly endpoint = `${API_URL}/api/permissions`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  listarPermisos(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('⛔ No se puede usar sessionStorage fuera del navegador');
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
        console.error('❌ Error al obtener permisos:', error);
        const mensaje = error?.error?.message || 'Error al obtener permisos';
        return throwError(() => new Error(mensaje));
      })
    );
  }
}
