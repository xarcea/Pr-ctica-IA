import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.css']
})
export class MensajeComponent {
  @Input() mensajeTerreno: string = '';
  @Input() mensajeAgente: string = '';
  @Input() mensajeManual: string = '';
}
