import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, isAuthGuard } from 'src/app/guards/auth.guard';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { ProfileComponent } from 'src/app/pages/profile/profile.component';
import { SignupComponent } from 'src/app/pages/signup/signup.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DocsComponent } from './pages/docs/docs.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    title: 'Home',
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    canActivate: [isAuthGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Sign up',
    canActivate: [isAuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Profile',
    canActivate: [authGuard],
  },
  {
    path: 'docs',
    component: DocsComponent,
    title: 'Documentation',
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Not Found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
