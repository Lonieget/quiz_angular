import { Component, OnInit } from '@angular/core';
import { Quiz, QuizResponse } from '../@interface/data';
import { ApiDataService } from '../@service/api-data.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../@service/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../@dialog/dialog/dialog.component';
import { inject } from '@angular/core';

@Component({
  selector: 'app-questionnaire',
  imports: [FormsModule],
  templateUrl: './questionnaire.component.html',
  styleUrl: './questionnaire.component.scss'
})
export class QuestionnaireComponent implements OnInit {
  questions!: QuizResponse<Quiz>[];
  quizList: Quiz[] = [];
  isLoading = true;
  searchText!: string;
  filteredQuizList: Quiz[] = [];
  currentPage: number = 1;
  pageSize: number = 5;

  name!: string
  readonly dialog = inject(MatDialog);
  constructor(private apiDataService: ApiDataService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    if (!this.userService.online) {
      this.dialog.open(DialogComponent, { data: { message: "請先登入" } });
      this.router.navigate(['login']);
      return;
    }
    this.getQuizStatus();
    this.name = this.userService.name;
  }
  editQuestion(id: number) {
    this.router.navigate(['edit', id]);
  }
  deleteQuestion(id: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message: `確定要執行永久抹除指令嗎？(對象序號: ${id}) 此操作無法復原。`,
        isConfirm: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiDataService.deleteQuiz(id).subscribe(() => {
          this.filterQuiz();
          this.getQuizStatus();
        });
      }
    });
  }
  filterQuiz() {
    const search = (this.searchText || '').toLowerCase().trim();
    this.currentPage = 1;

    if (!search) {
      this.filteredQuizList = [...this.quizList];
      return;
    }

    this.filteredQuizList = this.quizList.filter(quiz => {
      const title = (quiz.title || '').toLowerCase();
      const id = (quiz.id || '').toString();

      return title.includes(search) || id.includes(search);
    });
  }
  getQuizStatus() {
    this.apiDataService.getQuiz().subscribe((res: any) => {
      this.quizList = res.quizList;
      this.filteredQuizList = [...this.quizList];
    });
  }
  feedback(id: number) {
    this.router.navigate(['feedback', id]);
  }
  createQuestion() {
    this.router.navigate(['questCreate']);
  }

  toQuiz(id: number) {
    this.router.navigate(['quiz', id]);
    console.log(id);
  }
  onLogout() {
    this.userService.resetUserInfo();
    this.router.navigate(['login']);
  }

  get paginatedQuizList(): Quiz[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredQuizList.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredQuizList.length / this.pageSize) || 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
