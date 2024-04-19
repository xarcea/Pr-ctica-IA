import { Component, Input } from '@angular/core';
import { ComunicacionService } from '../comunicacion.service';

@Component({
  selector: 'app-boton-sin-input',
  templateUrl: './boton-sin-input.component.html',
  styleUrls: ['./boton-sin-input.component.css']
})
export class BotonSinInputComponent {
  @Input() texto: string = 'Predeterminado';

  constructor(private comunicacionService: ComunicacionService) {}

  clicEnBoton() {
    this.comunicacionService.clicEnBoton();
  }
}
