import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowHistoryPage } from './show-history';

@NgModule({
    declarations: [
        ShowHistoryPage,
    ],
    imports: [
        IonicPageModule.forChild(ShowHistoryPage),
    ],
    exports: [
        ShowHistoryPage
    ]
})
export class ShowHistoryPageModule { }