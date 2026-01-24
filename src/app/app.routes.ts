import { Routes } from '@angular/router';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { LoginComponent } from './login/login.component';
import { QuizCreateComponent } from './quiz-create/quiz-create.component';
import { EditComponent } from './edit/edit.component';

export const routes: Routes = [
  {path: 'questionnaire', component: QuestionnaireComponent},
  {path: 'login', component: LoginComponent},
  {path: 'questCreate', component: QuizCreateComponent},
  {path: `edit/:id`, component: EditComponent},
];