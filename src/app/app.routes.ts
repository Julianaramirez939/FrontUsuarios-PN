import { Routes } from '@angular/router';
import { LoginComponent } from '../app/components/login/login.component';
import { RegistroComponent } from '../app/components/registro/registro.component'; // Asegúrate de que la ruta sea correcta
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Ruta raíz
  { path: 'registro', component: RegistroComponent }, // Nueva ruta para registro
  { path: 'Dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '' }, // Redirección en caso de rutas no válidas
];
