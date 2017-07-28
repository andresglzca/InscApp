import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'page-edit-record',
  templateUrl: 'edit-record.html',
})
export class EditRecordPage {

  private data: FormGroup;
  record: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public formBuilder: FormBuilder, public angFire: AngularFire) {
    this.data = this.formBuilder.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      birthdate: ['', Validators.required],
      description: [''],
    })

    var keyRecordToShow = this.navParams.get('keyRecord');

    this.record = angFire.database.list('/usuarios');
    this.record = this.angFire.database.list('/usuarios', {
      query: {
        orderByKey: true,
        equalTo: keyRecordToShow
      }
    });
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditRecordPage');
  }

}
