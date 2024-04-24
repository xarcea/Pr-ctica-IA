import { Component, Input } from '@angular/core';
import { TablaService } from '../tabla.service';

@Component({
  selector: 'app-boton',
  templateUrl: './boton.component.html',
  styleUrls: ['./boton.component.css']
})
export class BotonComponent {
  @Input() texto: string = 'Predeterminado';

  constructor(private tablaService: TablaService) { }

  onClick(coordenadas: string) {
    switch (this.texto) {
      case 'Establecer punto de inicio':
        coordenadas += ',primero';
        break;
      case 'Establecer punto de fin':
        coordenadas += ',segundo';
        break;
      case 'Cambiar valor de celda':
        coordenadas += ',tercero';
        break;
      case 'Preguntar por el tipo de terreno':
        coordenadas += ',cuarto';
        break;
      case 'Establecer prioridad':
        coordenadas += ',quinto';
        break;
    }
    this.tablaService.actualizarTabla(coordenadas);
  }

  mostrarPlaceholder(): boolean {
    return this.texto === 'Establecer prioridad';
  }
}
