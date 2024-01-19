import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  showPassword: boolean = false;
  signUpForm: FormGroup;
  name: any;
  email: any;
  password: any;
  confirmPassword: any;
  emailFilled: boolean = false;
  passwordFilled: boolean = false;
  nameFilled: boolean = false;
  confirmPasswordFilled: boolean = false;
  isPasswordWrong: boolean = false;
  user = {
    "email": "",
    "password": "",
    "name": "",
    "following": [],
    "followers": []
  }
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
    this.name = this.signUpForm.get('name');
    this.email = this.signUpForm.get('email');
    this.password = this.signUpForm.get('password');
    this.confirmPassword = this.signUpForm.get('confirmPassword')
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
    switch (type) {
      case 'name':
        this.nameFilled = true;
        break;
      case 'email':
        this.emailFilled = true;
        break;
      case 'password':
        this.passwordFilled = true;
        break;
      case 'confirmPassword':
        this.confirmPasswordFilled = true;
        break;

      default:
        this.emailFilled = true;
        break;
    }
  }

  public passwordMatchValidator() {
    const password = this.signUpForm.get('password')?.value;
    const confirmPassword = this.signUpForm.get('confirmPassword')?.value;
    // console.log(password, confirmPassword);
    if (password !== confirmPassword) {
      this.isPasswordWrong = true;
    } else {
      this.isPasswordWrong = false;
    }
    // console.log(this.signUpForm.value, this.isPasswordWrong);
  }


  onSubmit() {
    const userDetails = this.signUpForm.value;
    this.user.email = userDetails.email;
    this.user.name = userDetails.name;
    this.user.password = userDetails.password;
    this.userService.cerateUser(this.user)
      .subscribe(res => {
        // console.log(res);
        this.toastr.success('You can login now', 'Account Created Successfully');
        this.router.navigateByUrl('/login')
      }, err => {
        // console.log(err);
        this.toastr.error(err);
      })
    
  }
}
