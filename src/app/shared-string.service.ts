import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedStringService {
  
  private sharedStringSource = new BehaviorSubject<string>(''); // Inicializamos con un string vacío
  sharedString$ = this.sharedStringSource.asObservable();

  constructor() { }

  setSharedString(value: string) {
    this.sharedStringSource.next(value);
  }
}
