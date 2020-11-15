import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface IService<T> {
    get(): Promise<Array<T>>;
    create(obj: T): Promise<T>;
    delete(id: string): Promise<any>;
}


export class Service<T> implements IService<T> {
    protected url: string = '';

    constructor(url: string) {
        this.url = url;
    }

    get(): Promise<T[]> {
        throw new Error('Method not implemented.');
    }
    create(obj: T): Promise<T> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<any> {
        throw new Error('Method not implemented.');
    }

    /**
     * Handle the operation that failed and let the app continue.
     * Referenced from https://angular.io/tutorial/toh-pt6 'src/app/hero.service.ts' tutorial
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    protected obsError<T>(operation = 'operation', result?: T){
        return (error: any): Observable<T> => {
            let message = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
            console.log(message);
            return of(result as T);
        };
    }

    protected promError(error: any): void {
        console.log(error);
        let message = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(message);
    }
}
