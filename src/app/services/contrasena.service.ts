import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../../../global';
import { RestablecerContrasena } from '../interfaces/restablecer-contrasena';

@Injectable({
  providedIn: 'root',
})
export class ContrasenaService {
  private readonly forgotPasswordEndpoint = `${API_URL}/auth/forgot-password`;
  private readonly resetPasswordEndpoint = `${API_URL}/auth/reset-password`;

  constructor(private http: HttpClient) {}

  olvidarContrasena(correo: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email: correo };

    return this.http
      .post<any>(this.forgotPasswordEndpoint, body, { headers })
      .pipe(
        catchError((error) => {
          const mensaje: string = error?.error || 'Error desconocido';
          return throwError(() => mensaje);
        })
      );
  }

  restablecerContrasena(data: RestablecerContrasena): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(this.resetPasswordEndpoint, data, { headers })
      .pipe(
        catchError((error) => {
          const mensaje: string =
            error?.error || 'Error al restablecer la contraseña';
          return throwError(() => mensaje);
        })
      );
  }
}
