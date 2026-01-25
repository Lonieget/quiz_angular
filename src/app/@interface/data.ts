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
export interface QuestionResponse {
  code: number;
  message: string;
  questionVoList: QuestionVoList[];
}

export interface QuestionVoList {
  name: string;           // 這是題目的標題，例如 "您參與的課程主題是？"
  optionsList: OptionsList[]; // ⚠️ 這裡必須加 's'，與 API 同步
  questionId: number;
  quizId: number;
  required: boolean;
  type: string;
}

export interface OptionsList {
  checkBoolean: boolean;
  code: number;
  optionName: string;
}
