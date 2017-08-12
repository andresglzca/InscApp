import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { CallNumber } from '@ionic-native/call-number';
import moment from 'moment';

/**
 * Generated class for the ShowRecordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-show-record',
  templateUrl: 'show-record.html',
})
export class ShowRecordPage {

  record; history: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public viewCtrl: ViewController, public angFire: AngularFire, public callNmbr: CallNumber) {
    this.record = angFire.database.list('/usuarios');
  }
  section: string = "record-info";
  age; paymentbadge; when: any;

  ionViewDidLoad() {


    var keyRecordToShow = this.navParams.get('keyRecord');
    var nameHistoryToShow = this.navParams.get('userName');
    
    this.history = this.angFire.database.list('/history', {
      query: {
        orderByChild: 'user',
        equalTo: nameHistoryToShow
      }
    });

    this.record = this.angFire.database.list('/usuarios', {
      query: {
        orderByKey: true,
        equalTo: keyRecordToShow
      }
    });

    this.record.subscribe(items => {
      var birthdate = items[0].birthdate;
      this.age = moment().diff(moment(birthdate, "DD/MM/YYYY"), 'years');
      var paymentstatus = items[0].paymentstatus;
      if (paymentstatus === "unpaid") {
        this.paymentbadge = "Sin Anticipo";
      } else if (paymentstatus === "paid") {
        this.paymentbadge = "Pagado";
      } else {
        var payment = items[0].payment;
        var price = this.navParams.get('price');
        var debt = price - payment;
        this.paymentbadge = "$" + debt;
      }
    });
  }
  test(data) {
    var datehistory = data
    moment.locale('es_MX')
    this.when = moment(datehistory, 'dddd, MMMM Do YYYY, h:mm:ss a').fromNow();
    return this.when;
  }
  letter(data: string) {
    var letter = data.charAt(0).toLocaleUpperCase();
    return letter
  }
  callNumber(number){
    this.callNmbr.callNumber(number, true)
  }
}
