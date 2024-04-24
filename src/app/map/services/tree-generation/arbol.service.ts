import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArbolService {
  private treeArraySubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  treeArray$: Observable<any[]> = this.treeArraySubject.asObservable();

  constructor() { }

  setCoordinatesArray(coordenadas: any[]) {
    this.treeArraySubject.next(coordenadas);
  }

  getCoordinatesArray(): any[] {
    return this.treeArraySubject.getValue();
  }
}
