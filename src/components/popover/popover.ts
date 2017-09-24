import { Component } from '@angular/core';
import { NavController, AlertController, ViewController, ToastController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
//import { ShowInfoPage } from '../../pages/show-info/show-info';
//import { ShowHistoryPage } from '../../pages/show-history/show-history';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';


@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {
  records; history: FirebaseListObservable<any>;
  messageDisplayName: string;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public viewCtrl: ViewController, public angFire: AngularFire, public toastCtrl: ToastController) {



  }
  showHistory() {
    this.navCtrl.push('ShowHistoryPage');
    this.viewCtrl.dismiss();
  }

  logout() {
    window.localStorage.removeItem('CurrentUser');
    this.navCtrl.push(LoginPage)
  }

  public getCurrentUser() {
    var currentUser = window.localStorage.getItem("CurrentUser");
    return currentUser;
  }

  changeDisplayName() {
    //close popover

    this.viewCtrl.dismiss();
    let user = firebase.auth().currentUser;
    if (user.displayName) {
      this.messageDisplayName = "Tu nombre de usuario actual es: " + user.displayName
    } else {
      this.messageDisplayName = "Aún no tienes un nombre de usuario ☹"
    }

    let modal = this.alertCtrl.create({
      title: 'Agrega tu nombre de usario',
      message: '<strong>' + this.messageDisplayName + "</strong> <br>" + 'El nombre de usuario debe ser corto como: John Doe',
      inputs: [
        {
          name: 'displayName',
          placeholder: 'Nombre de usuario'
        },
      ],
      buttons: [{
        text: 'Agregar',
        handler: data => {
          var userName = data;
          let user = firebase.auth().currentUser;


          if (userName.displayName) {
            user.updateProfile({
              displayName: userName.displayName,
              photoURL: ''
            }).then(_ => {

              this.history = this.angFire.database.list('/history', {
                query: {
                  orderByChild: 'staff',
                  equalTo: this.getCurrentUser()
                }
              });

              this.history.subscribe(items => {
                items.forEach(element => {
                  this.history.update(element.$key, { staff: userName.displayName })
                });
              });

              this.records = this.angFire.database.list('/usuarios', {
                query: {
                  orderByChild: 'staff',
                  equalTo: this.getCurrentUser()
                }
              });

              this.records.subscribe(items => {
                items.forEach(element => {
                  this.records.update(element.$key, { staff: userName.displayName })
                });
              });

              window.localStorage.setItem("CurrentUser", userName.displayName)

            }, function (error) {
              console.log('error')
            });

          } else {

            const err = this.toastCtrl.create({
              message: 'El campo no puede estar vacio.',
              showCloseButton: true,
              closeButtonText: 'Ok',
              position: 'top'
            });
            err.present();

          }
        }
      }]
    });
    modal.present();
  };

  ShowInfoPage() {
    this.navCtrl.push('ShowInfoPage');
    this.viewCtrl.dismiss();
  }

}
