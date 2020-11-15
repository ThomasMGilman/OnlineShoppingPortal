import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EUserType, IUser } from 'src/app/entities/user/user.model';
import { AuthenticationService } from 'src/app/_services/auth/authentication.service';

@Component({
  selector: 'app-user-logout',
  templateUrl: './user-logout.component.html',
  styleUrls: ['./user-logout.component.css']
})
export class UserLogoutComponent implements OnInit {
  returnUrl: string;

  @Output() userLogin = new EventEmitter<IUser>();
  @Output() userType = new EventEmitter<string>();

  constructor(
    protected authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,) {
    if(this.authService.currentUserValue === null){
      this.router.navigate(['/']);
    }
   }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(logout: boolean) {
    console.log('logging out: ', logout);
    if(logout){
      this.authService.logout();
      this.userLogin.emit(null);
      this.userType.emit(null);
      this.router.navigate(['/']);
    } else {
      this.router.navigate([this.returnUrl]);
    }
  }
}
