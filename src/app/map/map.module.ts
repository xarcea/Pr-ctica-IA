import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';

import { MainPageComponent } from './pages/main-page/main-page/main-page.component';
import { MensajeComponent } from './components/mensaje/mensaje.component';
import { BotonSinInputComponent } from './components/boton-sin-input/boton-sin-input.component';
import { TreeComponent } from './components/tree/tree.component';
import { TreeNodeComponent } from './components/tree-node/tree-node.component';
import { TreeVisualizationComponent } from './components/tree-visualization/tree-visualization.component';
import { BotonComponent } from './components/boton/boton.component';
import { TablaComponent } from './components/tabla/tabla.component';
import { map } from 'd3';

@NgModule({
  declarations: [
    MainPageComponent,
    MensajeComponent,
    BotonSinInputComponent,
    TreeComponent,
    TreeNodeComponent,
    TreeVisualizationComponent,
    BotonComponent,
    TablaComponent,
  ],
  imports: [CommonModule, MaterialModule],
  exports: [MainPageComponent],
})
export class MapModule {}
