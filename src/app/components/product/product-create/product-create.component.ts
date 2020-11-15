import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductService } from 'src/app/entities/product/product.service';
import { IProduct, Product } from 'src/app/entities/product/product.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {

  productForm: FormGroup;
  Fname: string = '';
  Fbrand: string = '';
  Favailability: number;
  Fprice: number;
  Fimage: string = '';
  FimageDetails: string = '';
  error: boolean =  false;

  @Output() createdProduct = new EventEmitter<IProduct>();

  constructor(protected productService: ProductService, protected formBuilder: FormBuilder) { }

  // Init the form when starting the view.
  ngOnInit(): void {
    this.initForm();
  }

  // Manage the submit action and create the new product.
  onSubmit() {
    const product = new Product(
      this.productForm.value['name'], this.productForm.value['brand'],
      this.productForm.value['availability'], this.productForm.value['price'],
      this.productForm.value['image'], this.productForm.value['imageDetails'],
      null
    );
    this.productService.create(product).then((result: IProduct) => {
      if (result === undefined) {
        this.error = true;
      } else {
        this.error = false;
        this.createdProduct.emit(result);
      }
    });
  }

  // Hide the error message.
  hideError() {
    this.error = false;
  }

  // Init the creation form.
  private initForm() {
    this.productForm = new FormGroup({
      name: new FormControl(this.Fname, Validators.required),
      brand: new FormControl(this.Fbrand, Validators.required),
      availability: new FormControl(this.Favailability, Validators.required),
      price: new FormControl(this.Fprice, Validators.required),
      image: new FormControl(this.Fimage, Validators.required),
      imageDetails: new FormControl(this.FimageDetails, Validators.required)
    });
  }

  //Form Control getters

  get name() { return this.productForm.get('name'); }

  get brand() { return this.productForm.get('brand'); }

  get availability() { return this.productForm.get('availability'); }

  get price() { return this.productForm.get('price'); }

  get image() { return this.productForm.get('image'); }

  get imageDetails() { return this.productForm.get('imageDetails'); }
}
