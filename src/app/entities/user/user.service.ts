import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { IUser, User } from './user.model';
import { Service } from '../service.model';


/**
 * For referance regarding HttpClient get
 * https://angular.io/tutorial/toh-pt6
 */

@Injectable({
    providedIn: 'root'
})
export class UserService extends Service<IUser> {

    constructor(private http: HttpClient) {
        super('/api/user');
    }

    // Get User
    /* get(): Observable<Array<IUser>> {
        return this.http.get<Array<IUser>>(this.userUrl)
        .pipe(
            catchError(this.obsError('getUsers', []))
        );
    } */

    get(): Promise<Array<IUser>> {
        let promise = this.http.get<Array<IUser>>(this.url)
        .toPromise()
        .then(res => { console.log('Retrieved Users, Response:', res); return res; })
        .catch(super.promError);
        return promise.then();
    }

    create(user: User): Promise<IUser> {
        let promise = this.http.post<IUser>(this.url, user)
        .toPromise()
        .then(res => { console.log('Created User, Response: ', res); return res; })
        .catch(super.promError);
        return promise.then();
    }

    delete(id: string): Promise<any> {
        return this.http.delete(`${this.url}/${id}`)
        .toPromise()
        .then(res => { console.log('Deleted User, Response: ', res); return res; })
        .catch(super.promError);
    }
}