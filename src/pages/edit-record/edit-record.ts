import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, ModalController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { SelectBrotherPage } from '../select-brother/select-brother';

import moment from 'moment';

@Component({
  selector: 'page-edit-record',
  templateUrl: 'edit-record.html',
})
export class EditRecordPage {

  private data: FormGroup;
  record; history: FirebaseListObservable<any>;
  keyRecordToShow: any;
  date = '11/05/2011';
  dataUpdated: Array<any>;
  brothersListSaved: any;
  oName; oGender; oBirthdate; oDescription: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public formBuilder: FormBuilder, public angFire: AngularFire, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {
    this.data = this.formBuilder.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      birthdate: ['', Validators.required],
      description: [''],
      'hermanos': {

      }
    })

    this.keyRecordToShow = this.navParams.get('keyRecord');
    this.history = angFire.database.list('/history');
    this.record = angFire.database.list('/usuarios');
    this.record = this.angFire.database.list('/usuarios', {
      query: {
        orderByKey: true,
        equalTo: this.keyRecordToShow
      }
    });



    this.record.subscribe(item => {
      var myDate = moment(item[0].birthdate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      console.log(myDate)
      var newBirthdate = new Date(myDate).toISOString();

      this.data.controls.name.setValue(item[0].name)
      this.oName = item[0].name;
      this.data.controls.gender.setValue(item[0].gender)
      this.oGender = item[0].gender
      this.data.controls.birthdate.setValue(newBirthdate)
      this.oBirthdate = newBirthdate
      this.data.controls.description.setValue(item[0].description)
      this.oDescription = item[0].description




    })
  }

  addBrothers() {
    let modal = this.modalCtrl.create(SelectBrotherPage);

    modal.onDidDismiss((brotherListSaved) => {
      this.brothersListSaved = brotherListSaved;

    });
    modal.present();

  }


  public getCurrentUser() {
    var currentUser = window.localStorage.getItem("CurrentUser");
    return currentUser;
  }


  submit(): void {

    let loader = this.loadingCtrl.create({
      content: "Editando ...",
    });

    if (this.data.valid) {
      // var dataCompared = [];
      // if (this.oName != this.data.controls.name.value) {
      //   dataCompared.push({
      //     'name': this.oName,
      //     'newName': this.data.controls.name.value
      //   })
      // }
      // if (this.oGender != this.data.controls.gender.value) {
      //   dataCompared.push({
      //     'gender': this.oGender,
      //     'newGender': this.data.controls.gender.value
      //   })
      // }

      // console.log(dataCompared)

      moment.locale('es_MX')
      let historyData = {
        action: 'editó',
        staff: this.getCurrentUser(),
        date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
        user: this.data.controls['name'].value
      }
      var dateFormated = moment(this.data.controls['birthdate'].value, 'YYYY-MM-DD').format('DD/MM/YYYY');
      this.data.controls['birthdate'].setValue(dateFormated);
      this.data.controls['hermanos'].setValue(this.brothersListSaved)
      this.record.update(this.keyRecordToShow, this.data.value)

      this.history.push(historyData)
        .then(_ => loader.dismiss())
        .then(_ => this.closeModal())
    }
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditRecordPage');
  }

}
