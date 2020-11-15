import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/_services/auth/authentication.service';
import { User, IUser } from 'src/app/entities/user/user.model';
import { UserService } from 'src/app/entities/user/user.service';


@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  registrationForm: FormGroup;
  loginForm: FormGroup;

  Fname: string = '';
  Fpassword: string = '';
  FrePassword: string = '';
  Femail: string = '';
  FtypePicked: string = '';
  Ftype: string = 'Customer';

  error: boolean =  false;
  errMsg: string;
  isLoggingIn = true;
  returnUrl: string;

  @Output() userLogin = new EventEmitter<IUser>();
  @Output() userType = new EventEmitter<string>();

  constructor(
    protected userService: UserService,
    protected authService: AuthenticationService,
    protected formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
      if(this.authService.currentUserValue != null){
        console.log(this.authService.currentUserValue);
        this.router.navigate(['/']);
      }
  }

  ngOnInit(): void {
    this.initForm();

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  toggleLoggingIn(loggingIn: boolean){
    this.isLoggingIn = loggingIn;
  }

  // Manage the submit action and create the new product.
  onSubmit() {
    var lName, lPass;
    if(this.isLoggingIn){

      var typeRadio = document.getElementsByName('userType') as NodeListOf<HTMLInputElement>;
      for( var i = 0; i < typeRadio.length; i++){
        if(typeRadio[i].checked){
          if(typeRadio[i].value === 'customer') {
            this.Ftype = 'Customer';
          } else {
            this.Ftype = 'Admin';
          }
          break;
        }
      }

      lName = this.logName.value;
      lPass = this.logPassword.value;
      this.errMsg = 'Error occured while Logging in!!';
    } else {

      this.Ftype = 'Customer';
      const user = new User(
        this.regName.value, this.regPassword.value,
        this.regEmail.value, this.Ftype,
        true,
        null
      );
      this.userService.create(user).then((result: IUser) => {
        this.errMsg = 'Error occured while creating User!!';
        if (result === undefined) {
          this.error = true;
        } else {
          lName = this.regName.value;
          lPass = this.regPassword.value;
        }
      });
    }

    this.authService.login(this.logName.value, this.logPassword.value, this.Ftype)
      .pipe(first())
      .subscribe(data => {
        if(data === null){
          this.error = true;
          this.errMsg = 'User not found!';
        } else {
          this.error = false;
          this.userLogin.emit(this.authService.currentUserValue);
          this.userType.emit(this.Ftype);
          this.router.navigate([this.returnUrl]);
        }
      },
      error => {
        this.error = true;
      });
  }

  // Hide the error message.
  hideError() {
    this.error = false;
  }

  // Init the creation form.
  private initForm() {
    this.registrationForm = new FormGroup({
      regName: new FormControl(this.Fname, Validators.required),
      regPassword: new FormControl(this.Fpassword, Validators.required),
      regRePassword: new FormControl(this.FrePassword, Validators.required),
      regEmail: new FormControl(this.Femail, [Validators.required, Validators.email])
    });

    this.loginForm = new FormGroup({
      logName: new FormControl(this.Fname, Validators.required),
      logPassword: new FormControl(this.Fpassword, Validators.required)
    });
  }

  // Form Control getters

  get logName() { return this.loginForm.get('logName'); }

  get logPassword() { return this.loginForm.get('logPassword'); }

  get regName() { return this.registrationForm.get('regName'); }

  get regEmail() { return this.registrationForm.get('regEmail'); }

  get regPassword() { return this.registrationForm.get('regPassword'); }

  get regRePassword() { return this.registrationForm.get('regRePassword'); }

}
