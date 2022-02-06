import {
  Component,
  Input, OnInit,
  ViewChild
} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, SortDirection} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {File} from "../../interfaces/file.model";
import {FileService} from "../../services/file.service";
import {ApiResult} from "../../services/base.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'creationTime', 'size', 'delete'];
  public data: MatTableDataSource<File>;

  defaultPageIndex = 0;
  defaultPageSize = 5;
  public defaultSortColumn = 'creationTime';
  public defaultSortOrder: SortDirection = 'desc';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() fileTypeAll: string;

  constructor(private fileService: FileService) {
  }
  ngOnInit() {
    this.loadData(null)
  }
  update(){
    this.loadData(null)
  }

  loadData(query: string = null) {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.getFiles(pageEvent)
  }

  getFiles(event: PageEvent) {

    const sortColumn = (this.sort)
      ? this.sort.active
      : this.defaultSortColumn;

    const sortOrder = (this.sort)
      ? this.sort.direction
      : this.defaultSortOrder;

    const typeFile = this.fileTypeAll;

    this.fileService.getFiles<ApiResult<File>>(
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      typeFile
    ).subscribe({
      next: result => {
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.data = new MatTableDataSource<File>(result.data);
      }
    })
  }

  delete(id: number) {
    this.fileService.delete<File>(id).subscribe({
      error: error => console.log(error),
      complete: () => this.loadData(null),
    })
  }
}
