import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import moment from 'moment';

@Component({
  selector: 'page-show-info',
  templateUrl: 'show-info.html',
})
export class ShowInfoPage {
  records: FirebaseListObservable<any>;
  totalCamperos: number = 0;
  totalInsc: number = 0;
  timeTo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public angFire: AngularFire) {
    this.records = angFire.database.list("/usuarios");
    this.records.subscribe(items => {
      var sum: number;
      items.forEach(element => {
        sum = Number(element.payment)
        this.totalInsc += sum;
        this.totalCamperos++
      });
    });
    moment.locale('es_MX')

    // this.timeTo = moment("20171229 12:00", "YYYYMMDD, hh:mm").fromNow(true);
    var today = moment().format('YYYYMMDD');
    var theDay = moment("20171231", "YYYYMMDD")


    this.timeTo = moment(theDay).diff(today, 'days');



  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowInfoPage');
  }

}
