import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RegistroService } from '../../services/registro.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  formularioRegistro: FormGroup;
  mostrarContrasena = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registroService: RegistroService
  ) {
    this.formularioRegistro = this.fb.group({
      usuario: [
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
          Validators.pattern(/^[\w.-]+@((cue\.edu\.co)|(unihumboldt\.co))$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
          ),
        ],
      ],
    });
  }

  alternarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  enviarFormulario(): void {
    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched();
      return;
    }
    ['usuario', 'email'].forEach((campo) => {
      const control = this.formularioRegistro.get(campo);
      if (control?.hasError('duplicado')) {
        const errores = { ...control.errors };
        delete errores['duplicado'];
        control.setErrors(Object.keys(errores).length ? errores : null);
      }
    });

    const { usuario, email, password } = this.formularioRegistro.value;

    this.registroService
      .registrarUsuario({ username: usuario, email, password })
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: 'Ya puedes iniciar sesión.',
            timer: 2000,
            showConfirmButton: false,
          });
          setTimeout(() => this.router.navigate(['/']), 2000);
        },
        error: (errores: string[]) => {
          if (!Array.isArray(errores) || errores.length === 0) {
            this.mostrarAlertaError({
              title: 'Error inesperado',
              text: 'No se pudo registrar. Intenta nuevamente más tarde.',
            });
            return;
          }

          errores.forEach((mensaje) => {
            const lowerMsg = mensaje.toLowerCase();

            if (lowerMsg.includes('username')) {
              this.formularioRegistro
                .get('usuario')
                ?.setErrors({ duplicado: true });
              this.mostrarAlertaError({
                title: 'Usuario en uso',
                text: 'El nombre de usuario ya está registrado. Prueba con otro.',
              });
            } else if (lowerMsg.includes('email')) {
              this.formularioRegistro
                .get('email')
                ?.setErrors({ duplicado: true });
              this.mostrarAlertaError({
                title: 'Correo ya registrado',
                text: 'Este correo ya está asociado a una cuenta. Usa otro.',
              });
            } else {
              this.mostrarAlertaError({
                title: 'Error en registro',
                text: mensaje,
              });
            }
          });
        },
      });
  }

  mostrarAlertaError(opciones: { title: string; text: string }): void {
    Swal.fire({
      icon: 'error',
      title: opciones.title,
      text: opciones.text,
    });
  }

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }

  obtenerMensajeError(campo: string): string {
    const control = this.formularioRegistro.get(campo);
    if (!control || !control.errors) return '';

    // No mostrar errores de tipo 'duplicado' debajo del input
    if (control.hasError('duplicado')) return '';

    const mensajes: Record<string, Record<string, string>> = {
      usuario: {
        required: 'El usuario es obligatorio',
        minlength: 'Debe tener al menos 5 caracteres',
        maxlength: 'No debe superar los 25 caracteres',
      },
      email: {
        required: 'El correo es obligatorio',
        email: 'El correo no es válido',
        pattern: 'Debe usar @cue.edu.co o @unihumboldt.co',
      },
      password: {
        required: 'La contraseña es obligatoria',
        pattern:
          'Debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial',
      },
    };

    const errorKey = Object.keys(control.errors)[0];
    return mensajes[campo]?.[errorKey] || 'Campo inválido';
  }
}
