import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [RouterModule, CommonModule],
})
export class DashboardComponent {
  mostrarMenuUsuario = false;

  constructor(private router: Router) {}

  alternarMenuUsuario(): void {
    this.mostrarMenuUsuario = !this.mostrarMenuUsuario;
  }

  irARuta(ruta: string): void {
    this.router.navigate([`/dashboard/${ruta}`]);
  }
  cerrarSesion(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  get esDashboardPrincipal(): boolean {
    return this.router.url === '/dashboard' || this.router.url === '/';
  }
}
