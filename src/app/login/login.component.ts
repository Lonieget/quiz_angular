import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiDataService } from '../@service/api-data.service';
import { FormsModule } from "@angular/forms";
import { UserService } from '../@service/user.service';
import { DialogComponent } from '../@dialog/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  account!: string;
  passwrod!: string;
  name!: string;
  phone!: string;
  email!: string;
  age!: number;
  gender!: string;
  role!: string;
  registerBut = false;
  constructor(private router: Router, private apiDataService: ApiDataService, private userService: UserService) { }

  ngOnInit() {
    this.userService.resetUserInfo();
  }

  login() {
    if (this.account == undefined || this.passwrod == undefined) {
      this.openDialog("請輸入帳號密碼");
      return;
    }
    this.apiDataService.login(this.account, this.passwrod).subscribe((res: LoginData) => {
      if (res.code == 200) {
        this.openDialog("登入成功")
        console.log(res);
        this.userService.name = res.name;
        this.userService.phone = res.phone;
        this.userService.email = res.email;
        this.userService.age = res.age;
        this.userService.gender = res.gender;
        this.userService.role = res.role;
        if (this.account === 'admin' && this.passwrod === 'admin') {
          this.userService.role = 'ADMIN'; // 硬編碼後門用於展示管理員功能
        }
        this.userService.online = true;
        this.router.navigate(['questionnaire']);
      } else {
        this.openDialog("登入失敗")
      }
    });

  }
  register() {
    if (this.registerBut == true) {
      this.registerBut = false;
      return;
    }
    this.registerBut = true;
  }
  registerUser() {
    // 預設註冊為 USER，如果需要管理員則手動修改資料庫或特殊邏輯
    this.apiDataService.register(this.account, this.passwrod, this.name, this.phone, this.email, this.age, this.gender, this.role).subscribe((res) => {
      if (res.code == 200) {
        this.openDialog("註冊成功，請重新登入");
        console.log(res);
        this.registerBut = false;
      } else {
        this.openDialog("註冊失敗")
      }
    });
  }

  readonly dialog = inject(MatDialog);

  openDialog(message: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: 'auto',
      data: { message: message }
    });
  }
}
export interface LoginData {
  message: string;
  code: number;
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: string;
  role: string;
}