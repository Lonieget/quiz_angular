export interface Data {
}
export interface Quiz {
  id: number;
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  publish: boolean;
}
export interface QuizResponse<T>{
  code: number;
  message: string;
  quizList: Quiz[];
}
