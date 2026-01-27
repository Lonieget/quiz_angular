import { UserService } from './../@service/user.service';

import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiDataService } from '../@service/api-data.service';
import { OptionsList, QuestionVoList } from '../@interface/data';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../@dialog/dialog/dialog.component';

@Component({
  selector: 'app-quiz',
  imports: [FormsModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent {

  id: string | null = null;

  name!: string;
  age!: number;
  email!: string;
  phone!: string;
  gender!: string;




  optionList: OptionsList[] = [];
  questionVoList: QuestionVoList[] = [];

  readonly dialog = inject(MatDialog);

  constructor(private route: ActivatedRoute, private router: Router, private apiDataService: ApiDataService, private userService: UserService) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      const quizId = Number(this.id);

      // 先取得問卷基本資訊以檢查日期
      this.apiDataService.getQuiz().subscribe(res => {
        const quizInfo = res.quizList.find(q => q.id === quizId);
        if (quizInfo && this.userService.role !== 'ADMIN') {
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          const start = new Date(quizInfo.startDate);
          const end = new Date(quizInfo.endDate);

          if (now < start || now > end) {
            this.openDialog('存取失敗：目前非該問卷之開放填寫區間。');
            this.router.navigate(['questionnaire']);
            return;
          }
        }
      });

      this.apiDataService.questionList(quizId).subscribe((res) => {
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
    console.log(this.name, this.age, this.email, this.phone, this.gender);

  }
  onBack() {
    window.history.back();
  }

  openDialog(message: string) {
    this.dialog.open(DialogComponent, {
      data: { message: message }
    });
  }

  sendOut() {
    // 驗證所有必填題是否已作答
    const unansweredQuestions: string[] = [];

    for (let i = 0; i < this.questionVoList.length; i++) {
      const quiz = this.questionVoList[i];

      if (quiz.required) {
        if (quiz.type === 'S' && !quiz.selectedOption) {
          unansweredQuestions.push(`問題 ${i + 1}: ${quiz.name}`);
        } else if (quiz.type === 'M') {
          const hasSelection = quiz.optionsList.some(option => option.checkBoolean);
          if (!hasSelection) {
            unansweredQuestions.push(`問題 ${i + 1}: ${quiz.name}`);
          }
        } else if (quiz.type === 'T' && (!quiz.textAnswer || quiz.textAnswer.trim() === '')) {
          unansweredQuestions.push(`問題 ${i + 1}: ${quiz.name}`);
        }
      }
    }

    // 如果有未回答的必填題，顯示錯誤訊息
    if (unansweredQuestions.length > 0) {
      this.openDialog('請回答以下必填問題：\n\n' + unansweredQuestions.join('\n'));
      console.error('未回答的必填問題:', unansweredQuestions);
      return;
    }

    // 建立答案列表
    const answerList = this.questionVoList.map(quiz => {
      let answer: any = {
        questionId: quiz.questionId,
        optionsList: [],
        textAnswer: '',
        radioAnswer: 0
      };

      // 根據問題類型處理答案
      if (quiz.type === 'S') {
        // 單選題：使用 radioAnswer 儲存選中的選項 code
        if (quiz.selectedOption) {
          answer.radioAnswer = quiz.selectedOption;
          // 同時提供 optionsList 供後端驗證選項是否匹配
          const selectedOption = quiz.optionsList.find(option => option.code === quiz.selectedOption);
          if (selectedOption) {
            answer.optionsList = [{
              code: selectedOption.code,
              optionName: selectedOption.optionName,
              checkBoolean: false
            }];
          }
        }
      } else if (quiz.type === 'M') {
        // 多選題：optionsList 為所有選項的陣列，並標記 checkBoolean
        answer.optionsList = quiz.optionsList.map(option => ({
          code: option.code,
          optionName: option.optionName,
          checkBoolean: option.checkBoolean || false
        }));
      } else if (quiz.type === 'T') {
        // 文字輸入題：textAnswer 儲存文字內容
        answer.textAnswer = quiz.textAnswer || '';
      }

      return answer;
    });

    // 組合最終的 JSON 資料（符合後端格式）
    const responseData = {
      quizId: Number(this.id),
      user: {
        name: this.name,
        age: this.age,
        email: this.email,
        phone: this.phone,
        gender: this.gender
      },
      answerList: answerList
    };

    // 輸出到 console 查看結果
    console.log('=== 問卷回應資料 ===');
    console.log(JSON.stringify(responseData, null, 2));

    // 呼叫 API 服務來提交資料
    this.apiDataService.fillin(responseData).subscribe({
      next: (response) => {
        console.log('提交成功:', response);
        this.openDialog('問卷提交成功！感謝您的填寫。');
        // 可以導向到其他頁面，例如：
        this.router.navigate(['questionnaire']);
      },
      error: (error) => {
        console.error('提交失敗:', error);
        this.openDialog(`不得重複提交`);
        this.router.navigate(['questionnaire']);
      }
    });
  }
}
