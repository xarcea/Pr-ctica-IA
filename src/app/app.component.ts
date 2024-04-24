import { Component } from '@angular/core';
import { SharedStringService } from './shared-string.service';
import { Subscription } from 'rxjs';
import { ComunicacionService } from './comunicacion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'laberinto';
  mostrar = false;
  mensajeManual = '';
  mensajeAgente = '';
  mensajeTerreno = '';
  sharedStringSubscriptionManual: Subscription;
  sharedStringSubscriptionAgente: Subscription;
  sharedStringSubscriptionTerreno: Subscription;


  constructor(private sharedStringService: SharedStringService, private comunicacionService: ComunicacionService) {
    this.sharedStringSubscriptionManual = this.sharedStringService.sharedStringManual$.subscribe(value => {
      this.mensajeManual = value;
    });

    this.sharedStringSubscriptionAgente = this.sharedStringService.sharedStringAgente$.subscribe(value => {
      this.mensajeAgente = value;
    });

    this.sharedStringSubscriptionTerreno = this.sharedStringService.sharedStringTerreno$.subscribe(value => {
      this.mensajeTerreno = value;
    });

    this.comunicacionService.botonClicAgente$.subscribe(() => {
      this.mostrar = true;
    });
  }
}
