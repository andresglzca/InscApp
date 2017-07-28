import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Camera, CameraOptions } from '@ionic-native/camera';

import * as firebase from 'firebase'

import moment from 'moment';


export class customValidator {
  static max(max: number) {
    return (control: FormGroup) => {
      // console.log('max' + (parseInt(control.value) <= max));

      let valid = parseInt(control.value) <= max;

      return valid ? null : {
        max: {
          valid: false,
          invalid: true
        }
      }
    }

  }
}

@Component({
  selector: 'page-add-record',
  templateUrl: 'add-record.html',
})
export class AddRecordPage {

  storageRef = firebase.storage().ref();
  image; Url: any;

  records; history: FirebaseListObservable<any>;
  price; photo: any;
  public base64Image: string;
  private data: FormGroup;
  array = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams, public viewCtrl: ViewController,
    public angFire: AngularFire, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, public formBuilder: FormBuilder, public camera: Camera) {

    this.records = angFire.database.list('/usuarios');
    this.history = angFire.database.list('/history');
    this.price = this.navParams.get('price');
    var price = this.price;
    this.data = this.formBuilder.group({
      gender: ['', Validators.required],
      name: ['', Validators.required],
      birthdate: ['', Validators.required],
      parent: ['', Validators.required],
      contact: ['', Validators.required],
      staff: ['', Validators.required],
      description: [''],
      payment: ['', customValidator.max(price)],
      paymentstatus: [''],
      registrationdate: [''],
      photURL: [''],
      'history': {
        'action': '',
        'staff': '',
        'date': '',
        'user': ''
      }
    });

    this.data.controls['staff'].setValue(window.localStorage.getItem("CurrentUser"));
    this.data.controls['registrationdate'].setValue(moment().format("DD/MM/YYYY"));


  }
  public getCurrentUser(){
    var currentUser = window.localStorage.getItem("CurrentUser");
    return currentUser;
  }

  takePic() {
    const options: CameraOptions = {
      quality: 90,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      //targetWidth: 200,
      //targetHeight: 200,
      mediaType: 0,
      cameraDirection: 1,
    }


    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:

      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.image = imageData;
      this.photo = this.base64Image;

    }, (err) => {
      console.log(err);
    });

  }


  paymentStatus(): string {
    let control = Number(this.data.controls['payment'].value);
    let price = Number(this.price);
    if (control == price) {
      return "paid";
    } else if (control > 0 && control < price) {
      return "pending";
    } else {
      return "unpaid";
    }

  }

  validate(): boolean {

    let control = this.data.controls['payment'];
    if (!control.value) {
      control.setValue(0);
    }
    if (this.data.valid) {
      return true
    }
    let errorMsg = '';
    if (!control.valid) {
      errorMsg = 'El monto máximo a ingresar debe ser $' + this.price;
    }

    let alert = this.alertCtrl.create({
      title: 'Algo anda mal!',
      subTitle: errorMsg || 'Los campos marcados *, son obligatorios',
      buttons: ['OK']
    })

    alert.present();

    return false;

  }

  submit(): void {

    if (this.validate()) {
      this.data.controls['paymentstatus'].setValue(this.paymentStatus());
      var dateFormated = moment(this.data.controls['birthdate'].value, 'YYYY-MM-DD').format('DD/MM/YYYY');
      this.data.controls['birthdate'].setValue(dateFormated);

      //add data to history
      moment.locale('es_MX')
      let historyData = {
        action: 'agregó',
        staff: this.getCurrentUser(),
        date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
        user: this.data.controls['name'].value
      }
        
      this.data.value.history.action = 'agregó';
      this.data.value.history.staff = window.localStorage.getItem("CurrentUser");
      this.data.value.history.date = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
      this.data.value.history.user = this.data.controls['name'].value;


      // saving data loader
      let loader = this.loadingCtrl.create({
        content: "Agregando ...",
      });

      if (this.image) {
        let taskUpload = this.storageRef.child('users/' + this.data.controls['name'].value + ".jpg").putString(this.image, 'base64');
        loader.present();
        taskUpload.then(() => {
          this.storageRef.child('users/' + this.data.controls['name'].value + ".jpg").getDownloadURL().then(url => {
            this.Url = url;
            this.data.controls['photURL'].setValue(this.Url);
            const pushRecord = this.records.push(this.data.value);
            pushRecord
              .then(_ => loader.dismiss())
              .then(_ => this.closeModal())
              .catch(err => console.log(err, 'You dont have access!'));
          })
          const pushHistory = this.history.push(historyData);
        }, (err) => {
          alert(err)
          this.closeModal();
          console.log(err);
        })

      } else {
        //saving data action
        const pushRecord = this.records.push(this.data.value);
        loader.present();
        pushRecord
          .then(_ => loader.dismiss())
          .then(_ => this.closeModal())
          .catch(err => console.log(err, 'You dont have access!'));
      const pushHistory = this.history.push(historyData);
      }
    }


  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRecordPage');
  }

}
