import { Component, HostListener } from '@angular/core';
import { NavController, ModalController, ModalOptions, ToastController, AlertController, PopoverController, LoadingController, ActionSheetController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AddRecordPage } from '../add-record/add-record';
import { EditRecordPage } from '../edit-record/edit-record';
import { ShowRecordPage } from '../show-record/show-record';
import { ShowHistoryPage } from '../show-history/show-history';
import { PopoverComponent } from '../../components/popover/popover';
import * as firebase from 'firebase';

import moment from 'moment';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
@HostListener('window:scroll', [])
export class HomePage {

  records; settings; history; brothers: FirebaseListObservable<any>;
  price; offertDiscount: number;
  paymenStatus; recordname: any;
  scrollw: any;
  empty = true;

  theData: any;



  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public angFire: AngularFire,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController) {

    this.records = angFire.database.list("/usuarios");
    this.settings = angFire.database.list("/settings");
    this.history = angFire.database.list("/history")

    this.settings.subscribe(config => {
      this.price = config[0].price;
      this.offertDiscount = config[0].offertDisccount;
    });

    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Cargando Camperos...'
    });
    loading.present();

    this.records.subscribe(snapshots => {
      if (snapshots == "") {
        this.empty = true;
      } else {
        this.empty = false;
      }
      this.theData = snapshots
      loading.dismissAll();
console.log(this.theData);


    },
      (err) => {
        console.log(err)
      })


  }

  searchItem(ev: any) {
    let val = ev.target.value;

    this.records.subscribe((items) => {
      this.theData = items
    })

    if (val && val.trim() != '') {
     
  

      this.theData = this.theData.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })

      console.log(this.theData + '3');

    }
  }

  public getCurrentUser() {
    var currentUser = window.localStorage.getItem("CurrentUser");
    return currentUser;
  }

  showHistory() {
    this.navCtrl.push(ShowHistoryPage);
  }

  popOver(ev) {
    let popover = this.popoverCtrl.create(PopoverComponent, {

    });
    popover.present({
      ev: ev
    });

  }



  public checkPayment(data, price) {
    if (data == price) {
      this.paymenStatus = "paid";
    } else if (data > 0 && data < price) {
      this.paymenStatus = "pending";
    } else {
      this.paymenStatus = "unpaid";
    }
    return this.paymenStatus
  }

  showRecordPage(key: string, name: string) {
    let data = {
      price: this.price,
      keyRecord: key,
      userName: name
    }
    this.navCtrl.push(ShowRecordPage, data)
  }

  addRecord() {
    let settings = {
      price: this.price,
      offertDiscount: this.offertDiscount
    }
    const myModalOptions: ModalOptions = {
      cssClass: 'miClase',
      showBackdrop: true
    }
    let modal = this.modalCtrl.create(AddRecordPage, settings, myModalOptions);
    modal.present();
  }

  editRecord(key) {
    let data = {
      keyRecord: key
    }

    this.modalCtrl.create(EditRecordPage, data).present();
  }

  disableRecord(key, name) {
    let confirm = this.alertCtrl.create({
      title: 'Deshabilitar campero',
      message: name + ' sera deshabilitado',
      inputs: [
        {
          name: 'description',
          placeholder: 'Explicación',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {

          }
        },
        {
          text: 'OK',
          handler: data => {

            let historyData = {
              action: 'deshabilito a ' + name,
              description: data.description,
              staff: this.getCurrentUser(),
              date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
              user: name
            };

            this.records.update(key, {
              status: "disabled"
            })

            this.history.push(historyData);

            const toast = this.toastCtrl.create({
              message: 'El campero ha sido deshabilitado ☹',
              showCloseButton: true,
              closeButtonText: 'Ok',
              position: 'top'
            });
            toast.present();
          }
        }
      ]

    })
    confirm.present();
  }

  // deleteRecord(key, name) {
  //   let confirm = this.alertCtrl.create({
  //     title: 'Eliminar campero',
  //     message: name + ' sera elimnado',
  //     inputs: [
  //       {
  //         name: 'description',
  //         placeholder: 'Explicación',
  //         type: 'text'
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancelar',
  //         handler: () => {

  //         }
  //       },
  //       {
  //         text: 'OK',
  //         handler: data => {

  //           let historyData = {
  //             action: 'eliminó ' + name,
  //             description: data.description,
  //             staff: this.getCurrentUser(),
  //             date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
  //             user: name
  //           };

  //           this.records.remove(key);

  //           this.history.push(historyData);

  //           const toast = this.toastCtrl.create({
  //             message: 'El campero ha sido elimanado ☹',
  //             showCloseButton: true,
  //             closeButtonText: 'Ok',
  //             position: 'top'
  //           });
  //           toast.present();
  //         }
  //       }
  //     ]

  //   })
  //   confirm.present();
  // }

  checkDisscount(key) {

    var totalhermanos = [];

    this.brothers = this.angFire.database.list('/usuarios/' + key + '/hermanos');

    this.brothers.subscribe(items => {
      var hermanos = [];
      items.forEach(item => {
        hermanos.push(item)
      });
      totalhermanos = hermanos
    })

    return totalhermanos.length
  }

  addPayment(key, payment: number, name) {
    var price = +this.price;
    payment = +payment;
    var debt = price - payment;

    var numHermanos = this.checkDisscount(key)

    if (numHermanos == 2) {
      price = +this.price - this.offertDiscount / 2
      debt = price - payment
    }
    if (numHermanos >= 3) {
      price = +this.price - this.offertDiscount
      debt = price - payment
    }


    console.log(this.checkDisscount(key))

    if (payment >= 0 && payment < price) {
      let addpay = this.alertCtrl.create({
        title: 'Agregar pago',
        message: 'Restan por pagar: $' + debt,
        inputs: [{
          name: 'cantidad',
          placeholder: 'Cantidad',
          type: 'number'
        }],
        buttons: [{
          text: 'Cancelar',
          handler: data => {

          }
        }, {
          text: 'Agregar',
          handler: data => {
            var cantidad = +data.cantidad;
            moment.locale('es_MX')
            let historyData = {
              action: 'abonó $' + cantidad,
              staff: this.getCurrentUser(),
              date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
              user: name
            };

            if (cantidad <= debt) {
              var newpayment = cantidad + payment;
              this.records.update(key, {
                payment: newpayment,
                paymentstatus: this.checkPayment(newpayment, price)
              });

              this.history.push(historyData)
                .then(_ => addpay.dismiss())
                .catch(err => console.log(err));

            } else {
              const err = this.toastCtrl.create({
                message: 'Error: La cantidad que ingresaste es invalida.',
                showCloseButton: true,
                closeButtonText: 'Ok',
                position: 'top'
              });
              err.present();
            }
          }
        }]
      })
      addpay.present();
    } else {
      let alert = this.alertCtrl.create({
        title: 'Hey!',
        subTitle: 'Al parecer los pagos estan completos',
        buttons: ['OK']
      });
      alert.present();

    }
  }
  letter(data: string) {
    var letter = data.charAt(0).toLocaleUpperCase();
    return letter
  }

  showActionSheet(key, name, payment) {
    this.actionSheetCtrl.create({
      title: 'Acciones disponibles',
      buttons: [{
        text: 'Nuevo Pago',
        icon: 'cash',
        handler: () => {
          this.addPayment(key, payment, name)
        }
      }, {
        text: 'Editar',
        icon: 'create',
        handler: () => {
          this.editRecord(key);
          console.log('Editar' + key, name, payment)
        }
      }, {
        text: 'Deshabilitar',
        icon: 'eye-off',
        role: 'destructive',
        handler: () => {
          this.disableRecord(key, name)
          console.log('Deshabilitar' + key, name, payment)
        },
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    }).present();
  }

  scroll() {
    this.scrollw = document.querySelector(".scroll-content").scrollTop

    if (this.scrollw >= 10) {
      document.getElementById('btn-fab').setAttribute('class', 'animated fadeOutRight')
    } else {
      document.getElementById('btn-fab').setAttribute('class', 'animated fadeInRight')
    }

  }
  ionViewDidLoad() {
  }
}
