import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TablaService {

  private coordenadasSubject = new BehaviorSubject<string>('');

  coordenadas$ = this.coordenadasSubject.asObservable();

  actualizarTabla(coordenadas: string) {
    this.coordenadasSubject.next(coordenadas);
  }
}
