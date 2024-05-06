import { Component, HostListener, ViewChild } from '@angular/core';
import { DagreNodesOnlyLayout, GraphComponent } from '@swimlane/ngx-graph';
import { ArbolService } from '../../services/tree-generation/arbol.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
})
export class TreeComponent {

  layoutSettings = { orientation: 'TB' };
  width!: number;
  height!: number;
  @ViewChild('myGraph') myGraph!: GraphComponent;
  recorrido: any[] = [];

  // nodes = [
  //   { id: '2', label: 'Node 2', labelText: 'Texto del nodo 2' },
  //   { id: '3', label: 'Node 3', labelText: 'Texto del nodo 3' },
  //   { id: '1', label: 'Node 1', labelText: 'Texto del nodo 1' },
  //   { id: '4', label: 'Node 4', labelText: 'Texto del nodo 4' },
  //   { id: '5', label: 'Node 5', labelText: 'Texto del nodo 5' }
  // ];

  // links = [
  //   { source: '1', target: '2', labelText: 'Texto del enlace entre nodo 1 y nodo 2' },
  //   { source: '1', target: '3', labelText: 'Texto del enlace entre nodo 1 y nodo 3' },
  //   { source: '2', target: '4', labelText: 'Texto del enlace entre nodo 2 y nodo 4' },
  //   { source: '2', target: '5', labelText: 'Texto del enlace entre nodo 2 y nodo 5' }
  // ];

  nodes: any[] = [];
  links: any[] = [];

  dagreLayout: DagreNodesOnlyLayout = new DagreNodesOnlyLayout();
  
  dataSubscription!: Subscription;

  constructor(private arbolService: ArbolService) {}

  ngOnInit() {
    this.width = window.innerWidth / 2.5;
    this.height = window.innerHeight * 1.1;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.myGraph.center();
      this.myGraph.panTo(100, 350);
    }, 0);
    this.dataSubscription = this.arbolService.treeArray$.subscribe(
      (recorrido) => {
        this.recorrido = recorrido;
        this.buildTreeProfundidad();
      }
    );
  }

  @HostListener('window:resize', ['$event'])

  onResize() {
    this.width = window.innerWidth / 2.5;
    this.height = window.innerHeight * 1.1;
  }

  buildTreeProfundidad() {
    this.nodes = [];
    this.links = [];
    let pila: any[] = [];
    let j = 1;
  
    for (let i = 0; i < this.recorrido.length; i++) {
      let nodoR = this.recorrido[i];
      let nodo = {
        id: j.toString(),
        label: `${nodoR.x},${nodoR.y}`,
        labelText: `${nodoR.x},${nodoR.y}\nA=${nodoR.opciones}`,
        lado: nodoR.lado
      };
      switch (nodoR.z) {
        case 1:
          if (!this.nodes.some(node => node.label === nodo.label)) {
            this.nodes.push(nodo);
            pila.push({ id: '1' });
          } j++;
          break;
        case 2:
        case 3:
        case 4:
          let padre = pila[pila.length - 1];
          if (!this.nodes.some(node => node.label === nodo.label)) {
            this.nodes.push(nodo);
            if(nodoR.z == 2)
              pila.push({ id: j.toString() });
            this.links.push({
              source: padre.id,
              target: j.toString(),
              labelText: nodoR.x + ',' + nodoR.y + '\n' + nodoR.opciones
            });
          } j++;
          break;          
        case 5:
          pila.pop();
          j++;
          break;
      }
    }
  }
}
