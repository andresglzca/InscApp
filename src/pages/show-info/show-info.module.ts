import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowInfoPage } from './show-info';

@NgModule({
    declarations: [
        ShowInfoPage,
    ],
    imports: [
        IonicPageModule.forChild(ShowInfoPage),
    ],
    exports: [
        ShowInfoPage
    ]
})
export class ShowInfoPageModule { }