import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct, Product } from './product.model';
import { Service } from '../service.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService extends Service<Product> {

    constructor(private http: HttpClient) {
        super('/api/products');
    }

    // Get products
    get(): Promise<Array<IProduct>> {
        let promise = this.http.get<Array<IProduct>>(this.url)
        .toPromise()
        .then(res => {console.log('Retrieved Products', res); return res; })
        .catch(super.promError);
        return promise.then();
    }

    // Create product
    create(product: Product): Promise<IProduct> {
        let promise = this.http.post<IProduct>(this.url, product)
        .toPromise()
        .then(res => {console.log('Created Product, Response: ', res); return res; })
        .catch(super.promError);
        return promise.then();
    }

    // Delete a product
    delete(id: string): Promise<any> {
        return this.http.delete(`${this.url}/${id}`)
        .toPromise()
        .then(res => {console.log('Deleted Product, Response: ', res); return res; })
        .catch(this.promError);
    }
}

