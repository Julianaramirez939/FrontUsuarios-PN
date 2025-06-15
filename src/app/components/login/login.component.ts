import { Component } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  NonNullableFormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  formularioLogin: FormGroup;
  mostrarContrasena: boolean = false;

  errores = {
    username: '',
    password: ''
  };

  constructor(
    private fb: NonNullableFormBuilder,
    private servicioLogin: LoginService,
    private enrutador: Router
  ) {
    this.formularioLogin = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  alternarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  enviarFormulario(): void {
    this.errores = { username: '', password: '' };

    const { username, password } = this.formularioLogin.getRawValue();

    // Validación manual antes de enviar
    if (!username.trim()) this.errores.username = 'El usuario es obligatorio';
    if (!password.trim()) this.errores.password = 'La contraseña es obligatoria';

    if (this.errores.username || this.errores.password) return;

    // Llamada al servicio
    this.servicioLogin.iniciarSesion({ username, password }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          timer: 2000,
          showConfirmButton: false,
        });
        setTimeout(() => this.enrutador.navigate(['/Dashboard']), 2000);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: 'El usuario o la contraseña no coinciden',
        });
      },
    });
  }

  irARegistro(): void {
    this.enrutador.navigate(['/registro']);
  }
}
