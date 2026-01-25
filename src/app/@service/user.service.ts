import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  name!: string;
  phone!: string;
  email!: string;
  age!: number;
  gender!: string;

  online = false;
  constructor() { }

  resetUserInfo() {
    this.name = "";
    this.phone = "";
    this.email = "";
    this.age = 0;
    this.gender = "";
    this.online = false;
  }
}
