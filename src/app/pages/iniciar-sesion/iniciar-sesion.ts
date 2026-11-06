import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ErrorAuth } from '../../core/usuario.model';

@Component({
  selector: 'app-iniciar-sesion',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './iniciar-sesion.html',
  styleUrl: '../../../styles/pages/auth.scss',
})
export class IniciarSesion {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // NonNullableFormBuilder: al hacer reset() los campos vuelven a '' en lugar de a null
  protected readonly formulario = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected readonly enviando = signal(false);
  protected readonly error = signal<ErrorAuth | null>(null);

  /** Muestra el error de un campo solo cuando el usuario ya ha interactuado con él. */
  protected campoInvalido(nombre: 'email' | 'password'): boolean {
    const control = this.formulario.controls[nombre];
    return control.invalid && control.touched;
  }

  protected async enviar(): Promise<void> {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched(); // Enseña todos los errores pendientes
      return;
    }

    this.enviando.set(true);
    this.error.set(null);

    try {
      await this.auth.iniciarSesion(this.formulario.getRawValue());
      await this.router.navigateByUrl('/intranet');
    } catch (error) {
      this.error.set(error as ErrorAuth);
      this.formulario.controls.password.reset(); // Nunca dejar la contraseña escrita tras un fallo
    } finally {
      this.enviando.set(false);
    }
  }
}
