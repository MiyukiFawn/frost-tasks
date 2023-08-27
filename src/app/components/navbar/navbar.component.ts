import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  faBars,
  faCheck,
  faList,
  faUser,
  faHome,
  faArrowRightFromBracket,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  faBars = faBars;
  faCheck = faCheck;
  faList = faList;
  faUser = faUser;
  faHome = faHome;
  faArrowRightFromBracket = faArrowRightFromBracket;
  faGear = faGear;

  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
  }
}
