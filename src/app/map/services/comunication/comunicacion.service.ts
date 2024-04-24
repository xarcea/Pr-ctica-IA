import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {

  private botonClic = new Subject<void>();
  private botonClicAgente = new Subject<void>();
  private botonClicIniciar = new Subject<void>();

  botonClic$ = this.botonClic.asObservable();
  botonClicAgente$ = this.botonClicAgente.asObservable();
  botonClicIniciar$ = this.botonClicIniciar.asObservable();

  clicEnBoton() {
    this.botonClic.next();
  }

  clicEnBotonAgente() {
    this.botonClicAgente.next();
  }

  clicEnBotonIniciar() {
    this.botonClicIniciar.next();
  }
}
