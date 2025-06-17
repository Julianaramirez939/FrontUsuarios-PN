import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { DashboardRolComponent } from './components/dashboard-rol/dashboard-rol.component'; // importa el componente hijo

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar', component: RecuperarContrasenaComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'roles', component: DashboardRolComponent }
      // Puedes agregar más hijos aquí si lo necesitas
    ]
  },

  { path: '**', redirectTo: '' }
];
