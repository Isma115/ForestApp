import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ErrorAuth } from '../../core/usuario.model';
import { camposIguales, passwordSegura } from '../../core/validadores';

type Campo = 'nombre' | 'email' | 'password' | 'confirmarPassword';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: '../../../styles/pages/auth.scss',
})
export class Registro {
  private readonly auth = inject(AuthService);

  protected readonly formulario = inject(NonNullableFormBuilder).group(
    {
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
      password: ['', [Validators.required, Validators.maxLength(128), passwordSegura]],
      confirmarPassword: ['', Validators.required],
    },
    // Validador del grupo entero: necesita ver dos campos a la vez
    { validators: camposIguales('password', 'confirmarPassword') },
  );

  protected readonly enviando = signal(false);
  protected readonly error = signal<ErrorAuth | null>(null);
  /** Mensaje de la API tras registrarse; mientras sea null se muestra el formulario. */
  protected readonly confirmacion = signal<string | null>(null);

  /** Todos los mensajes de validación que haya devuelto el backend (respuesta 400). */
  protected readonly erroresServidor = computed(() => Object.values(this.error()?.errores ?? {}).flat());

  protected campoInvalido(nombre: Campo): boolean {
    const control = this.formulario.controls[nombre];
    return control.invalid && control.touched;
  }

  protected noCoinciden(): boolean {
    return this.formulario.hasError('noCoinciden') && this.formulario.controls.confirmarPassword.touched;
  }

  protected async enviar(): Promise<void> {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.error.set(null);

    try {
      this.confirmacion.set(await this.auth.registrar(this.formulario.getRawValue()));
      this.formulario.reset();
    } catch (error) {
      this.error.set(error as ErrorAuth);
    } finally {
      this.enviando.set(false);
    }
  }
}
