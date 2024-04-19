import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TablaService } from '../tabla.service';
import { SharedStringService } from '../shared-string.service';
import { ComunicacionService } from '../comunicacion.service';
import { Observable, interval, map } from 'rxjs';


@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent {

  data: any[][] = [];
  ruta = 'assets/datos.txt';
  columns: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
  rows: number[] = Array.from({ length: 15 }, (_, index) => index + 1);
  letras: string[][] = [];
  flag: boolean = false;
  filaActual: number = -1;
  columnaActual: number = -1;
  opcionesDisponibles = 0;
  numeroPasos: number = 0;
  visited: boolean[][] = Array.from({ length: 15 }, (_) => Array.from({ length: 15 }, (_) => false));
  
  constructor(private http: HttpClient, private tablaService: TablaService, private stringService: SharedStringService,
    private comunicacionService: ComunicacionService) { 
      this.comunicacionService.botonClic$.subscribe(() => {
        this.iniciarJuegoManual();
      });
    }

  ngOnInit(): void {
    this.letras = Array.from({ length: 15 }, (_) => Array.from({ length: 15 }, (_) => ''));
    this.loadData();
    this.suscribir();
  }

  loadData() {
    this.http.get(this.ruta, { responseType: 'text' })
      .subscribe(response => {
        this.data = response.split('\n').map(row => row.split(',').map(Number));
      });
  }

  suscribir() {
    this.tablaService.coordenadas$.subscribe(coordenadas => {
      const c: any[] = coordenadas.split(',');
      const columna = c.length >= 2 ? c[1].charCodeAt(0) - 'A'.charCodeAt(0) : -1;
      const fila = Number(c[0]) - 1;

      switch (c[c.length - 1]) {
        case 'primero':
          this.limpiar('I');
          this.letras[fila][columna] = 'I';
          this.visited[fila][columna] = true;
          break;
        case 'segundo':
          this.limpiar('F');
          this.letras[fila][columna] = 'F';
          this.visited[fila][columna] = true;
          break;
        case 'tercero':
          this.data[fila][columna] = Number(c[2]);
          break;
        case 'cuarto':
          let terreno: string = '';
          if(this.data[fila][columna] === 0)
            terreno = 'Wall';
          else
            terreno = 'Road';
            this.stringService.setSharedString(terreno);
            setTimeout(() => {
              this.stringService.setSharedString('');
            }, 3000);
          break;
      }
    });
  }

  limpiar(letra: string) {
    this.letras.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === letra) {
          this.letras[i][j] = '';
        }
      });
    });
  }

  iniciarJuegoManual() {

    this.letras.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 'I') {
          this.filaActual = i;
          this.columnaActual = j;
        }
      });
    });

    this.letras[this.filaActual][this.columnaActual] += ',X';
    this.flag = true;
    this.actualizarVista();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(this.flag){
      switch(event.key) {
        case 'ArrowUp':
          this.moverArriba();
          break;
        case 'ArrowDown':
          this.moverAbajo();
          break;
        case 'ArrowLeft':
          this.moverIzquierda();
          break;
        case 'ArrowRight':
          this.moverDerecha();
          break;
      }
    }
  }

  moverArriba() {
    if (this.filaActual > 0 && this.data[this.filaActual - 1][this.columnaActual] !== 0
      && !this.letras[this.filaActual-1][this.columnaActual].includes('V')) {

      this.numeroPasos++;
      
      this.coprobarOpcionesDisponibles();

      let cellValue = this.letras[this.filaActual][this.columnaActual];
      cellValue = cellValue.replace(/,?X,?/g, '');
      let nuevaLetra = cellValue === 'V' || cellValue === '' ? 'V' : cellValue + ',V';

      if(this.opcionesDisponibles > 1){
        nuevaLetra += ',O';
      }
      
      this.letras[this.filaActual][this.columnaActual] = nuevaLetra;
      this.filaActual--;
      if(this.letras[this.filaActual][this.columnaActual] == 'F'){
        this.flag = false;
        this.letras[this.filaActual][this.columnaActual] += ',X';
        this.stringService.setSharedString('Número de pasos: ' + this.numeroPasos);
      }
      else
        this.letras[this.filaActual][this.columnaActual] = 'X';
      this.actualizarVista();
    }
  }

  moverAbajo() {
    if (this.filaActual < this.data.length - 1 && this.data[this.filaActual + 1][this.columnaActual] !== 0
      && !this.letras[this.filaActual+1][this.columnaActual].includes('V')) {

      this.numeroPasos++;
            
      this.coprobarOpcionesDisponibles();

      let cellValue = this.letras[this.filaActual][this.columnaActual];
      cellValue = cellValue.replace(/,?X,?/g, '');
      let nuevaLetra = cellValue === 'V' || cellValue === '' ? 'V' : cellValue + ',V';

      if(this.opcionesDisponibles > 1){
        nuevaLetra += ',O';
      }
      
      this.letras[this.filaActual][this.columnaActual] = nuevaLetra;
      this.filaActual++;
      if(this.letras[this.filaActual][this.columnaActual] == 'F'){
        this.flag = false;
        this.letras[this.filaActual][this.columnaActual] += ',X';
        this.stringService.setSharedString('Número de pasos: ' + this.numeroPasos);
      }
      else
        this.letras[this.filaActual][this.columnaActual] = 'X';
      this.actualizarVista();
    }
  }

  moverIzquierda() {
    if (this.columnaActual > 0 && this.data[this.filaActual][this.columnaActual - 1] !== 0
      && !this.letras[this.filaActual][this.columnaActual-1].includes('V')) {

      this.numeroPasos++;

      this.coprobarOpcionesDisponibles();

      let cellValue = this.letras[this.filaActual][this.columnaActual];
      cellValue = cellValue.replace(/,?X,?/g, '');
      let nuevaLetra = cellValue === 'V' || cellValue === '' ? 'V' : cellValue + ',V';

      if(this.opcionesDisponibles > 1){
        nuevaLetra += ',O';
      }
      
      this.letras[this.filaActual][this.columnaActual] = nuevaLetra;
      this.columnaActual--;
      if(this.letras[this.filaActual][this.columnaActual] == 'F'){
        this.flag = false;
        this.letras[this.filaActual][this.columnaActual] += ',X';
        this.stringService.setSharedString('Número de pasos: ' + this.numeroPasos);
      }
      else
        this.letras[this.filaActual][this.columnaActual] = 'X';
      this.actualizarVista();
    }
  }

  moverDerecha() {
    if (this.columnaActual < this.data[0].length - 1 && this.data[this.filaActual][this.columnaActual + 1] !== 0
      && !this.letras[this.filaActual][this.columnaActual+1].includes('V')) {

      this.numeroPasos++;
      
      this.coprobarOpcionesDisponibles();

      let cellValue = this.letras[this.filaActual][this.columnaActual];
      cellValue = cellValue.replace(/,?X,?/g, '');
      let nuevaLetra = cellValue === 'V' || cellValue === '' ? 'V' : cellValue + ',V';

      if(this.opcionesDisponibles > 1){
        nuevaLetra += ',O';
      }
      
      this.letras[this.filaActual][this.columnaActual] = nuevaLetra;
      this.columnaActual++;
      if(this.letras[this.filaActual][this.columnaActual] == 'F'){
        this.flag = false;
        this.letras[this.filaActual][this.columnaActual] += ',X';
        this.stringService.setSharedString('Número de pasos: ' + this.numeroPasos);
      }
      else
        this.letras[this.filaActual][this.columnaActual] = 'X';
      this.actualizarVista();
    }
  }

  coprobarOpcionesDisponibles() {
    this.opcionesDisponibles = 0;

    if (this.filaActual > 0 && this.data[this.filaActual - 1][this.columnaActual] !== 0 
      && !this.letras[this.filaActual - 1][this.columnaActual].includes('V')) {
      this.opcionesDisponibles++;
    }

    if (this.filaActual < this.data.length - 1 && this.data[this.filaActual + 1][this.columnaActual] !== 0 
      && !this.letras[this.filaActual + 1][this.columnaActual].includes('V')) {
      this.opcionesDisponibles++;
    }
    if (this.columnaActual > 0 && this.data[this.filaActual][this.columnaActual - 1] !== 0 
      && !this.letras[this.filaActual][this.columnaActual - 1].includes('V')) {
      this.opcionesDisponibles++;
    }
    if (this.columnaActual < this.data[0].length - 1 && this.data[this.filaActual][this.columnaActual + 1] !== 0 
      && !this.letras[this.filaActual][this.columnaActual + 1].includes('V')) {
      this.opcionesDisponibles++;
    }
  }

  actualizarVista() {
    this.visited[this.filaActual][this.columnaActual] = true;

    if(this.filaActual > 0)
      this.visited[this.filaActual - 1][this.columnaActual] = true;

    if(this.filaActual < 14)
      this.visited[this.filaActual + 1][this.columnaActual] = true;

    if(this.columnaActual > 0)
      this.visited[this.filaActual][this.columnaActual - 1] = true;

    if(this.columnaActual < 14)
      this.visited[this.filaActual][this.columnaActual + 1] = true;
  }
}
