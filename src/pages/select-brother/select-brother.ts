import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@IonicPage()
@Component({
  selector: 'page-select-brother',
  templateUrl: 'select-brother.html',
})
export class SelectBrotherPage {
  loadedRecords: Array<any>;
  loadedRecordsList: Array<any>;
  selectedBrothersList = [];
  brothersListSaved: Array<any>;
  records: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public angFire: AngularFire, public viewCtrl: ViewController) {
    this.records = angFire.database.list('/usuarios');

    this.records.subscribe(items => {
      var recordsList = [];
      items.forEach(element => {
        recordsList.push(element.name)
      });
      this.loadedRecords = recordsList;
    });
    console.log(this.loadedRecords + 'items')

  }

  initializeItems() {
    this.loadedRecordsList = this.loadedRecords;
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.loadedRecordsList = this.loadedRecords.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  selectRecord(record) {
    //si no esta vacia checa duplicado
    if (this.selectedBrothersList.length > 0) {
      if (this.selectedBrothersList.indexOf(record) == -1) {
        this.selectedBrothersList.push(record);
      }
    } else {
      //si esta vacia agrega el primer objeto
      this.selectedBrothersList.push(record);
    }
  }
  unselectRecord(record) {
    let index = this.selectedBrothersList.indexOf(record);
    this.selectedBrothersList.splice(index, 1);
  }
  saveListBrothers() {
    this.brothersListSaved = this.selectedBrothersList
    this.closeModal();
  }
  closeModal() {
    this.viewCtrl.dismiss(this.brothersListSaved);
  }
  ionViewDidLoad() {
    this.initializeItems();
  }
}
