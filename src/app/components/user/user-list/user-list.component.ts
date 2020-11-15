import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IUser } from 'src/app/entities/user/user.model';
import { UserService } from 'src/app/entities/user/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnChanges {

  users: Array<IUser> = [];
  @Input() userToDisplay: IUser = null;

  constructor(protected userService: UserService) { }

  // Load all the products when starting the view.
  ngOnInit(): void {
    console.log('initializing User List!');
    this.loadAll();
  }

  // If new product created, we add it to the list.
  ngOnChanges(): void {
    if (this.userToDisplay !== null) {
      this.users.push(this.userToDisplay);
    }
  }

  // Delete a product.
  delete(id: string) {
    this.userService.delete(id).then((result: any) => this.loadAll());
  }

  // Load all products.
  private loadAll() {
    this.userService
      .get()
      .then((result: Array<IUser>) => {
        this.users = result;
        console.log('Got Users: ',result);
      });
  }
}