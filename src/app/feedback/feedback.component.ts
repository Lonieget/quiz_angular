import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiDataService } from '../@service/api-data.service';
import { UserService } from '../@service/user.service';
import { Quiz } from '../@interface/data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent implements OnInit {
  id: string | null = null;
  quizInfo: Quiz | null = null;
  statistics: any = null;
  feedbackList: any[] = [];
  viewMode: 'TRENDS' | 'RAW' = 'TRENDS';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiDataService: ApiDataService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    if (!this.userService.online) {
      this.router.navigate(['login']);
      return;
    }

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.loadDashboardData(Number(this.id));
      }
    });
  }

  loadDashboardData(id: number) {
    // 1. 獲取基本資訊
    this.apiDataService.getQuiz().subscribe(res => {
      this.quizInfo = res.quizList.find(q => q.id === id) || null;
    });

    // 2. 獲取統計數據 (比例與數量)
    this.apiDataService.statistics(id).subscribe(res => {
      if (res.code === 200) {
        this.statistics = res;
      }
    });

    // 3. 獲取原始反饋紀錄 (操作員與答案)
    this.apiDataService.feedback(id).subscribe(res => {
      if (res.code === 200 && res.feedbackList) {
        this.feedbackList = res.feedbackList;
      }
    });
  }

  toggleView(mode: 'TRENDS' | 'RAW') {
    this.viewMode = mode;
  }

  back() {
    this.router.navigate(['questionnaire']);
  }

  getPercent(count: number, total: number): string {
    if (!total) return '0%';
    return Math.round((count / total) * 100) + '%';
  }
}
