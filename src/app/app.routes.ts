import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { DashboardRolComponent } from './components/dashboard-rol/dashboard-rol.component';
import { AuthGuard } from './guards/auth.guard'; 
import { DashboardUsuarioComponent } from './components/dashboard-usuario/dashboard-usuario.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar', component: RecuperarContrasenaComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], // 👈 protege esta ruta
    children: [
      { path: 'roles', component: DashboardRolComponent },
      { path: 'usuarios', component: DashboardUsuarioComponent }
    ]
  },

  { path: '**', redirectTo: '' }
];
