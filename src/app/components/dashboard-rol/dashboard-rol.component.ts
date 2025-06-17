import { Component, OnInit } from '@angular/core';
import { RolService } from '../../services/rol.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-rol',
  imports: [CommonModule],
  templateUrl: './dashboard-rol.component.html',
  styleUrl: './dashboard-rol.component.css',
})
export class DashboardRolComponent implements OnInit {
  roles: any[] = [];
  selectedPermissions: any[] = [];
  selectedRoleName: string = '';
  showModal: boolean = false;
  rolMostrado: any = null;


  constructor(private rolService: RolService) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.rolService.listarRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Error al cargar roles:', err.message);
      },
    });
  }

  mostrarPermisos(role: any): void {
    this.selectedPermissions = role.permissions;
    this.selectedRoleName = role.name;
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
  }
  toggleDetalles(rol: any): void {
  this.rolMostrado = this.rolMostrado === rol ? null : rol;
}

}
