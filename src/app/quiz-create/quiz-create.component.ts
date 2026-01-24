import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ApiDataService } from '../@service/api-data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../@service/user.service';

@Component({
  selector: 'app-quiz-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './quiz-create.component.html',
  styleUrl: './quiz-create.component.scss'
})
export class QuizCreateComponent {
  quizForm: FormGroup;

  constructor(private fb: FormBuilder, private apiDataService: ApiDataService,private userService: UserService,private router: Router) {
    this.quizForm = this.fb.group({
      quiz: this.fb.group({
        title: ['', Validators.required],
        description: [''],
        startDate: [''],
        endDate: [''],
        publish: [false] // 預設不發佈
      }),
      questionVoList: this.fb.array([]) 
    });
  }
  ngOnInit() {
    if(!this.userService.online){
      alert("請先登入");
      this.router.navigate(['login']);
      return;
    }
  }

  get questions(): FormArray {
    return this.quizForm.get('questionVoList') as FormArray;
  }

  addQuestion() {
    const questionGroup = this.fb.group({
      // 對應 JSON 的 "name"
      name: ['', Validators.required],
      // 對應 JSON 的 "type"
      type: ['S'], 
      required: [true],
      optionsList: this.fb.array([])
    });
    this.questions.push(questionGroup);
  }

  getOptions(question: AbstractControl): FormArray {
    return question.get('optionsList') as FormArray;
  }

  addOption(question: AbstractControl) {
    const optionGroup = this.fb.group({
      // 對應 JSON 的 "optionName"
      optionName: ['', Validators.required]
    });
    this.getOptions(question).push(optionGroup);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  removeOption(question: AbstractControl, index: number) {
    this.getOptions(question).removeAt(index);
  }

  onSubmit() {
    if (this.quizForm.invalid) {
      alert('請填寫完整內容');
      return;
    }

    // 取得原始表單值
    const rawValue = this.quizForm.value;

    // 加工處理以符合特定的 JSON 格式 (加入 questionId 與 code)
    const formattedData = {
      quiz: rawValue.quiz,
      questionVoList: rawValue.questionVoList.map((q: any, qIdx: number) => ({
        ...q,
        questionId: qIdx + 1, // 自動產生題目編號
        optionsList: q.optionsList.map((o: any, oIdx: number) => ({
          code: oIdx + 1,      // 自動產生選項編號
          optionName: o.optionName
        }))
      }))
    };

    console.log('符合格式的 JSON 輸出：', formattedData);

    this.apiDataService.createQuiz(formattedData).subscribe(response => {
      console.log('Quiz created successfully', response);
      this.router.navigate(['questionnaire']);
    });
  }
}