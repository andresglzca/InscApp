import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { CallNumber } from '@ionic-native/call-number';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-show-record',
  templateUrl: 'show-record.html',
})
export class ShowRecordPage {

  record; history; settings; brothers: FirebaseListObservable<any>;
  price; offertDiscount: number;

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

    this.settings = this.angFire.database.list("/settings");

    

    this.settings.subscribe(config => {
      this.price = config[0].price;
      this.offertDiscount = config[0].offertDisccount;
    });


    var totalhermanos = [];

    this.brothers = this.angFire.database.list('/usuarios/' + keyRecordToShow + '/hermanos');

    this.brothers.subscribe(items => {
      var hermanos = [];
      items.forEach(item => {
        hermanos.push(item)
      });
      totalhermanos = hermanos
    })
      
      var price = this.navParams.get('price');
      var numHermanos = totalhermanos.length
      var debt;
      
    

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


        if (numHermanos == 1) {
          price = +this.price - this.offertDiscount / 2
          debt = price - payment
        }
        if (numHermanos >= 2) {
          price = +this.price - this.offertDiscount
          debt = price - payment
        }
        
        
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
