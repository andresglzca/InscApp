import { Component } from '@angular/core';
import { NavController  } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';


@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {

  text: string;

  constructor(public navCtrl: NavController) {
    console.log('Hello Popover Component');
    this.text = 'Hello World';
  }

  logout(){
    window.localStorage.removeItem('CurrentUser');
    this.navCtrl.push(LoginPage)
  }

}
