import { Component, OnInit } from '@angular/core';
import { RolService } from '../../services/rol.service';
import { PermisoService } from '../../services/permisos.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CrearRol } from '../../interfaces/crear-rol';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-rol',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './dashboard-rol.component.html',
  styleUrl: './dashboard-rol.component.css',
})
export class DashboardRolComponent implements OnInit {
  roles: any[] = [];
  permisosDisponibles: any[] = [];

  selectedPermissions: any[] = [];
  selectedRoleName: string = '';
  showModalPermisos: boolean = false;
  showCrearModal: boolean = false;
  rolMostrado: any = null;

  nuevoRol: CrearRol = {
    name: '',
    description: '',
    permissionIds: [],
  };

  constructor(
    private rolService: RolService,
    private permisoService: PermisoService
  ) {}

  ngOnInit(): void {
    this.cargarRoles();
    this.cargarPermisos();
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

  cargarPermisos(): void {
    this.permisoService.listarPermisos().subscribe({
      next: (data) => {
        console.log('📥 Permisos recibidos:', data);

        // Mapear los permisos para que tengan una propiedad _id usada en ng-select
        this.permisosDisponibles = data.map((permiso: any) => ({
          ...permiso,
          _id: permiso.id, // <-- clave para que ng-select lo reconozca
        }));

        console.log('✅ Permisos mapeados:', this.permisosDisponibles);
      },
      error: (err) => {
        console.error('❌ Error al cargar permisos:', err.message);
      },
    });
  }

  mostrarPermisos(role: any): void {
    this.selectedPermissions = role.permissions;
    this.selectedRoleName = role.name;
    this.showModalPermisos = true;
  }

  cerrarModalPermisos(): void {
    this.showModalPermisos = false;
  }

  toggleDetalles(rol: any): void {
    this.rolMostrado = this.rolMostrado === rol ? null : rol;
  }

  abrirModalCrear(): void {
    this.showCrearModal = true;
  }

  cerrarModalCrear(): void {
    this.showCrearModal = false;
    this.nuevoRol = {
      name: '',
      description: '',
      permissionIds: [],
    };
  }

  guardarNuevoRol(): void {
    // Validar que los campos no estén vacíos
    if (
      !this.nuevoRol.name.trim() ||
      !this.nuevoRol.description.trim() ||
      this.nuevoRol.permissionIds.length === 0
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Datos incompletos',
        text: 'Por favor completa todos los campos antes de guardar.',
        confirmButtonText: 'Entendido',
      });
      return; // Detiene el proceso si hay campos vacíos
    }

    // Si pasa la validación, se crea el rol
    this.rolService.crearRol(this.nuevoRol).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Rol creado exitosamente',
          showConfirmButton: false,
          timer: 1500,
        });

        this.cerrarModalCrear();
        this.cargarRoles();
      },
      error: (err) => {
        console.error('Error al crear rol:', err.message);
      },
    });
  }
  eliminarRol(id: string, nombre: string): void {
    Swal.fire({
      title: `¿Eliminar rol "${nombre}"?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e74c3c',
    }).then((result) => {
      if (result.isConfirmed) {
        this.rolService.eliminarRol(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado',
              'El rol fue eliminado correctamente.',
              'success'
            );
            this.cargarRoles();
          },
          error: (err) => {
            Swal.fire('Error', err.message, 'error');
          },
        });
      }
    });
  }
}
