import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth/auth.service';
import { passwordMatch } from 'src/app/validators/password-match.directive';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  constructor(public authService: AuthService, private router: Router) {}

  faUser = faUser;
  faLock = faLock;
  faEnvelope = faEnvelope;

  canSubmit = true;
  error: string = '';

  updateForm = new FormGroup(
    {
      email: new FormControl<string>(
        '',
        Validators.compose([Validators.minLength(5), Validators.email])
      ),
      username: new FormControl(
        '',
        Validators.compose([Validators.minLength(5)])
      ),
      password: new FormControl(
        '',
        Validators.compose([Validators.minLength(5)])
      ),
      confirm_password: new FormControl(
        '',
        Validators.compose([Validators.minLength(5)])
      ),
    },
    {
      validators: passwordMatch(),
      updateOn: 'submit',
    }
  );

  submitUpdateForm() {
    if (!this.updateForm.valid) return;
    this.canSubmit = false;

    this.authService
      .updateAccount(
        this.updateForm.value.username ?? undefined,
        this.updateForm.value.email ?? undefined,
        this.updateForm.value.password ?? undefined,
        this.updateForm.value.confirm_password ?? undefined
      )
      .subscribe({
        error: (err: HttpErrorResponse) => {
          if (err.status === 401)
            this.authService.refreshToken().subscribe({
              error: () => this.authService.logout(),
              next: (data) => {
                this.authService.updateAccessToken(
                  data.access_token,
                  data.refresh_token
                );
                this.submitUpdateForm();
              },
            });

          if (err.status === 409) this.error = err.error.error;
          if (err.status === 404) this.authService.logout();

          this.canSubmit = true;
        },
        next: (data) => {
          this.authService.updateAccessToken(
            data.access_token,
            data.refresh_token
          );
          this.router.navigate(['/']);
        },
      });
  }

  onDeleteAccount() {
    this.authService.deleteAccount().subscribe({
      error: (err: HttpErrorResponse) => {
        if (err.status === 401)
          this.authService.refreshToken().subscribe({
            error: () => this.authService.logout(),
            next: (data) => {
              this.authService.updateAccessToken(
                data.access_token,
                data.refresh_token
              );
              this.onDeleteAccount();
            },
          });
        if (err.status === 404) this.authService.logout();
      },
      next: () => {
        this.authService.logout();
      },
    });
  }
}
