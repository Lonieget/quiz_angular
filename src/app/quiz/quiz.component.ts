import { UserService } from './../@service/user.service';

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiDataService } from '../@service/api-data.service';
import { OptionsList, QuestionVoList } from '../@interface/data';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  imports: [FormsModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent {

  id:string | null = null;

  name!:string;
  age!:number;
  email!:string;
  phone!:string;
  gender!:string;




  optionList: OptionsList[] = [];
  questionVoList: QuestionVoList[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private apiDataService: ApiDataService, private userService: UserService) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      console.log('動態 ID:', this.id);
      this.apiDataService.questionList(Number(this.id)).subscribe((res) => {
        console.log(res);
        for (let i = 0; i < res.questionVoList.length; i++) {
          this.optionList = res.questionVoList[i].optionsList;
          console.log(this.optionList);
        }
        this.questionVoList = res.questionVoList;
        console.log(this.questionVoList);
      });
    });
  }

  ngOnInit(): void {
    this.name = this.userService.name;
    this.age = this.userService.age;
    this.email = this.userService.email;
    this.phone = this.userService.phone;
    this.gender = this.userService.gender;
  }
  onBack() {
    window.history.back();
  }
  sendOut(){

  }
}
