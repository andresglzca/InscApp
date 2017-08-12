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
  oName; oGender; oBirthdate; oDescription; oShirtSize; oChurch: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public formBuilder: FormBuilder, public angFire: AngularFire, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {
    this.data = this.formBuilder.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      birthdate: ['', Validators.required],
      shirtSize: ['', Validators.required],
      church: [''],
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
      var newBirthdate = new Date(myDate).toISOString();

      this.data.controls.name.setValue(item[0].name)
      this.oName = item[0].name;
      this.data.controls.gender.setValue(item[0].gender)
      this.oGender = item[0].gender
      this.data.controls.birthdate.setValue(newBirthdate)
      this.oBirthdate = newBirthdate
      this.data.controls.description.setValue(item[0].description)
      this.oDescription = item[0].description
      this.data.controls.shirtSize.setValue(item[0].shirtSize)
      this.oShirtSize = item[0].shirtSize
      this.data.controls.church.setValue(item[0].church)
      this.oChurch = item[0].church




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
      var dataCompared = [];
      if (this.oName != this.data.controls.name.value) {
        var changeName = "Nombre"
        dataCompared.push(changeName)
      }
      if (this.oGender != this.data.controls.gender.value) {
        var changeGender = "Sexo"
        dataCompared.push(changeGender)
      }
      if (this.oBirthdate != this.data.controls.birthdate.value) {
        var changeBirthday = "Fecha de Nacimiento"
        dataCompared.push(changeBirthday)
      }
      if (this.oDescription != this.data.controls.description.value) {
        var changeDesc = "Descripción"
        dataCompared.push(changeDesc)
      }
      if (this.oShirtSize != this.data.controls.shirtSize.value) {
        var changeShirtSize = "Talla de playera"
        dataCompared.push(changeShirtSize)
      }
      if (this.oChurch != this.data.controls.church.value) {
        var changeChurch = "Iglesia"
        dataCompared.push(changeChurch)
      }

      console.log(dataCompared)

      moment.locale('es_MX')
      let historyData = {
        action: 'editó',
        staff: this.getCurrentUser(),
        date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
        user: this.data.controls['name'].value,
        description: dataCompared
      }
      var dateFormated = moment(this.data.controls['birthdate'].value, 'YYYY-MM-DD').format('DD/MM/YYYY');
      this.data.controls['birthdate'].setValue(dateFormated);
      if (this.brothersListSaved) {
        this.data.controls['hermanos'].setValue(this.brothersListSaved)
      }
      this.record.update(this.keyRecordToShow, this.data.value)
        .then(_ => this.history.push(historyData))
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
