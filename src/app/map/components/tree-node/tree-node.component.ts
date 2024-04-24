import { Component, Input } from '@angular/core';
import { TreeNode } from '../tree/tree-node';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.css']
})
export class TreeNodeComponent {
  @Input() node: TreeNode = { coordenada: {x: -1, y: '', z: 0}, marcado: false };
}
