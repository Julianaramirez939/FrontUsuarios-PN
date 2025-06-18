import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { RolService } from '../../services/rol.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CrearUsuario } from '../../interfaces/crear-usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './dashboard-usuario.component.html',
  styleUrls: ['./dashboard-usuario.component.css'],
})
export class DashboardUsuarioComponent implements OnInit {
  usuarios: any[] = [];
  rolesDisponibles: any[] = [];
  usuarioMostrado: any = null;

  showCrearModal = false;
  showEditarModal = false;

  usuarioEditando: any = null;
  formularioUsuario!: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  toggleDetalles(usuario: any): void {
    this.usuarioMostrado = this.usuarioMostrado === usuario ? null : usuario;
  }

  inicializarFormulario(isEdicion: boolean = false): void {
    const group: any = {
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(25),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[\w.-]+@(cue\.edu\.co|unihumboldt\.co)$/),
        ],
      ],
      roleId: ['', Validators.required],
    };

    if (!isEdicion) {
      group.password = [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
          ),
        ],
      ];
    }

    this.formularioUsuario = this.fb.group(group);
  }

  cargarUsuarios(): void {
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => (this.usuarios = data),
      error: (err) => {
        console.error('Error al cargar usuarios:', err.message);
        Swal.fire('Error', 'No se pudieron cargar los usuarios.', 'error');
      },
    });
  }

  cargarRoles(): void {
    this.rolService.listarRoles().subscribe({
      next: (data) => {
        this.rolesDisponibles = data.map((rol: any) => ({
          id: rol.id,
          name: rol.name,
        }));
      },
      error: (err) => {
        console.error('Error al cargar roles:', err.message);
        Swal.fire('Error', 'No se pudieron cargar los roles.', 'error');
      },
    });
  }

  abrirModalCrear(): void {
    this.inicializarFormulario(false);
    this.showCrearModal = true;
  }

  cerrarModalCrear(): void {
    this.showCrearModal = false;
    this.formularioUsuario.reset();
  }

  abrirModalEditar(usuario: any): void {
    this.usuarioEditando = { ...usuario };
    this.inicializarFormulario(true);

    this.formularioUsuario.patchValue({
      username: usuario.username,
      email: usuario.email,
      roleId: usuario.role?.id,
    });

    this.showEditarModal = true;
  }

  cerrarModalEditar(): void {
    this.showEditarModal = false;
    this.usuarioEditando = null;
    this.formularioUsuario.reset();
  }

  guardarNuevoUsuario(): void {
    if (this.formularioUsuario.invalid) {
      this.formularioUsuario.markAllAsTouched();
      Swal.fire('Formulario incompleto', 'Corrige los errores.', 'warning');
      return;
    }

    const nuevoUsuario: CrearUsuario = this.formularioUsuario.value;

    this.usuarioService.crearUsuario(nuevoUsuario).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado exitosamente',
          showConfirmButton: false,
          timer: 1500,
        });
        this.cerrarModalCrear();
        this.cargarUsuarios();
      },
      error: (erroresBackend: string[]) => {
        this.procesarErrores(erroresBackend);
      },
    });
  }

  guardarUsuarioEditado(): void {
    if (this.formularioUsuario.invalid) {
      this.formularioUsuario.markAllAsTouched();
      Swal.fire('Formulario incompleto', 'Corrige los errores.', 'warning');
      return;
    }

    const valoresFormulario = this.formularioUsuario.value;
    const datosActualizados: any = {};

    if (valoresFormulario.username !== this.usuarioEditando.username) {
      datosActualizados.username = valoresFormulario.username;
    }

    if (valoresFormulario.email !== this.usuarioEditando.email) {
      datosActualizados.email = valoresFormulario.email;
    }

    if (valoresFormulario.roleId !== this.usuarioEditando.role?.id) {
      datosActualizados.roleId = valoresFormulario.roleId;
    }

    if (Object.keys(datosActualizados).length === 0) {
      Swal.fire('Sin cambios', 'No realizaste modificaciones.', 'info');
      return;
    }

    this.usuarioService
      .actualizarUsuario(this.usuarioEditando.id, datosActualizados)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario actualizado',
            showConfirmButton: false,
            timer: 1500,
          });
          this.cerrarModalEditar();
          this.cargarUsuarios();
        },
        error: (erroresBackend: string[]) => {
          this.procesarErrores(erroresBackend);
        },
      });
  }

  eliminarUsuario(id: string, nombre: string): void {
    Swal.fire({
      title: `¿Eliminar usuario "${nombre}"?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e74c3c',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El usuario fue eliminado.',
              confirmButtonColor: '#2c3e50',
            });
            this.cargarUsuarios();
          },
          error: (err) => {
            Swal.fire('Error', err.message || 'No se pudo eliminar.', 'error');
          },
        });
      }
    });
  }

  private procesarErrores(erroresBackend: string[]): void {
    ['username', 'email'].forEach((campo) => {
      const control = this.formularioUsuario.get(campo);
      if (control?.hasError('duplicado')) {
        const errores = { ...control.errors };
        delete errores['duplicado'];
        control.setErrors(Object.keys(errores).length ? errores : null);
      }
    });

    const mensajes: string[] = [];

    erroresBackend?.forEach((mensaje: string) => {
      const lower = mensaje.toLowerCase();
      if (lower.includes('username')) {
        this.formularioUsuario.get('username')?.setErrors({ duplicado: true });
        mensajes.push('El nombre de usuario ya está en uso.');
      } else if (lower.includes('email')) {
        this.formularioUsuario.get('email')?.setErrors({ duplicado: true });
        mensajes.push('Este correo ya está en uso.');
      } else {
        mensajes.push(mensaje);
      }
    });

    Swal.fire({
      icon: 'error',
      title: 'Error',
      html: mensajes.join('<br>'),
    });
  }
}
