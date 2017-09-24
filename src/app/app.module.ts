import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { CallNumber } from '@ionic-native/call-number';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
//import { AddRecordPage } from '../pages/add-record/add-record';
//import { EditRecordPage } from '../pages/edit-record/edit-record';
//import { ShowRecordPage } from '../pages/show-record/show-record';
// import { ShowHistoryPage } from '../pages/show-history/show-history';
//import { ShowInfoPage } from '../pages/show-info/show-info';
import { ShowPicturePage } from '../pages/show-picture/show-picture';
//import { SelectBrotherPage } from '../pages/select-brother/select-brother'

import { AngularFireModule } from 'angularfire2';
import { PopoverComponent } from '../components/popover/popover';
import { ReversePipe } from '../pipes/reverse/reverse';


export const config = {
  /** production config **/

  // apiKey: "AIzaSyB3jqHAJ-6qVsM56FHKHzQJBFknl9Ip8Gg",
  // authDomain: "capernaum2k17-c0107.firebaseapp.com",
  // databaseURL: "https://capernaum2k17-c0107.firebaseio.com",
  // projectId: "capernaum2k17-c0107",
  // storageBucket: "capernaum2k17-c0107.appspot.com",
  // messagingSenderId: "801496423905"

  /**test config**/
  
  apiKey: "AIzaSyC61GcSW-ddNn_Ve2L5RKrPw8ENtPXiD54",
  authDomain: "capernaum-test.firebaseapp.com",
  databaseURL: "https://capernaum-test.firebaseio.com",
  projectId: "capernaum-test",
  storageBucket: "capernaum-test.appspot.com",
  messagingSenderId: "181962149399"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    //AddRecordPage,
    //EditRecordPage,
    //ShowRecordPage,
    // ShowHistoryPage,
    //ShowInfoPage,
    ShowPicturePage,
    //SelectBrotherPage,
    PopoverComponent,
    ReversePipe,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    //AddRecordPage,
    //EditRecordPage,
    //ShowRecordPage,
    //ShowInfoPage,
    // ShowHistoryPage,
    ShowPicturePage,
    //SelectBrotherPage,
    PopoverComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    CallNumber,
    AndroidFullScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
