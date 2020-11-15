import { Component } from '@angular/core';
import { IUser } from './entities/user/user.model';
import { StatusService } from './_services/status/status.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OnlineShoppingPortal';
  status = 'NOT CONNECTED';
  currentUser: IUser = null;

  constructor(protected statusService: StatusService) {}

  isUserNull() {
    return this.currentUser == null;
  }

  ngOnInit(): void {
    this.statusService.getStatus()
    .then((res: any) => {
      this.status = res.status;
      console.log(res);
    });
  }

  onUserLogin(user: IUser) {
    this.currentUser = user;
    console.log(this.currentUser);
  }
}
