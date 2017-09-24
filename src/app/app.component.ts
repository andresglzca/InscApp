import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public fullscreen: AndroidFullScreen) {
    platform.ready().then(() => {
      var currentUser = window.localStorage.getItem("CurrentUser");
      if (currentUser) {
        this.rootPage = HomePage
      } else {
        this.rootPage = LoginPage
      }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      fullscreen.showUnderStatusBar();
      statusBar.styleBlackTranslucent();
      splashScreen.hide();
    });
  }
}

