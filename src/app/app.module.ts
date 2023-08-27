import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  RECAPTCHA_SETTINGS,
  RecaptchaFormsModule,
  RecaptchaModule,
  RecaptchaSettings,
} from 'ng-recaptcha';

import { environment } from 'src/app/environments/environment';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TaskComponent } from './components/task/task.component';
import { NgxMasonryModule } from 'ngx-masonry';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DocsComponent } from './pages/docs/docs.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    NavbarComponent,
    TaskComponent,
    NotFoundComponent,
    DocsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    ReactiveFormsModule,
    NgxMasonryModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.reCaptchaSiteSecret,
      } as RecaptchaSettings,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
