import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiDataService } from '../@service/api-data.service';
import { UserService } from '../@service/user.service';

@Component({
  selector: 'app-feedback',
  imports: [],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
id : string | null = null;

constructor(private route: ActivatedRoute, private router: Router, private apiDataService: ApiDataService, private userService: UserService) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      console.log('動態 ID:', this.id);
  });
}
ngOnInit(): void {
 this.apiDataService.feedback(Number(this.id)).subscribe((res) => {
      console.log(res);
      console.log(this.id);
    });
}
back(){
this.router.navigate([`questionnaire`])
}
}
