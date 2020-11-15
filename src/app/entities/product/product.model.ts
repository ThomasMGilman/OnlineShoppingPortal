export interface IProduct {
    _id?: string;
    name: string;
    brand: string;
    availability: number;
    price: number;
    image: string;
    imageDetails: string;
}

export class Product implements IProduct {
    constructor(
        public name: string,
        public brand: string,
        public availability: number,
        public price: number,
        public image: string,
        public imageDetails: string,
        public _id?: string
    ) {
        this._id = _id ? _id : null;
        this.name = name;
        this.brand = brand;
        this.availability = availability;
        this.price = price;
        this.image = image;
        this.imageDetails = imageDetails;
    }
}
