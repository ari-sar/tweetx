import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'tweetx';
  constructor(private spinner: NgxSpinnerService) {
    this.spinner.show();
  }
  ngOnInit() {
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }
}
