import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import moment from 'moment';


@Component({
  selector: 'page-show-history',
  templateUrl: 'show-history.html',
})
export class ShowHistoryPage {

  history: FirebaseListObservable<any>;
  when: any;
  empty = true;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public angFire: AngularFire, public loadingCtrl: LoadingController) {
    this.history = angFire.database.list("/history")

    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Cargando historial...'
    });
    loading.present();

    this.history.subscribe(snapshots => {
      if (snapshots == "") {
        this.empty = true;
      } else {
        this.empty = false;
      }
      loading.dismissAll();
    },
      (err) => {
        console.log(err)
      })
  }
  dateFrom(data) {
    var datehistory = data
    moment.locale('es_MX')
    this.when = moment(datehistory, 'dddd, MMMM Do YYYY, h:mm:ss a').fromNow();
    return this.when;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowHistoryPage');
  }

}
