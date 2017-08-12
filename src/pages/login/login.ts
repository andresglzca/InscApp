import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AuthProviders, AuthMethods, AngularFire } from 'angularfire2';
import { HomePage } from '../home/home';
import * as firebase from 'firebase';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {



  constructor(public navCtrl: NavController, public navParams: NavParams, public angfire: AngularFire, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {

  }

  public showToastWithCloseButton(error) {
    const toast = this.toastCtrl.create({
      message: error,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  };

  public currentSession() {
    var currentUser = window.localStorage.getItem("CurrentUser");
    console.log(currentUser);
    if (currentUser) {
      this.showToastWithCloseButton(currentUser);
      return true;
    } else {
      this.showToastWithCloseButton("no hay nada");
      return false;
    }
  }

  email: string;
  password: string;

  login2() {
    var currentUser;
    let loader = this.loadingCtrl.create({
      content: "Cargando..."
    });
    if (this.email && this.password) {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then((response) => {
          loader.dismiss();
          if (response.displayName) {
            currentUser = response.displayName
          } else {
            currentUser = response.email
          }
          // let currentUser = firebase.auth().currentUser.email;
          window.localStorage.setItem('CurrentUser', currentUser);
          this.navCtrl.setRoot(HomePage);
        })
        .catch((error) => {
          loader.dismiss();
          this.showToastWithCloseButton(error);
        })
    } else {
      const error = "Debe ingrese sus datos para inicar sesión";
      this.showToastWithCloseButton(error);
    }


  }

  // login() {
  //   var CurrentUser;
  //   let loader = this.loadingCtrl.create({
  //     content: "Cargando..."
  //   });
  //   if (this.email && this.password) {
  //     loader.present();
  //     this.angfire.auth.login({
  //       email: this.email,
  //       password: this.password
  //     }, {
  //         provider: AuthProviders.Password,
  //         method: AuthMethods.Password
  //       }).then((response) => {
  //         this.navCtrl.setRoot(HomePage);
  //         if (response.auth.displayName) {
  //           CurrentUser = response.auth.displayName;
  //         }else{
  //           CurrentUser = response.auth.email;
  //         }
  //         loader.dismiss();
  //         window.localStorage.setItem('CurrentUser', CurrentUser);
  //       }).catch((error) => {
  //         this.showToastWithCloseButton(error);
  //         loader.dismiss();
  //       })
  //   } else {
  //     const error = "Debe ingrese sus datos para inicar sesión";
  //     this.showToastWithCloseButton(error);

  //   }
  // };



  ionViewDidLoad() {
  }




}
