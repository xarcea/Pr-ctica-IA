import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComunicacionService } from 'src/app/map/services/comunication/comunicacion.service';
import { SharedStringService } from 'src/app/map/services/shared-string/shared-string.service';
import { ArbolService } from 'src/app/map/services/tree-generation/arbol.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent {
  title = 'laberinto';
  mostrar = false;
  mostrarArbol = false;
  mensajeManual = '';
  mensajeAgente = '';
  mensajeTerreno = '';
  sharedStringSubscriptionManual: Subscription;
  sharedStringSubscriptionAgente: Subscription;
  sharedStringSubscriptionTerreno: Subscription;
  dataSubscription: Subscription;

  constructor( private sharedStringService: SharedStringService, 
    private comunicacionService: ComunicacionService, private arbolService: ArbolService ) {
    this.sharedStringSubscriptionManual =
      this.sharedStringService.sharedStringManual$.subscribe((value) => {
        this.mensajeManual = value;
      });

    this.sharedStringSubscriptionAgente =
      this.sharedStringService.sharedStringAgente$.subscribe((value) => {
        this.mensajeAgente = value;
      });

    this.sharedStringSubscriptionTerreno =
      this.sharedStringService.sharedStringTerreno$.subscribe((value) => {
        this.mensajeTerreno = value;
      });

    this.comunicacionService.botonClicAgente$.subscribe(() => {
      this.mostrar = true;
    });
    
    this.dataSubscription = this.arbolService.treeArray$.subscribe(
      (recorrido) => {
        if(recorrido.length > 0){
          this.mostrarArbol = true;
        }
      }
    );
  }
}
