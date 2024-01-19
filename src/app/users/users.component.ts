import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  users: any = [];
  payload = {
    "userId": "",
    "followingUserId": ""
  }
  user: any;
  following: any = [];
  constructor(
    private toastr: ToastrService,
    private userService: UserService
  ) {
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.getUserDetailsByEmail();
    this.payload.userId = this.user.userId;
  }

  getUserDetailsByEmail() {
    this.userService.getUserByEmail(this.user.email)
      .subscribe(res => {
        this.following = res.following;
        this.getUsers();
      }, err => this.toastr.error(err.error))
  }

  getUsers() {
    this.userService.getUsers()
      .subscribe(res => {
        console.log(this.following);
        res.map((ele: any, i: number) => {
          if (ele.userId === this.payload.userId) {
            res.splice(i, 1);
          }
        })
        if (this.following.length > 0) {
          this.following.map((id: string) => {
            for (let i = 0; i < res.length; i++) {
              if (res[i].userId === id) {
                res[i].hasFollowed = true;
                break;
              }
            }
          })
        }
          console.log(res)
          this.users = res;
        }, err => {
          this.toastr.error(err.error);
        })
  }

  follow(user: any) {
    this.payload.followingUserId = user.userId;
    this.userService.followUser(this.payload)
      .subscribe(res => {
        // console.log(res)
        this.toastr.success(`Followed ${user.name}`)
        this.getUsers();
      }, err => { this.toastr.error(err.error) })
  }
}
