import { Component, OnInit } from '@angular/core';
import { Quiz, QuizResponse } from '../@interface/data';
import { ApiDataService } from '../@service/api-data.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../@service/user.service';
import { Router } from '@angular/router';

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

  name!:string
  constructor(private apiDataService: ApiDataService, private userService: UserService,private router: Router) { }

  ngOnInit() {
    if(!this.userService.online){
      alert("請先登入");
      this.router.navigate(['login']);
      return;
    }
    this.getQuizStatus();
    this.name=this.userService.name;
  }
  editQuestion(id: number) {
    this.router.navigate(['edit', id]);
  }
  deleteQuestion(id: number) {
   this.apiDataService.deleteQuiz(id).subscribe(() => {
      this.filterQuiz();
      this.getQuizStatus();
    });
}
  filterQuiz() {
  const search = (this.searchText || '').toLowerCase().trim();

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
getQuizStatus(){
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

toQuiz(id: number){
  this.router.navigate(['quiz', id]);
  console.log(id);
}
}
