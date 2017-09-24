import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectBrotherPage } from './select-brother';

@NgModule({
    declarations: [
        SelectBrotherPage,
    ],
    imports: [
        IonicPageModule.forChild(SelectBrotherPage),
    ],
    exports: [
        SelectBrotherPage
    ]
})
export class SelectBrotherPageModule { }