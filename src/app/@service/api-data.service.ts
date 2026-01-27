import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data, FeedbackResponse } from '../@interface/data';
import { Quiz, QuizResponse } from '../@interface/data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  createQuiz(payload: any): Observable<any> {
    const url = `${this.apiUrl}/quiz/create`;
    return this.http.post(url, payload);
  }
  update(payload: any): Observable<any> {
    const url = `${this.apiUrl}/quiz/update`;
    return this.http.post(url, payload);
  }

  getQuiz(): Observable<QuizResponse<Quiz>> {
    return this.http.get<QuizResponse<Quiz>>(`${this.apiUrl}/quiz/list`);
  }

  deleteQuiz(id: number): Observable<any> {
    const url = `${this.apiUrl}/quiz/delete`;
    const payload = {
      quizIdList: [id]
    };

    return this.http.post(url, payload);
  }

  login(account: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/quiz/login`;
    const payload = { account, password };
    return this.http.post(url, payload);
  }

  register(account: string, password: string, name: string, phone: string, email: string, age: number, gender: string, role: string): Observable<any> {
    const url = `${this.apiUrl}/quiz/add_info`;
    const payload = { account, password, name, phone, email, age, gender, role };
    return this.http.post(url, payload);
  }

  feedback(quizId: number): Observable<FeedbackResponse> {
    const url = `${this.apiUrl}/quiz/feedback?quizId=${quizId}`;
    return this.http.get<FeedbackResponse>(url);
  }
  statistics(quizId: number): Observable<any> {
    const url = `${this.apiUrl}/quiz/statistic?quizId=${quizId}`;
    return this.http.get(url);
  }
  questionList(quizId: number): Observable<any> {
    const url = `${this.apiUrl}/quiz/question_list?quizId=${quizId}`;
    return this.http.get(url);
  }
  fillin(payload: any): Observable<any> {
    const url = `${this.apiUrl}/quiz/fillin`;
    return this.http.post(url, payload);
  }
}
