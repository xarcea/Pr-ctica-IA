import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TablaService } from '../../services/table/tabla.service';
import { SharedStringService } from '../../services/shared-string/shared-string.service';
import { ComunicacionService } from '../../services/comunication/comunicacion.service';
import { ArbolService } from '../../services/tree-generation/arbol.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css'],
})
export class TablaComponent {
  data: any[][] = [];
  ruta = 'assets/datos.txt';
  columns: string[] = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
  ];
  rows: number[] = Array.from({ length: 15 }, (_, index) => index + 1);
  letras: string[][] = [];
  flag: boolean = false;
  filaActual: number = -1;
  columnaActual: number = -1;
  opcionesDisponibles = 0;
  numeroPasos: number = 0;
  visited: boolean[][] = Array.from({ length: 15 }, (_) =>
    Array.from({ length: 15 }, (_) => false)
  );
  prioridad: any = [];
  opciones: any = [];
  pila: any[] = [];
  recorrido: any[] = [];
  lado = '';

  constructor(
    private http: HttpClient,
    private tablaService: TablaService,
    private stringService: SharedStringService,
    private comunicacionService: ComunicacionService,
    private arbolService: ArbolService
  ) {
    this.comunicacionService.botonClic$.subscribe(() => {
      this.iniciarJuegoManual();
    });
    this.comunicacionService.botonClicIniciar$.subscribe(() => {
      this.iniciarJuegoAutomático();
    });
  }

  ngOnInit(): void {
    this.letras = Array.from({ length: 15 }, (_) =>
      Array.from({ length: 15 }, (_) => '')
    );
    this.loadData();
    this.suscribir();
  }

  loadData() {
    this.http.get(this.ruta, { responseType: 'text' }).subscribe((response) => {
      this.data = response.split('\n').map((row) => row.split(',').map(Number));
    });
  }

  suscribir() {
    this.tablaService.coordenadas$.subscribe((coordenadas) => {
      const c: any[] = coordenadas.split(',');
      const columna =
        c.length >= 2 ? c[1].charCodeAt(0) - 'A'.charCodeAt(0) : -1;
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
          if (this.data[fila][columna] === 0) terreno = 'Wall';
          else terreno = 'Road';
          this.stringService.setSharedStringTerreno(terreno);
          setTimeout(() => {
            this.stringService.setSharedStringTerreno('');
          }, 3000);
          break;
        case 'quinto':
          const letrasRegex = /\[([^\]]*)\]/;
          const match = coordenadas.match(letrasRegex);
          if (match && match[1]) {
            const letrasArray = match[1].split(',');
            this.prioridad = letrasArray;
          }
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
    if (this.flag) {
      switch (event.key) {
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
    if (
      this.filaActual > 0 &&
      this.data[this.filaActual - 1][this.columnaActual] !== 0 &&
      !this.letras[this.filaActual - 1][this.columnaActual].includes('V')
    ) {
      this.numeroPasos++;

      this.coprobarOpcionesDisponibles();

      let cellValue = this.letras[this.filaActual][this.columnaActual];
      cellValue = cellValue.replace(/,?X,?/g, '');
      let nuevaLetra = cellValue;
      if (!cellValue.includes('V'))
        nuevaLetra =
          cellValue === 'V' || cellValue === '' ? 'V' : cellValue + ',V';

      if (this.opcionesDisponibles > 1) {
        const coordenadas = { x: this.filaActual, y: this.columnaActual };
        if (
          !this.pila.some(
            (item) => item.x === coordenadas.x && item.y === coordenadas.y
          )
        ) {
          this.pila.push(coordenadas);
        }
        if (!cellValue.includes('O')) nuevaLetra += ',O';
      }

      this.letras[this.filaActual][this.columnaActual] = nuevaLetra;
      this.filaActual--;
      if (this.letras[this.filaActual][this.columnaActual] == 'F') {
        this.flag = false;
        this.letras[this.filaActual][this.columnaActual] += ',X';
        this.stringService.setSharedStringManual(
          'Número de pasos: ' + this.numeroPasos
        );
        this.stringService.setSharedStringAgente(
          'Número de pasos: ' + this.numeroPasos
        );
      } else this.letras[this.filaActual][this.columnaActual] = 'X';
      this.actualizarVista();
      this.agregarRecorrido();
    }
  }

  moverAbajo() {
    if (
      this.filaActual < this.data.length - 1 &&
      this.data[this.filaActual + 1][this.columnaActual] !== 0 &&
      !this.letras[this.filaActual + 1][this.columnaActual].includes('V')
    ) {
      this.numeroPasos++;

      this.coprobarOpcionesDisponibles();

      let cellValue = this.letras[this.filaActual][this.columnaActual];
      cellValue = cellValue.replace(/,?X,?/g, '');
      let nuevaLetra = cellValue;
      if (!cellValue.includes('V'))
        nuevaLetra =
          cellValue === 'V' || cellValue === '' ? 'V' : cellValue + ',V';

      if (this.opcionesDisponibles > 1) {
        const coordenadas = { x: this.filaActual, y: this.columnaActual };
        if (
          !this.pila.some(
            (item) => item.x === coordenadas.x && item.y === coordenadas.y
          )
        ) {
          this.pila.push(coordenadas);
        }
        if (!cellValue.includes('O')) nuevaLetra += ',O';
      }

      this.letras[this.filaActual][this.columnaActual] = nuevaLetra;
      this.filaActual++;
      if (this.letras[this.filaActual][this.columnaActual] == 'F') {
        this.flag = false;
        this.letras[this.filaActual][this.columnaActual] += ',X';
        this.stringService.setSharedStringManual(
          'Número de pasos: ' + this.numeroPasos
        );
        this.stringService.setSharedStringAgente(
          'Número de pasos: ' + this.numeroPasos
        );
      } else this.letras[this.filaActual][this.columnaActual] = 'X';
      this.actualizarVista();
      this.agregarRecorrido();
    }
  }

  moverIzquierda() {
    if (
      this.columnaActual > 0 &&
      this.data[this.filaActual][this.columnaActual - 1] !== 0 &&
      !this.letras[this.filaActual][this.columnaActual - 1].includes('V')
    ) {
      this.numeroPasos++;

      this.coprobarOpcionesDisponibles();

      let cellValue = this.letras[this.filaActual][this.columnaActual];
      cellValue = cellValue.replace(/,?X,?/g, '');
      let nuevaLetra = cellValue;
      if (!cellValue.includes('V'))
        nuevaLetra =
          cellValue === 'V' || cellValue === '' ? 'V' : cellValue + ',V';

      if (this.opcionesDisponibles > 1) {
        const coordenadas = { x: this.filaActual, y: this.columnaActual };
        if (
          !this.pila.some(
            (item) => item.x === coordenadas.x && item.y === coordenadas.y
          )
        ) {
          this.pila.push(coordenadas);
        }
        if (!cellValue.includes('O')) nuevaLetra += ',O';
      }

      this.letras[this.filaActual][this.columnaActual] = nuevaLetra;
      this.columnaActual--;
      if (this.letras[this.filaActual][this.columnaActual] == 'F') {
        this.flag = false;
        this.letras[this.filaActual][this.columnaActual] += ',X';
        this.stringService.setSharedStringManual(
          'Número de pasos: ' + this.numeroPasos
        );
        this.stringService.setSharedStringAgente(
          'Número de pasos: ' + this.numeroPasos
        );
      } else this.letras[this.filaActual][this.columnaActual] = 'X';
      this.actualizarVista();
      this.agregarRecorrido();
    }
  }

  moverDerecha() {
    if (
      this.columnaActual < this.data[0].length - 1 &&
      this.data[this.filaActual][this.columnaActual + 1] !== 0 &&
      !this.letras[this.filaActual][this.columnaActual + 1].includes('V')
    ) {
      this.numeroPasos++;

      this.coprobarOpcionesDisponibles();

      let cellValue = this.letras[this.filaActual][this.columnaActual];
      cellValue = cellValue.replace(/,?X,?/g, '');
      let nuevaLetra = cellValue;
      if (!cellValue.includes('V'))
        nuevaLetra =
          cellValue === 'V' || cellValue === '' ? 'V' : cellValue + ',V';

      if (this.opcionesDisponibles > 1) {
        const coordenadas = { x: this.filaActual, y: this.columnaActual };
        if (
          !this.pila.some(
            (item) => item.x === coordenadas.x && item.y === coordenadas.y
          )
        ) {
          this.pila.push(coordenadas);
        }
        if (!cellValue.includes('O')) nuevaLetra += ',O';
      }

      this.letras[this.filaActual][this.columnaActual] = nuevaLetra;
      this.columnaActual++;
      if (this.letras[this.filaActual][this.columnaActual] == 'F') {
        this.flag = false;
        this.letras[this.filaActual][this.columnaActual] += ',X';
        this.stringService.setSharedStringManual(
          'Número de pasos: ' + this.numeroPasos
        );
        this.stringService.setSharedStringAgente(
          'Número de pasos: ' + this.numeroPasos
        );
      } else this.letras[this.filaActual][this.columnaActual] = 'X';
      this.actualizarVista();
      this.agregarRecorrido();
    }
  }

  coprobarOpcionesDisponibles() {
    this.opcionesDisponibles = 0;
    this.opciones = [];

    if (
      this.filaActual > 0 &&
      this.data[this.filaActual - 1][this.columnaActual] !== 0
    ) {
      if (!this.letras[this.filaActual - 1][this.columnaActual].includes('V')) {
        this.opcionesDisponibles++;
        this.opciones.push('A');
      }
    }
    if (
      this.filaActual < this.data.length - 1 &&
      this.data[this.filaActual + 1][this.columnaActual] !== 0
    ) {
      if (!this.letras[this.filaActual + 1][this.columnaActual].includes('V')) {
        this.opcionesDisponibles++;
        this.opciones.push('B');
      }
    }
    if (
      this.columnaActual > 0 &&
      this.data[this.filaActual][this.columnaActual - 1] !== 0
    ) {
      if (!this.letras[this.filaActual][this.columnaActual - 1].includes('V')) {
        this.opcionesDisponibles++;
        this.opciones.push('I');
      }
    }
    if (
      this.columnaActual < this.data[0].length - 1 &&
      this.data[this.filaActual][this.columnaActual + 1] !== 0
    ) {
      if (!this.letras[this.filaActual][this.columnaActual + 1].includes('V')) {
        this.opcionesDisponibles++;
        this.opciones.push('D');
      }
    }
  }

  actualizarVista() {
    this.visited[this.filaActual][this.columnaActual] = true;

    if (this.filaActual > 0)
      this.visited[this.filaActual - 1][this.columnaActual] = true;

    if (this.filaActual < 14)
      this.visited[this.filaActual + 1][this.columnaActual] = true;

    if (this.columnaActual > 0)
      this.visited[this.filaActual][this.columnaActual - 1] = true;

    if (this.columnaActual < 14)
      this.visited[this.filaActual][this.columnaActual + 1] = true;
  }

  iniciarJuegoAutomático() {
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
    this.numeroPasos = 0;
    this.actualizarVista();

    this.agregarRecorrido();

    this.avanzar();

    console.log(this.recorrido);
  }

  async avanzar() {
    while (this.flag) {
      this.coprobarOpcionesDisponibles();
      if (this.opcionesDisponibles == 0) {
        let cellValue = this.letras[this.filaActual][this.columnaActual];
        cellValue = cellValue.replace(/,?X,?/g, '');
        if (!cellValue.includes('V')) {
          let nuevaLetra =
            cellValue === 'V' || cellValue === '' ? 'V' : cellValue + ',V';
          this.letras[this.filaActual][this.columnaActual] = nuevaLetra;
        }

        this.filaActual = this.pila[this.pila.length - 1].x;
        this.columnaActual = this.pila[this.pila.length - 1].y;
        this.letras[this.filaActual][this.columnaActual] += ',X';

        this.coprobarOpcionesDisponibles();
        if (this.opcionesDisponibles == 0) {
          let cellValue = this.letras[this.filaActual][this.columnaActual];
          this.letras[this.filaActual][this.columnaActual] = cellValue.replace(
            /,?X,?/g,
            ''
          );
          this.pila.pop();
        }
        this.agregarRecorrido();
        this.avanzar();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        for (let i = 0; i < this.prioridad.length; i++) {
          if (this.opciones.includes(this.prioridad[i])) {
            if (this.prioridad[i] === 'A') {
              this.moverArriba();
              break;
            } else if (this.prioridad[i] === 'B') {
              this.moverAbajo();
              break;
            } else if (this.prioridad[i] === 'I') {
              this.moverIzquierda();
              break;
            } else if (this.prioridad[i] === 'D') {
              this.moverDerecha();
              break;
            }
          }
        }
      }
    }
  }

  agregarRecorrido() {
    const columna = String.fromCharCode(this.columnaActual + 65);
    const fila = this.filaActual + 1;
    let cellValue = this.letras[this.filaActual][this.columnaActual];
    let coordenadas;
    let cZ;
    let ultimoLado;
    this.coprobarOpcionesDisponibles();
    const stringOpciones: string = JSON.stringify(this.opciones);
    if(cellValue.includes('I')){
      cZ = 1;
      ultimoLado = this.lado;
      this.determinarLado();
    } else if(cellValue.includes('F')){
      cZ = 4;
      ultimoLado = this.lado;
    } else if (this.opcionesDisponibles > 1 || cellValue.includes('O')){
      if(cellValue.includes('O') && this.opcionesDisponibles == 0){
        cZ = 5;
      } else{
        ultimoLado = this.lado;
        this.determinarLado();
        cZ = 2;
      }
    } else if(this.opcionesDisponibles == 0 && !cellValue.includes('O')){
      ultimoLado = this.lado;
      cZ = 3;
    }  else{
      cZ = 0;
    }
    coordenadas = { x: fila, y: columna, z: cZ , opciones: stringOpciones, lado: ultimoLado};
    this.recorrido.push(coordenadas);
    this.arbolService.setCoordinatesArray(this.recorrido);
  }

  determinarLado(){
    for (let i = 0; i < this.prioridad.length; i++) {
      if (this.opciones.includes(this.prioridad[i])) {
        if (this.prioridad[i] === 'A') {
          this.lado = 'A';
          break;
        } else if (this.prioridad[i] === 'B') {
          this.lado = 'B';
          break;
        } else if (this.prioridad[i] === 'I') {
          this.lado = 'I';
          break;
        } else if (this.prioridad[i] === 'D') {
          this.lado = 'D';
          break;
        }
      }
    }
  }
}
