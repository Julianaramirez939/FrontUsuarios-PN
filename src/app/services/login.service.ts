import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from '../../../global';
import { CredencialesLogin } from '../../app/interfaces/credenciales-login';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly endpoint = `${API_URL}/auth/login`;

  constructor(private http: HttpClient) {}

  iniciarSesion(credenciales: CredencialesLogin): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(this.endpoint, credenciales, { headers }).pipe(
      tap((respuesta) => {
        if (respuesta?.token) {
          sessionStorage.setItem('token', respuesta.token);
        }
      }),
      catchError((error) => {
        const mensaje = error?.error?.message || 'No se pudo iniciar sesión';
        return throwError(() => new Error(mensaje));
      })
    );
  }
}
