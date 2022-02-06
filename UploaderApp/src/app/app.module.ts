import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UploadComponent } from './components/upload/upload.component';
import { ListComponent } from './components/list/list.component';

import { MaterialModule } from "./modules/material/material.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilesizeconvertPipe } from './filesizeconvert.pipe';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    ListComponent,
    FilesizeconvertPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [FilesizeconvertPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
