export enum EUserType {
    ADMIN,
    CUSTOMER
}

export interface IUser {
    _id?: string;
    name: string;
    password: string;
    email: string;
    type: string;
    isActive: boolean;
}

export class User implements IUser {
    constructor(
        public name: string,
        public password: string,
        public email: string,
        public type: string,
        public isActive: boolean,
        public _id?: string
    ) {
        this._id = _id ? _id : null;
        this.name = name;
        this.password = password;
        this.type = type;
        this.isActive = isActive;
    }
}