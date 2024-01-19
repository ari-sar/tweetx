import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PostsService } from 'src/app/services/posts.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  activeSegment: string = 'posts';
  user: any;
  myPosts: any;
  myFollowers: any;
  myFollowing: any;
  getPostsPayload = {
    userId: ''
  }
  payload = {
    "userId": "",
    "followingUserId": ""
  }
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private postsService: PostsService
  ) {
    const stringData = localStorage.getItem('user')
    this.user = JSON.parse(stringData!);
    this.getPostsPayload.userId = this.user.userId;
    this.payload.userId = this.user.userId;
    this.getUserDetailsByEmail();
    this.getPosts();
    // console.log(this.user, 'user')
  }

  changeSegment(name: string) {
    this.activeSegment = name;
  }

  getPosts() {
    this.postsService.getPosts(this.getPostsPayload)
      .subscribe(res => {
        // console.log(res, 'Posts')
        this.myPosts = res;
      }, err => this.toastr.error(err.error))
  }

  getUserDetailsByEmail() {
    this.userService.getUserByEmail(this.user.email)
      .subscribe(res => {
        // console.log(res, 'User Details')
        this.getUserDetailsByIds(res.followers, 'followers');
        this.getUserDetailsByIds(res.following, 'res.following');
      }, err => this.toastr.error(err.error))
  }

  getUserDetailsByIds(ids: any, type: string) {
    this.userService.getUserDetails(ids)
      .subscribe(res => {
        if (type === 'followers') {
          // console.log(res, this.user);
          res.map((user: any) => {
            if (user.followers.length > 0) {
              for (let i = 0; i < user.followers.length; i++) {
                if (user.followers[i] === this.user.userId) {
                  user.hasFollowed = true;
                  break;
                }
              }
            } else {
              user.hasFollowed = false
            }
          })
          this.myFollowers = res;
          // console.log(this.myFollowers);
        } else {
          this.myFollowing = res;
        }
      }, err => {
        this.toastr.error(err.error);
      })
  }

  getFollowStatus(data: any) {
    if (data.followers.length > 0) {
      data.followers.map((ele: any) => {
        if (ele === this.user.userId) {
          console.log('true')
          return
        } else {
          console.log('false');
        }
      })
    }
  }

  follow(user: any) {
    this.payload.followingUserId = user.userId;
    this.userService.followUser(this.payload)
      .subscribe(res => {
        // console.log(res)
        this.toastr.success(`Followed ${user.name}`)
        this.getUserDetailsByEmail();
      }, err => { this.toastr.error(err.error) })
  }

  getTime(time:any){
    const differenceInMilliseconds = new Date().getTime() - time;
    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
    return differenceInMinutes.toFixed(0);
  }
}
