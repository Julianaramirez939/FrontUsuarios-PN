import { Routes } from '@angular/router';
import { LoginComponent } from '../app/components/login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Ruta raíz
  { path: '**', redirectTo: '' }, // Redirección en caso de rutas no válidas
];
