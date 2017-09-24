import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-show-history',
  templateUrl: 'show-history.html',
})
export class ShowHistoryPage {

  history: FirebaseListObservable<any>;
  when: any;
  empty = true;
  dataTemp: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public angFire: AngularFire, public loadingCtrl: LoadingController) {
    this.history = angFire.database.list("/history")
 
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Cargando historial...'
    });
    loading.present();

    if (!this.dataTemp) {
      this.history.subscribe(snapshots => {
        this.dataTemp = snapshots
        console.log(this.dataTemp);
      });
      loading.dismiss();
    } else {
      loading.dismiss();
    }

    
      
    //   if (snapshots == "") {
    //     this.empty = true;
    //   } else {
    //     this.empty = false;
    //   }
    //   loading.dismissAll();
    // },
    //   (err) => {
    //     console.log(err)
    //   })
  
    
  }
  showTestPage(){
    this.navCtrl.push('TestPage')
  }
  check(item) {
    if (typeof item === 'string') {
      return 'string';
    } else {
     
      return 'object';
    }
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
