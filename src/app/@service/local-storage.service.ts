import { inject, Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User, userData } from '../@interface/data';
// 定義一個介面來表示我們將儲存的登入資訊

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  // 內部狀態屬性
  private name: string | null = null;
  private role: string | null = null;
  private age: number | null = null;
  private phone: string | null = null;
  private email: string | null = null;
  private gender: string | null = null;

  // 定義用於 localStorage 的鍵名
  private readonly USER_KEY = 'userSession';

  constructor(private router: Router) {
    // 服務初始化時，從 LocalStorage 嘗試還原整個 Session 物件
    const saved = localStorage.getItem(this.USER_KEY);

    if (saved) {
      try {
        // LocalStorage 存的是字串，需要用 JSON.parse() 轉回物件
        const userStory: userData = JSON.parse(saved);

        if (userStory.name && userStory.phone && userStory.role) {
          this.phone = userStory.phone;
          this.role = userStory.role;
          this.name = userStory.name;
          // this.isFullTime = userStory.isFullTime;
        }
      } catch (e) {
        localStorage.removeItem(this.USER_KEY);
      }
    }
  }
  readonly dialog = inject(MatDialog);

  public setUserSession(loginUser: userData): void {
    // 1. 更新內部狀態
    this.name = loginUser.name;
    this.role = loginUser.role;
    this.age = loginUser.age;
    this.phone = loginUser.phone;
    this.email = loginUser.email;
    this.gender = loginUser.gender;


    // 2. 將完整的 Session 物件轉換成字串並寫入 LocalStorage
    localStorage.setItem(this.USER_KEY, JSON.stringify(loginUser));
  }

  /**
   * 取得目前儲存在服務中的完整 Session 物件。
   */
  public getUserSession(): userData | null {
    if (this.name && this.role && this.age && this.phone && this.email && this.gender) {
      return {
        name: this.name,
        role: this.role,
        age: this.age,
        phone: this.phone,
        email: this.email,
        gender: this.gender,
        message: 'Success',
        code: 200
      };
    }
    return null;
  }

  //GET 方法
  public getUserPhone(): string | null {
    return this.phone;
  }
  public getUserRole(): string | null {
    return this.role;
  }
  public getUserName(): string | null {
    return this.name;
  }
  public getUserAge(): number | null {
    return this.age;
  }
  public getUserEmail(): string | null {
    return this.email;
  }
  public getUserGender(): string | null {
    return this.gender;
  }


  //消除登入資訊
  public logout(): void {
    this.age = null;
    this.role = null;
    this.name = null;
    this.phone = null;
    this.email = null;
    this.gender = null;

    localStorage.removeItem(this.USER_KEY);
  }
}
