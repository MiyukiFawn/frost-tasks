import { Component } from '@angular/core';
import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordMatch } from 'src/app/validators/password-match.directive';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NewUser } from 'src/app/interfaces/new-user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  faUser = faUser;
  faLock = faLock;
  faEnvelope = faEnvelope;

  constructor(private authService: AuthService, private router: Router) {}

  signUpForm = new FormGroup(
    {
      email: new FormControl(
        '',
        Validators.compose([
          Validators.minLength(5),
          Validators.required,
          Validators.email,
        ])
      ),
      username: new FormControl(
        '',
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
      password: new FormControl(
        '',
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
      confirm_password: new FormControl(
        '',
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
      token: new FormControl<string | undefined>(
        undefined,
        Validators.required
      ),
    },
    {
      validators: passwordMatch(),
      updateOn: 'submit',
    }
  );

  canSubmit: boolean = true;
  error: string = '';

  public signUp(): void {
    this.signUpForm.markAllAsTouched();
    if (!this.signUpForm.valid) return;

    this.error = '';
    this.canSubmit = false;

    const newUser: NewUser = {
      email: this.signUpForm.value.email!,
      username: this.signUpForm.value.username!,
      password: this.signUpForm.value.password!,
      confirm_password: this.signUpForm.value.confirm_password!,
      reCaptcha_token: this.signUpForm.value.token!,
    };

    this.authService.signUp(newUser).subscribe({
      error: (err: HttpErrorResponse) => this.onSignUpError(err),
      next: () => this.onSignUpSuccess(),
    });
  }

  onSignUpError(err: HttpErrorResponse) {
    switch (err.status) {
      case 409:
        this.error = 'Username already in use';
        break;

      case 401:
        this.error = 'Unable to validate reCaptcha';
        break;

      case 400:
        this.error = 'Please make sure you typed the informations correctly';
        break;

      default:
        this.error = 'Something went wrong';
        break;
    }

    this.canSubmit = true;
  }

  onSignUpSuccess() {
    this.router.navigate(['/login']);
  }
}
