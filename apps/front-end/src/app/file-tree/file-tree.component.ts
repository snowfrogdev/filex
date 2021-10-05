import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FileItem } from '@file-explorer/api-interfaces';
import { Stats } from 'fs';
import { FileDetails } from '../file-details/file-details.component';
import { FileService } from '../file.service';

/**
 * Flattened tree node that has been created from a FileItem through the flattener. Flattened
 * nodes include level index and whether they can be expanded or not.
 */
export interface FileTreeNode {
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
export class FileTreeComponent {
  @Input() set trees(value: FileItem[] | null) {
    if (value) {
      this.saveExpandedNodes();
      this.dataSource.data = value;
      this.restoreExpandedNodes();
    }
  }
  @Input() selectedFileItem: FileDetails | null = null;
  @Output() fileNodeClicked = new EventEmitter<FileTreeNode>();
  @Output() deleteClicked = new EventEmitter<FileTreeNode>();
  @Output() movedFile = new EventEmitter<{ nodeToMove: FileTreeNode; targetNode: FileTreeNode }>();
  @Output() fileItemAddClicked = new EventEmitter<'file' | 'directory'>();

  isDragging = false;
  nodeHoveredOver: FileTreeNode | null = null;
  expandedNodes: FileTreeNode[] = [];

  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<FileTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<FileItem, FileTreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<FileItem, FileTreeNode>;

  constructor(private fileService: FileService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  /** Transform the data to something the tree can read. */
  transformer(node: FileItem, level: number): FileTreeNode {
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
  getLevel(node: FileTreeNode): number {
    return node.level;
  }

  /** Get whether the node is expanded or not. */
  isExpandable(node: FileTreeNode): boolean {
    return node.expandable;
  }

  /** Get whether the node has children or not. */
  hasChild(index: number, node: FileTreeNode): boolean {
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
      const node = this.treeControl.dataNodes.find((node) => node.path === expandedNode.path);
      if (node) {
        this.treeControl.expand(node);
      }
    });
  }

  isTreeRoot(node: FileTreeNode): boolean {
    return node.level === 0;
  }

  handleFileNodeClick(node: FileTreeNode) {
    this.fileNodeClicked.emit(node);
  }

  handleDeleteClick(node: FileTreeNode) {
    this.deleteClicked.emit(node);
  }

  handleHesitate(node: FileTreeNode) {
    if (this.isDragging) {
      this.treeControl.expand(node);
    }
  }

  handleDrop(event: CdkDragDrop<FileTreeNode>) {
    const nodeToMove = event.item.data;
    const targetNode = this.nodeHoveredOver;

    if (targetNode) {
      this.movedFile.next({ nodeToMove, targetNode });
    }
  }

  handleFileItemAddClick(type: 'file' | 'directory') {
    this.fileItemAddClicked.emit(type);
  }
}
