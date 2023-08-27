import { Injectable } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { LoginResponse } from 'src/app/interfaces/login-response';
import { NewUser } from 'src/app/interfaces/new-user';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const data = {
      username: username,
      password: password,
    };

    return this.http.post<LoginResponse>(environment.apiUrl + '/login', data);
  }

  signUp(newUser: NewUser) {
    return this.http.post(environment.apiUrl + '/user', newUser);
  }

  logout(): void {
    localStorage.removeItem('login-token');
    localStorage.removeItem('refresh-token');
    localStorage.removeItem('guest-login');

    this.router.navigate(['/login']);
  }

  loggedIn(): boolean {
    return !!localStorage.getItem('login-token') || this.isGuest();
  }

  refreshToken() {
    return this.http.post<{ access_token: string; refresh_token: string }>(
      environment.apiUrl + '/refresh',
      {
        refresh_token: localStorage.getItem('refresh-token'),
      }
    );
  }

  updateAccount(
    username: string | undefined,
    email: string | undefined,
    password: string | undefined,
    confirm_password: string | undefined
  ) {
    let data: any = {};
    if (username) data.username = username;
    if (email) data.email = email;
    if (password) data.password = password;
    if (confirm_password) data.confirm_password = confirm_password;

    return this.http.put<{ access_token: string; refresh_token: string }>(
      environment.apiUrl + '/user',
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('login-token')}`,
        },
      }
    );
  }

  getUsername(): string | undefined {
    if (this.isGuest()) return 'Guest';

    const access_token = localStorage.getItem('login-token');
    if (!access_token) {
      this.logout();
      return;
    }

    try {
      const payload: { username: string; email: string; id: string } =
        jwtDecode(access_token);
      return payload.username;
    } catch (error) {
      this.logout();
      return;
    }
  }

  deleteAccount() {
    return this.http.delete(environment.apiUrl + '/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('login-token')}`,
      },
    });
  }

  updateAccessToken(accessToken: string, refreshToke: string): void {
    localStorage.setItem('login-token', accessToken);
    localStorage.setItem('refresh-token', refreshToke);
  }

  enterAsGuest() {
    localStorage.setItem('guest-login', 'Guest');
    this.router.navigate(['/']);
  }

  isGuest(): boolean {
    return localStorage.getItem('guest-login') === null ? false : true;
  }
}
