import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PostsService } from 'src/app/services/posts.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent {
  public visible = false;
  inputValue: any = '';
  addToastPayload = {
    "userId": "150eecd0-72d8-4c41-a979-a6ad5b953654",
    "userName": "Arindam Sarkar",
    "textField": "Hi from posts",
    "time": new Date().getTime()
  };
  user: any;
  getPostsPayload = {
    following: [],
    userId: ''
  };
  posts:any=[];
  constructor(
    private postService: PostsService,
    private toastr: ToastrService,
    private userService: UserService
  ) {
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.addToastPayload.userId = this.user.userId;
    this.addToastPayload.userName = this.user.name;
    this.getPostsPayload.userId = this.user.userId;
    this.getUserDetailsByEmail();
  }

  getUserDetailsByEmail() {
    this.userService.getUserByEmail(this.user.email)
      .subscribe(res => {
        this.getPostsPayload.following = res.following;
        this.getPosts();
      }, err => this.toastr.error(err.error))
  }

  write() {
    if (!this.inputValue) {
      this.toastr.info("Please enter something to post")
    } else {
      this.addToastPayload.textField = this.inputValue;
      // console.log(this.addToastPayload);
      this.postService.ceratePost(this.addToastPayload)
        .subscribe(res => {
          this.getPosts()
          this.toastr.success('Post is Live');
        }, err => { this.toastr.error(err.error) })
    }
  }

  getPosts() {
    // console.log(this.getPostsPayload);
    this.postService.getPosts(this.getPostsPayload)
      .subscribe(res => {
       this.posts = res;
      }, err => this.toastr.error(err.error))
  }

  getTime(time:any){
    const differenceInMilliseconds = new Date().getTime() - time;
    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
    return differenceInMinutes.toFixed(0);
  }
}
