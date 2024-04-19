import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TablaComponent } from './tabla/tabla.component';
import { BotonComponent } from './boton/boton.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MensajeComponent } from './mensaje/mensaje.component';
import { BotonSinInputComponent } from './boton-sin-input/boton-sin-input.component';

@NgModule({
  declarations: [
    AppComponent,
    TablaComponent,
    BotonComponent,
    MensajeComponent,
    BotonSinInputComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
