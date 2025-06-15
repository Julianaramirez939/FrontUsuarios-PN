import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-recuperar-contrasena',
  imports: [],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.css'
})
export class RecuperarContrasenaComponent {
  constructor(private router: Router) {}

  enviarFormulario() {
    // Aquí iría la lógica para enviar el correo
    alert('Correo enviado (simulado)');
  }

  volverAlInicio() {
    this.router.navigate(['/']);
  }
}