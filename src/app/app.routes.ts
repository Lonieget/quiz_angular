import { Routes } from '@angular/router';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { LoginComponent } from './login/login.component';
import { QuizCreateComponent } from './quiz-create/quiz-create.component';
import { EditComponent } from './edit/edit.component';
import { QuizComponent } from './quiz/quiz.component';
import { FeedbackComponent } from './feedback/feedback.component';

export const routes: Routes = [
  {path: 'questionnaire', component: QuestionnaireComponent},
  {path: 'login', component: LoginComponent},
  {path: 'questCreate', component: QuizCreateComponent},
  {path: `edit/:id`, component: EditComponent},
  {path: `quiz/:id` , component: QuizComponent},
  {path: `feedback/:id` , component:FeedbackComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full' }
];
