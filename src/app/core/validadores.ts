import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Misma política de contraseñas que el backend (Identity): mínimo 8 caracteres,
 * con al menos una mayúscula, una minúscula y un número.
 * Cada regla incumplida añade su propia clave de error para mostrar un mensaje concreto.
 *
 * IMPORTANTE REVISAR: si cambia la política en AutenticacionServiceCollectionExtensions.cs,
 * hay que cambiarla también aquí. El backend valida siempre; esto solo da avisos más rápidos.
 */
export const passwordSegura: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = String(control.value ?? '');
  if (!valor) {
    return null; // De los campos vacíos se encarga Validators.required
  }

  const errores: ValidationErrors = {};
  if (valor.length < 8) errores['longitud'] = true;
  if (!/[A-Z]/.test(valor)) errores['mayuscula'] = true;
  if (!/[a-z]/.test(valor)) errores['minuscula'] = true;
  if (!/\d/.test(valor)) errores['numero'] = true;

  return Object.keys(errores).length ? errores : null;
};

/**
 * Validador de GRUPO: compara dos controles del mismo FormGroup.
 * Se coloca en el grupo (no en un campo) porque necesita ver los dos valores.
 */
export function camposIguales(campo: string, confirmacion: string): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const a = grupo.get(campo)?.value;
    const b = grupo.get(confirmacion)?.value;
    return a && b && a !== b ? { noCoinciden: true } : null;
  };
}
