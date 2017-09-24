import { Component } from '@angular/core';
import { IonicPage ,NavController, NavParams, ViewController, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { SelectBrotherPage } from '../select-brother/select-brother';
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

@IonicPage()
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
  brothersListSaved: any;
  counter: number;



  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
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
      shirtSize: ['', Validators.required],
      church: [''],
      parent: ['', Validators.required],
      contact: ['', Validators.required],
      staff: ['', Validators.required],
      description: [''],
      payment: ['', customValidator.max(price)],
      paymentstatus: [''],
      registrationdate: [''],
      photURL: [''],
      'hermanos': {

      }
    });

    this.data.controls['staff'].setValue(window.localStorage.getItem("CurrentUser"));
    this.data.controls['registrationdate'].setValue(moment().format("DD/MM/YYYY"));


  }
  public getCurrentUser() {
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

  addBrothers() {
    let modal = this.modalCtrl.create(SelectBrotherPage);

    modal.onDidDismiss((brotherListSaved) => {
      this.brothersListSaved = brotherListSaved;

    });
    modal.present();

  }

  // streamBrothers(brotherName){

  //   this.brothersListSaved.forEach(name => {

  //     this.records = this.angFire.database.list('/usuarios', {
  //       query: {
  //         orderByChild: 'name',
  //         equalTo: name
  //       }
  //     });

  //     this.records.subscribe(items =>{
  //       var key = items[0].$key
  //       this.records.update(key, { hermanos:this.data.controls.hermanos.value})
  //     })

  //   });

  // }

  checkDuplicates(name: string) {
    var isDuplicate = true;
    this.records.subscribe(items => {
      items.forEach(element => {
        var cName: string = element.name
        cName = cName.replace(/[\s]/g, '');
        name = name.replace(/[\s]/g, '');
        cName = cName.toString().toUpperCase();
        name = name.toString().toUpperCase();
        if (cName == name) {
          isDuplicate = false;
        }
      });
    });
    return isDuplicate
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


    if (this.validate() && this.checkDuplicates(this.data.controls.name.value)) {
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

      // this.data.value.history.action = 'agregó';
      // this.data.value.history.staff = window.localStorage.getItem("CurrentUser");
      // this.data.value.history.date = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
      // this.data.value.history.user = this.data.controls['name'].value;


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
            if (this.brothersListSaved) {
              this.data.controls['hermanos'].setValue(this.brothersListSaved)
            }
            const pushRecord = this.records.push(this.data.value);
            pushRecord
              // .then(_ => this.streamBrothers(this.data.controls.name.value) )
              .then(_ => {
                loader.dismiss()
                this.history.push(historyData)
                if (this.data.controls.payment.value) {
                  let historyDataPayment = {
                    action: 'abonó $' + this.data.controls.payment.value,
                    staff: this.getCurrentUser(),
                    date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
                    user: this.data.controls.name.value
                  };
                  this.history.push(historyDataPayment)
                };
                this.closeModal();
              })
              .catch(err => console.log(err, 'You dont have access!'));
          })

        }, (err) => {
          alert(err)
          this.closeModal();
          console.log(err);
        })

      } else {
        //saving data action
        if (this.brothersListSaved) {
          this.data.controls['hermanos'].setValue(this.brothersListSaved)
        }
        const pushRecord = this.records.push(this.data.value);
        loader.present();
        pushRecord
          // .then(_ => this.streamBrothers(this.data.controls.name.value))
          .then(_ => {
            loader.dismiss()
            this.history.push(historyData)
            if (this.data.controls.payment.value) {
              let historyDataPayment = {
                action: 'abonó $' + this.data.controls.payment.value,
                staff: this.getCurrentUser(),
                date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
                user: this.data.controls.name.value
              };
              this.history.push(historyDataPayment)
            };
            this.closeModal();
          })
          .catch(err => console.log(err, 'You dont have access!'));
      }
    } else {

      this.alertCtrl.create({
        title: 'Algo anda mal!',
        subTitle: 'Al parecer este Campero ya se inscribio',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.closeModal();
          }
        }]
      }).present();
    }


  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {

  }

}
