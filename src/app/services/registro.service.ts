import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../../../global';
import { DatosRegistro } from '../../app/interfaces/datos-registro';

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  private readonly endpoint = `${API_URL}/auth/register`;

  constructor(private http: HttpClient) {}

  registrarUsuario(datos: DatosRegistro): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(this.endpoint, datos, { headers }).pipe(
      catchError((error) => {
        const errores: string[] = error?.error?.errors || [];
        return throwError(() => errores);
      })
    );
  }
}
