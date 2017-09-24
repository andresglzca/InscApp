import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowRecordPage } from './show-record';

@NgModule({
    declarations: [
        ShowRecordPage,
    ],
    imports: [
        IonicPageModule.forChild(ShowRecordPage),
    ],
    exports: [
        ShowRecordPage
    ]
})
export class ShowRecordPageModule { }