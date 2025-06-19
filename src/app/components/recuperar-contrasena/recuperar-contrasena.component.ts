import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContrasenaService } from '../../services/contrasena.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css'],
  imports: [FormsModule, CommonModule],
})
export class RecuperarContrasenaComponent {
  correo: string = '';
  errorCorreo: string = '';

  constructor(
    private router: Router,
    private contrasenaService: ContrasenaService
  ) {}

  validarCorreo(): boolean {
    const correoRegex = /^[\w.-]+@(?:cue\.edu\.co|unihumboldt\.co)$/;
    if (!this.correo) {
      this.errorCorreo = 'El correo es obligatorio.';
      return false;
    }
    if (!correoRegex.test(this.correo)) {
      this.errorCorreo =
        'El correo debe tener un formato válido y terminar en @cue.edu.co o @unihumboldt.co';
      return false;
    }
    this.errorCorreo = '';
    return true;
  }
  enviarFormulario() {
    if (!this.validarCorreo()) {
      return;
    }

    this.contrasenaService.olvidarContrasena(this.correo).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Se ha enviado un correo para restablecer tu contraseña.',
          icon: 'success',
          timer: 2500,
          showConfirmButton: false,
        }).then(() => {
          this.router.navigate(['/restablecer-contraseña']);
        });
      },
      error: (err: any) => {
        const mensaje =
          typeof err === 'string'
            ? err
            : err?.error ?? 'Ocurrió un error inesperado';

        Swal.fire('Error', mensaje, 'error');
      },
    });
  }

  volverAlInicio() {
    this.router.navigate(['/']);
  }
}
