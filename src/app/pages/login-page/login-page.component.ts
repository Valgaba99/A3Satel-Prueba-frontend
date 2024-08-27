import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})


export class LoginPageComponent implements OnInit {

  visibleDialogRegister: boolean = false;
  submitted: boolean = false;
  user = new User()
  validation: boolean = true;


  ngOnInit() {

  }

  showDialogRegister() {
    this.visibleDialogRegister = true;
  }



  createUser() {
    console.log(this.user.nombre)

  }

}
