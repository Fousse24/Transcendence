import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services';
import { User } from '../../../user/models';
import { UserService } from '../../../user/services';

import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Input()user!: User | null;

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  handleClick() {
    window.location.href = 'http://localhost:3000/api/auth/ft/login';
    // this.authService.login();
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.authService.getCurrentUser().subscribe({
      next: (user: User | null) => {
        this.user = user;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

}
