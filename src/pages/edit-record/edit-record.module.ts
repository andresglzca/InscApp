import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditRecordPage } from './edit-record';

@NgModule({
    declarations: [
        EditRecordPage,
    ],
    imports: [
        IonicPageModule.forChild(EditRecordPage),
    ],
    exports: [
        EditRecordPage
    ]
})
export class EditRecordPageeModule { }