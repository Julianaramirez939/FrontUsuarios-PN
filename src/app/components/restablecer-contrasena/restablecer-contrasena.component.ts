import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ContrasenaService } from '../../services/contrasena.service';
import { RestablecerContrasena } from '../../interfaces/restablecer-contrasena';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-restablecer-contrasena',
  templateUrl: './restablecer-contrasena.component.html',
  styleUrls: ['./restablecer-contrasena.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class RestablecerContrasenaComponent {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  mostrarPassword: boolean = false;

  errorToken: string = '';
  errorPassword: string = '';
  errorConfirmPassword: string = '';

  constructor(
    private contrasenaService: ContrasenaService,
    public router: Router
  ) {}

  validarFormulario(): boolean {
    let valido = true;

    this.errorToken = '';
    this.errorPassword = '';
    this.errorConfirmPassword = '';

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

    if (!this.token.trim()) {
      this.errorToken = 'El código es obligatorio.';
      valido = false;
    }

    if (!this.newPassword) {
      this.errorPassword = 'La nueva contraseña es obligatoria.';
      valido = false;
    } else if (!passwordRegex.test(this.newPassword)) {
      this.errorPassword =
        'Debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula y 1 caracter especial.';
      valido = false;
    }

    if (!this.confirmPassword) {
      this.errorConfirmPassword = 'Confirma tu contraseña.';
      valido = false;
    } else if (this.newPassword !== this.confirmPassword) {
      this.errorConfirmPassword = 'Las contraseñas no coinciden.';
      valido = false;
    }

    return valido;
  }

  enviarFormulario() {
    if (!this.validarFormulario()) return;

    const datos: RestablecerContrasena = {
      token: this.token,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
    };

    this.contrasenaService.restablecerContrasena(datos).subscribe({
      next: () => {
        Swal.fire(
          '¡Éxito!',
          'Tu contraseña ha sido restablecida.',
          'success'
        ).then(() => {
          this.router.navigate(['/']);
        });
      },
      error: (err: string) => {
        Swal.fire('Error', err, 'error');
      },
    });
  }

  toggleMostrarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
