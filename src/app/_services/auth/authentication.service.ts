import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from 'src/app/entities/user/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<IUser>;
  public currentUser: Observable<IUser>;

  @Output() userLogin = new EventEmitter<IUser>();
  @Output() userType = new EventEmitter<string>();

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
   }

   public get currentUserValue(): IUser {
     return this.currentUserSubject.value;
   }

   /// Login using the user credentials. Using the credentials, the user is authenticated and returned if match.
   login(username, password, type) {
     return this.http.post<any>('/api/users/authenticate', {username, password, type})
     .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
     }));
   }

   /// Removes currentUser from localStorage and sets current user to null
   logout() {
     localStorage.removeItem('currentUser');
     this.currentUserSubject.next(null);
     this.userLogin.emit(null);
   }
}