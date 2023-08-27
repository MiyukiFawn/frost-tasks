import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatch(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let pass = control.get('password')?.value;
    let confirmPass = control.get('confirm_password')?.value;

    return pass === confirmPass ? null : { passwordDontMatch: true };
  };
}
