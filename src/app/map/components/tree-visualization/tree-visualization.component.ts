import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { TreeNode } from '../tree/tree-node';
import { Subscription } from 'rxjs';
import { ArbolService } from '../../services/tree-generation/arbol.service';
import { HierarchyNode, HierarchyPointNode } from 'd3';
import { on } from 'pdfkit';

@Component({
  selector: 'app-tree-visualization',
  template: '<svg #svgElement></svg>',
  styleUrls: ['./tree-visualization.component.css'],
})
export class TreeVisualizationComponent {
  @ViewChild('svgElement') svgElement!: ElementRef<SVGElement>;
  // @Input() treeData: any;

  tree: TreeNode[] = [];
  coordinatesArray: any[] = [
    { x: 10, y: 'A', z: 1 },
    { x: 10, y: 'B', z: 0 },
    { x: 9, y: 'B', z: 0 },
    { x: 8, y: 'B', z: 0 },
    { x: 7, y: 'B', z: 0 },
    { x: 7, y: 'C', z: 0 },
    { x: 7, y: 'D', z: 0 },
    { x: 6, y: 'D', z: 0 },
    { x: 5, y: 'D', z: 0 },
    { x: 4, y: 'D', z: 0 },
    { x: 3, y: 'D', z: 0 },
    { x: 2, y: 'D', z: 0 },
    { x: 2, y: 'E', z: 0 },
    { x: 2, y: 'D', z: 1 },
    { x: 2, y: 'C', z: 0 },
    { x: 2, y: 'B', z: 0 },
    { x: 3, y: 'B', z: 0 },
    { x: 2, y: 'D', z: 1 },
    { x: 4, y: 'D', z: 1 },
    { x: 4, y: 'E', z: 0 },
    { x: 4, y: 'F', z: 0 },
    { x: 5, y: 'F', z: 0 },
    { x: 4, y: 'F', z: 1 },
    { x: 4, y: 'G', z: 0 },
    { x: 3, y: 'G', z: 0 },
    { x: 2, y: 'G', z: 0 },
    { x: 2, y: 'H', z: 0 },
    { x: 2, y: 'I', z: 0 },
    { x: 1, y: 'I', z: 0 },
    { x: 2, y: 'I', z: 1 },
    { x: 3, y: 'I', z: 0 },
    { x: 4, y: 'I', z: 0 },
    { x: 5, y: 'I', z: 0 },
    { x: 6, y: 'I', z: 0 },
    { x: 7, y: 'I', z: 0 },
  ];

  private coordinatesSubscription?: Subscription;

  constructor(private arbolService: ArbolService) {}

  ngOnInit() {
    // this.coordinatesSubscription = this.arbolService.treeArray$.subscribe(coordinatesArray => {
    //   this.coordinatesArray = coordinatesArray;
    this.buildTree();
    // });
  }

  ngAfterViewInit() {
    this.iniciar();
  }

  buildTree() {
    let nodoMarcado: TreeNode | undefined;

    this.tree = this.coordinatesArray.reduce(
      (accumulator: TreeNode[], coordenada) => {
        if (coordenada.z === 1) {
          if (nodoMarcado) {
            accumulator.push(nodoMarcado);
          }
          nodoMarcado = {
            coordenada: coordenada,
            marcado: true,
            hijo: [],
          };
        } else if (nodoMarcado) {
          nodoMarcado.hijo!.push({
            coordenada: coordenada,
            marcado: false,
          });
        }
        return accumulator;
      },
      []
    );

    if (nodoMarcado) {
      this.tree.push(nodoMarcado);
    }
  }

  iniciar() {
    if (!this.svgElement) {
      console.error('Elemento SVG no encontrado.');
      return;
    }

    if (!this.tree) {
      console.error('No hay datos de árbol proporcionados.');
      return;
    }

    // Configuración del layout del árbol
    // const width = 600;
    // const height = 400;
    const width = 6000;
    const height = 4000;
    const svg = d3
      .select(this.svgElement.nativeElement)
      .attr('width', width)
      .attr('height', height);
    // const treeLayout = d3.tree().size([width, height]);

    const treeLayout = d3.tree<TreeNode>().size([width, height]);

    const rootNodeData = {
      coordenada: { x: 0, y: 'Root', z: 0 },
      marcado: true,
      hijo: this.tree,
    };
    const rootNode: HierarchyNode<TreeNode> =
      d3.hierarchy<TreeNode>(rootNodeData);

    // Define una función para asignar un valor predeterminado a 'x' si es 'undefined'
    function assignDefaultX(node: HierarchyNode<TreeNode>) {
      if (node.data.coordenada.x === undefined) {
        node.data.coordenada.x = 0; // Asigna un valor predeterminado, por ejemplo, 0
      }
      if (node.children) {
        node.children.forEach(assignDefaultX);
      }
    }

    // Asigna valores predeterminados a 'x' para todos los nodos
    assignDefaultX(rootNode);

    // Luego, utiliza treeLayout(rootNode) como lo estabas haciendo anteriormente
    const treeNodes = treeLayout(rootNode);

    // Dibujar nodos
    svg
      .selectAll('circle')
      .data(treeNodes.descendants())
      .enter()
      .append('circle')
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y)
      .attr('r', 10)
      .attr('fill', 'steelblue');

    // Dibujar conexiones entre nodos
    svg
      .selectAll('path')
      .data(treeNodes.links())
      .enter()
      .append('path')
      .attr(
        'd',
        (d: any) => `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`
      )
      .attr('stroke', 'gray')
      .attr('stroke-width', 2)
      .attr('fill', 'none');
  }
}
