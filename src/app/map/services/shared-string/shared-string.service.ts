import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedStringService {
  
  private sharedStringSourceManual = new BehaviorSubject<string>('');
  sharedStringManual$ = this.sharedStringSourceManual.asObservable();

  private sharedStringSourceAgente = new BehaviorSubject<string>('');
  sharedStringAgente$ = this.sharedStringSourceAgente.asObservable();

  private sharedStringSourceTerreno = new BehaviorSubject<string>('');
  sharedStringTerreno$ = this.sharedStringSourceTerreno.asObservable();

  constructor() { }

  setSharedStringManual(value: string) {
    this.sharedStringSourceManual.next(value);
  }

  setSharedStringAgente(value: string) {
    this.sharedStringSourceAgente.next(value);
  }

  setSharedStringTerreno(value: string) {
    this.sharedStringSourceTerreno.next(value);
  }
}
