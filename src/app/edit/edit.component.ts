import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiDataService } from '../@service/api-data.service';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../@dialog/dialog/dialog.component';
import { UserService } from '../@service/user.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  id: string | null = null;
  editForm: FormGroup;
  readonly dialog = inject(MatDialog);
  minDate: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiDataService: ApiDataService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.minDate = new Date().toISOString().split('T')[0];
    this.editForm = this.fb.group({
      quiz: this.fb.group({
        id: [null],
        title: ['', Validators.required],
        description: [''],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        publish: [false]
      }),
      questionVoList: this.fb.array([])
    });
  }

  ngOnInit() {
    if (!this.userService.online) {
      this.dialog.open(DialogComponent, { data: { message: "請先登入" } });
      this.router.navigate(['login']);
      return;
    }

    if (this.userService.role !== 'ADMIN') {
      this.dialog.open(DialogComponent, { data: { message: "存取被拒：只有管理員可以修正矩陣數據" } });
      this.router.navigate(['questionnaire']);
      return;
    }

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.loadMatrixData(Number(this.id));
      }
    });
  }

  loadMatrixData(id: number) {
    this.apiDataService.getQuiz().subscribe(res => {
      const target = res.quizList.find(q => q.id === id);
      if (target) {
        if (target.publish) {
          this.dialog.open(DialogComponent, { data: { message: "已發布的問卷無法編輯" } });
          this.router.navigate(['questionnaire']);
          return;
        }
        this.editForm.get('quiz')?.patchValue(target);
      }
    });

    this.apiDataService.questionList(id).subscribe(res => {
      if (res.code === 200 && res.questionVoList) {
        this.populateQuestions(res.questionVoList);
      }
    });
  }

  populateQuestions(questions: any[]) {
    const questionArray = this.editForm.get('questionVoList') as FormArray;
    questionArray.clear();

    questions.forEach(q => {
      const qGroup = this.fb.group({
        questionId: [q.questionId], // 保留原始 ID
        quizId: [q.quizId],         // 保留原始 Quiz ID
        name: [q.name, Validators.required],
        type: [q.type],
        required: [q.required],
        optionsList: this.fb.array([])
      });

      const optArray = qGroup.get('optionsList') as FormArray;
      if (q.optionsList) {
        q.optionsList.forEach((o: any) => {
          optArray.push(this.fb.group({
            code: [o.code], // 保留選項編號
            optionName: [o.optionName, Validators.required]
          }));
        });
      }

      questionArray.push(qGroup);
    });
  }

  get questions(): FormArray {
    return this.editForm.get('questionVoList') as FormArray;
  }

  getOptions(question: AbstractControl): FormArray {
    return question.get('optionsList') as FormArray;
  }

  addQuestion() {
    const questionGroup = this.fb.group({
      questionId: [0], // 新單元標識
      quizId: [Number(this.id)],
      name: ['', Validators.required],
      type: ['S'],
      required: [true],
      optionsList: this.fb.array([])
    });
    this.questions.push(questionGroup);
  }

  addOption(question: AbstractControl) {
    const optionGroup = this.fb.group({
      code: [0], // 新選項標識
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
    if (this.editForm.invalid) {
      this.dialog.open(DialogComponent, { data: { message: "請填寫完整修復內容" } });
      return;
    }

    const rawValue = this.editForm.value;
    const formattedData = {
      quiz: rawValue.quiz,
      questionVoList: rawValue.questionVoList.map((q: any, qIdx: number) => {
        // 如果 questionId 為 0 或 undefined，則分配新編號，否則保留
        const finalQId = q.questionId || (qIdx + 1);
        return {
          ...q,
          questionId: finalQId,
          optionsList: q.optionsList.map((o: any, oIdx: number) => ({
            ...o,
            code: o.code || (oIdx + 1) // 如果 code 為 0 或 undefined，則分配新編號
          }))
        };
      })
    };

    console.log('傳送修正數據：', formattedData);

    this.apiDataService.update(formattedData).subscribe({
      next: (response) => {
        if (response && response.code === 200) {
          this.dialog.open(DialogComponent, {
            data: { message: response.message || "矩陣數據修正完成" }
          });
          this.router.navigate(['questionnaire']);
        } else {
          this.dialog.open(DialogComponent, {
            data: { message: `修正失敗: ${response?.message || '協定錯誤'}` }
          });
        }
      },
      error: (err) => {
        console.error('Update error:', err);
        this.dialog.open(DialogComponent, {
          data: { message: "數據傳輸中斷 // 連線異常 // STACK_ERR" }
        });
      }
    });
  }

  onBack() {
    this.router.navigate(['questionnaire']);
  }
}
