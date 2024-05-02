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
  @ViewChild('myGraph') myGraph!: GraphComponent;
  recorrido: any[] = [];

  nodes = [
    { id: '2', label: 'Node 2', labelText: 'Texto del nodo 2' },
    { id: '3', label: 'Node 3', labelText: 'Texto del nodo 3' },
    { id: '1', label: 'Node 1', labelText: 'Texto del nodo 1' },
    { id: '4', label: 'Node 4', labelText: 'Texto del nodo 4' },
    { id: '5', label: 'Node 5', labelText: 'Texto del nodo 5' }
  ];

  links = [
    { source: '1', target: '2', labelText: 'Texto del enlace entre nodo 1 y nodo 2' },
    { source: '1', target: '3', labelText: 'Texto del enlace entre nodo 1 y nodo 3' },
    { source: '2', target: '4', labelText: 'Texto del enlace entre nodo 2 y nodo 4' },
    { source: '2', target: '5', labelText: 'Texto del enlace entre nodo 2 y nodo 5' }
  ];

  dagreLayout: DagreNodesOnlyLayout = new DagreNodesOnlyLayout();
  
  dataSubscription: Subscription;

  constructor(private arbolService: ArbolService ) {
    this.dataSubscription = this.arbolService.treeArray$.subscribe(
      (recorrido) => {
        this.recorrido = recorrido;
        // this.buildTreeProfundidad();
      }
    );
  }

  ngOnInit() {
    this.width = window.innerWidth;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.myGraph.center();
      this.myGraph.panTo(0, 300);
    }, 0);
  }

  @HostListener('window:resize', ['$event'])

  onResize() {
    this.width = window.innerWidth;
  }

  buildTreeProfundidad() {
    this.nodes = [];
    this.links = [];
    this.recorrido.forEach((element: any) => {
      this.nodes.push({ id: element.id, label: element.id, labelText: element.label });
      if (element.left) {
        this.links.push({ source: element.id, target: element.left.id, labelText: element.left.label });
      }
      if (element.right) {
        this.links.push({ source: element.id, target: element.right.id, labelText: element.right.label });
      }
    });
    this.myGraph.center();
    this.myGraph.panTo(0, 200);
  }
}
