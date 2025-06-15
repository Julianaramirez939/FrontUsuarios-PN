import { Routes } from '@angular/router';
import { LoginComponent } from '../app/components/login/login.component';
import { RegistroComponent } from '../app/components/registro/registro.component'; // Asegúrate de que la ruta sea correcta

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Ruta raíz
  { path: 'registro', component: RegistroComponent }, // Nueva ruta para registro
  { path: '**', redirectTo: '' }, // Redirección en caso de rutas no válidas
];
