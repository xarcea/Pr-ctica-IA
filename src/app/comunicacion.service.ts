import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {

  private botonClic = new Subject<void>();
  private botonClicAgente = new Subject<void>();

  botonClic$ = this.botonClic.asObservable();

  clicEnBoton() {
    this.botonClic.next();
  }
}
