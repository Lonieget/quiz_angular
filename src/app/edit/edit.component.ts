import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiDataService } from '../@service/api-data.service';

@Component({
  selector: 'app-edit',
  imports: [],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  id: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private apiDataService: ApiDataService) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      console.log('動態 ID:', this.id);
      // 這裡可以根據新 ID 去重新打 API 抓資料
      this.apiDataService.questionList(Number(this.id)).subscribe((res) => {
        console.log(res);
      });
    });
  }
}
