import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { MainPageComponent } from './pages/main-page/main-page/main-page.component';
import { MensajeComponent } from './components/mensaje/mensaje.component';
import { BotonSinInputComponent } from './components/boton-sin-input/boton-sin-input.component';
import { TreeComponent } from './components/tree/tree.component';
import { BotonComponent } from './components/boton/boton.component';
import { TablaComponent } from './components/tabla/tabla.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    MainPageComponent,
    MensajeComponent,
    BotonSinInputComponent,
    TreeComponent,
    BotonComponent,
    TablaComponent,
  ],
  imports: [
    CommonModule, 
    MaterialModule,
    NgxGraphModule,
    MatIconModule
  ],
  exports: [MainPageComponent],
})
export class MapModule {}
