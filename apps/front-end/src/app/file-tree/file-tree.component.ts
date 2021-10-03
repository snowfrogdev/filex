import { FlatTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { FileItem } from '@file-explorer/api-interfaces';
import { Stats } from 'fs';
import { Observable } from 'rxjs';
import { FileService } from '../file.service';

/**
 * Flattened tree node that has been created from a FileItem through the flattener. Flattened
 * nodes include level index and whether they can be expanded or not.
 */
export interface FlatTreeNode {
  name: string;
  path: string;
  stats: Stats;
  type: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'file-explorer-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileTreeComponent implements OnInit {
  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<FlatTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<FileItem, FlatTreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<FileItem, FlatTreeNode>;

  expandedNodes: FlatTreeNode[] = [];
  selectedNode!: Observable<FlatTreeNode | null>;

  constructor(private fileService: FileService) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );

    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );
  }

  ngOnInit() {
    this.fileService.trees.subscribe((trees) => {
      this.saveExpandedNodes();
      this.dataSource.data = trees;
      this.restoreExpandedNodes();
    });

    this.selectedNode = this.fileService.selectedNode;
  }

  /** Transform the data to something the tree can read. */
  transformer(node: FileItem, level: number): FlatTreeNode {
    return {
      name: node.name,
      path: node.path,
      stats: node.stats,
      type: node.children ? 'folder' : 'file',
      level,
      expandable: !!node.children,
    };
  }

  /** Get the level of the node */
  getLevel(node: FlatTreeNode): number {
    return node.level;
  }

  /** Get whether the node is expanded or not. */
  isExpandable(node: FlatTreeNode): boolean {
    return node.expandable;
  }

  /** Get whether the node has children or not. */
  hasChild(index: number, node: FlatTreeNode): boolean {
    return node.expandable;
  }

  /** Get the children for the node. */
  getChildren(node: FileItem): FileItem[] | null | undefined {
    return node.children;
  }

  saveExpandedNodes() {
    this.expandedNodes = [];
    this.treeControl.dataNodes?.forEach((node) => {
      if (node.expandable && this.treeControl.isExpanded(node)) {
        this.expandedNodes.push(node);
      }
    });
  }

  restoreExpandedNodes() {
    this.expandedNodes.forEach((expandedNode) => {
      const node = this.treeControl.dataNodes.find(
        (node) => node.path === expandedNode.path
      );
      if (node) {
        this.treeControl.expand(node);
      }
    });
  }

  isTreeRoot(node: FlatTreeNode): boolean {
    return node.level === 0;
  }

  selectNode(node: FlatTreeNode) {
    this.fileService.selectNode(node);
  }
}
