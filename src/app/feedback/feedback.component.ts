import { Component, OnInit, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiDataService } from '../@service/api-data.service';
import { UserService } from '../@service/user.service';
import { Quiz, FeedbackVo, StatisticsResponse, StatisticVo, QuestionCountEntry, OptionCount } from '../@interface/data';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../@dialog/dialog/dialog.component';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent implements OnInit, AfterViewInit, OnDestroy {
  id: string | null = null;
  quizInfo: Quiz | null = null;
  statistics: StatisticsResponse | null = null;
  feedbackList: FeedbackVo[] = [];
  viewMode: 'TRENDS' | 'RAW' = 'TRENDS';
  readonly dialog = inject(MatDialog);

  private charts: Chart[] = [];

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

    if (this.userService.role !== 'ADMIN') {
      this.dialog.open(DialogComponent, { data: { message: "存取被拒：只有管理員可以查看分析數據" } });
      this.router.navigate(['questionnaire']);
      return;
    }

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.loadDashboardData(Number(this.id));
        this.apiDataService.feedback(Number(this.id)).subscribe(res => {
          console.log(res);
        });
      }
    });

    // 初始載入假資料以便預覽
    this.loadMockStatistics();
  }

  loadMockStatistics() {
    this.apiDataService.statistics(Number(this.id)).subscribe(res => {
      console.log('Statistics API Result:', res);
      if (res && res.code === 200 && res.statisticVo) {
        this.statistics = res;
        // 使用 setTimeout 確保 Angular 完成模板更新
        setTimeout(() => this.initCharts(), 100);
      }
    });
  }

  loadDashboardData(id: number) {
    // 1. 獲取基本資訊
    this.apiDataService.getQuiz().subscribe(res => {
      this.quizInfo = res.quizList.find(q => q.id === id) || null;
    });

    // 2. 獲取統計數據 (比例與數量)
    this.apiDataService.statistics(id).subscribe({
      next: (res) => {
        if (res.code === 200 && res.statisticVo?.length) {
          this.statistics = res;
          setTimeout(() => this.initCharts(), 0);
        } else {
          console.warn('API 無數據或回傳錯誤，保留模擬數據');
        }
      },
      error: (error) => {
        console.error('獲取統計數據失敗:', error);
        // CORS error or backend not running
        if (error.status === 0) {
          console.error('無法連接到後端服務，請確認：\n1. 後端服務是否運行\n2. CORS 是否已配置');
        }
      }
    });

    // 3. 獲取原始反饋紀錄 (操作員與答案)
    this.apiDataService.feedback(id).subscribe({
      next: (res) => {
        if (res.code === 200 && res.feedbackVoList) {
          this.feedbackList = res.feedbackVoList;
        }
      },
      error: (error) => {
        console.error('獲取反饋數據失敗:', error);
        if (error.status === 0) {
          console.error('無法連接到後端服務，請確認：\n1. 後端服務是否運行\n2. CORS 是否已配置');
        }
      }
    });
  }

  ngAfterViewInit() {
    if (this.statistics) {
      this.initCharts();
    }
  }

  ngOnDestroy() {
    this.destroyCharts();
  }

  toggleView(mode: 'TRENDS' | 'RAW') {
    this.viewMode = mode;
    if (mode === 'TRENDS') {
      setTimeout(() => this.initCharts(), 0);
    } else {
      this.destroyCharts();
    }
  }

  initCharts() {
    this.destroyCharts();

    if (!this.statistics || !this.statistics.statisticVo) return;

    const statVo = this.statistics.statisticVo;
    if (!statVo.questionsCountVoList) return;

    statVo.questionsCountVoList.forEach((qEntry: QuestionCountEntry, index: number) => {
      const canvasId = `chart-${qEntry.questionId}`;
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

      if (!canvas) return;

      const labels = qEntry.optionsCountList.map((opt: OptionCount) => opt.optionName);
      const data = qEntry.optionsCountList.map((opt: OptionCount) => opt.count || 0);

      const chart = new Chart(canvas, {
        type: qEntry.type === 'M' ? 'bar' : 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            label: '填答數量 (UNIT_COUNT)',
            data: data,
            backgroundColor: [
              'rgba(0, 243, 255, 0.5)',
              'rgba(255, 0, 255, 0.5)',
              'rgba(255, 230, 0, 0.5)',
              'rgba(0, 255, 127, 0.5)',
              'rgba(255, 62, 62, 0.5)'
            ],
            borderColor: [
              '#00f3ff', '#ff00ff', '#ffe600', '#00ff7f', '#ff3e3e'
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#00f3ff',
                font: { family: '"Orbitron", "Inter", sans-serif', size: 10 }
              }
            }
          },
          scales: qEntry.type === 'M' ? {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0, 243, 255, 0.1)' },
              ticks: { color: '#00f3ff', stepSize: 1 }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#00f3ff' }
            }
          } : {}
        }
      });

      this.charts.push(chart);
    });
  }

  destroyCharts() {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  back() {
    this.router.navigate(['questionnaire']);
  }

  getPercent(count: number, total: number): string {
    if (!total) return '0%';
    return Math.round((count / total) * 100) + '%';
  }

  // 獲取文字題的所有回答
  getTextResponses(questionId: number): string[] {
    return this.feedbackList
      .map(f => f.questionAnswerVoList.find(a => a.questionId === questionId))
      .filter(a => a && a.type === 'T' && a.textAnswer)
      .map(a => a!.textAnswer);
  }

  // 獲取單選題的選項名稱
  getSelectedOptionName(answer: any): string {
    if (answer.radioAnswer > 0 && answer.optionsList?.length) {
      const selected = answer.optionsList.find((opt: any) => opt.code === answer.radioAnswer);
      return selected?.optionName || '未選擇';
    }
    return '未選擇';
  }

  // 獲取多選題的所有選項名稱
  getSelectedOptionsNames(answer: any): string {
    if (answer.optionsList?.length) {
      const selected = answer.optionsList
        .filter((opt: any) => opt.checkBoolean)
        .map((opt: any) => opt.optionName);
      return selected.length > 0 ? selected.join(', ') : '未選擇';
    }
    return '未選擇';
  }
}
