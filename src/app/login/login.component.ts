import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  showPassword: boolean = false;
  loginForm: FormGroup;
  email: any;
  password: any;
  emailFilled: boolean = false;
  passwordFilled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.email = this.loginForm.get('email');
    this.password = this.loginForm.get('password');
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.passwordInput.nativeElement.type === 'password') {
      this.passwordInput.nativeElement.type = 'text';
    } else {
      this.passwordInput.nativeElement.type = 'password'
    }
    // console.log(this.passwordInput.nativeElement.type);
  }

  focusOutFunction(type: string) {
    if (type === 'email') {
      this.emailFilled = true;
    } else {
      this.passwordFilled = true;
    }
  }


  onSubmit() {
    this.spinner.show();
    const userDetails = this.loginForm.value
    this.userService.getUserByEmail(userDetails.email)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe(res => {
        if (res.password === userDetails.password) {
          this.toastr.success('Getting Feed ready for you', 'Login Success');
          localStorage.setItem('user', JSON.stringify(res));
          this.router.navigateByUrl('/feed');
        } else {
          this.toastr.error(`Password is ${res.password}`, "Incorrect Password")
        }
      }, err => { this.toastr.error(err.error) })
  }
}
