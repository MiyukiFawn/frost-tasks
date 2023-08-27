import { Component } from '@angular/core';
import { faUser, faLock, faBook } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginResponse } from 'src/app/interfaces/login-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  faUser = faUser;
  faLock = faLock;
  faBook = faBook;

  error: string = '';
  canSubmit: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  loginForm = new FormGroup(
    {
      username: new FormControl(
        '',
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
      password: new FormControl(
        '',
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
    },
    {
      updateOn: 'submit',
    }
  );

  login() {
    this.loginForm.markAllAsTouched();
    if (!this.loginForm.valid) return;

    this.error = '';
    this.canSubmit = false;

    this.authService
      .login(this.loginForm.value.username!, this.loginForm.value.password!)
      .subscribe({
        error: (err: HttpErrorResponse) => this.onLoginError(err),
        next: (data: LoginResponse) => this.onLoginSuccess(data),
      });
  }

  enterAsGuest() {
    this.authService.enterAsGuest();
  }

  onLoginError(err: HttpErrorResponse) {
    switch (err.status) {
      case 404:
        this.error = 'User not found';
        break;

      case 401:
        this.error = 'Incorrect password';
        break;

      default:
        this.error = 'Something went wrong';
        break;
    }

    this.canSubmit = true;
  }

  onLoginSuccess(data: LoginResponse) {
    this.authService.updateAccessToken(data.access_token, data.refresh_token);
    this.router.navigate(['/']);
  }
}
