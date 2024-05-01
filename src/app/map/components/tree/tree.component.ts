import { Component } from '@angular/core';
import { TreeNode } from './tree-node';
import { Subscription } from 'rxjs';
import { ArbolService } from '../../services/tree-generation/arbol.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
})
export class TreeComponent {
  tree: TreeNode[] = [];
  coordinatesArray: any[] = [];
  private coordinatesSubscription?: Subscription;

  constructor(private arbolService: ArbolService) {}

  ngOnInit() {
    this.coordinatesSubscription = this.arbolService.treeArray$.subscribe(
      (coordinatesArray) => {
        this.coordinatesArray = coordinatesArray;
        this.buildTree();
      }
    );
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
}
