import {ListComponent} from "./list.component";
import {FileService} from "../../services/file.service";
import {of} from "rxjs";
import {ApiResult} from "../../services/base.service";
import {File} from "../../interfaces/file.model";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {MaterialModule} from "../../modules/material/material.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FilesizeconvertPipe} from "../../filesizeconvert.pipe";


describe('ListComponent', () => {
  let component: ListComponent
  let fixture: ComponentFixture<ListComponent>

  beforeEach(waitForAsync(() => {
    const fileService = jasmine.createSpyObj<FileService>('fileService', ['getFiles'])

    fileService.getFiles.and.returnValue(
      of<ApiResult<File>>(<ApiResult<File>>({
          data: [
            {
              id: 1,
              name: 'test.pdf',
              size: 500000,
              filePath:'832822cb-7a0e-4d60-bf4a-d91d99414b74.pdf',
              creationTime: new Date('Fri Dec 08 2021 07:44:57'),
            },
            {
              id: 2,
              name: 'test2.pdf',
              size: 5604000,
              filePath:'832822cb-7a0e-4d60-bf4a-d91d99414b74.pdf',
              creationTime: new Date('Fri Dec 09 2021 07:44:57'),
            }],
          pageIndex: 0,
          pageSize: 10,
          totalCount: null,
          totalPages: null,
          typeFile: '.pdf',
        })
      ));

    TestBed.configureTestingModule({
      declarations: [ ListComponent, FilesizeconvertPipe ],
      providers: [
        { provide: FileService, useValue: fileService }
      ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent)
    component = fixture.componentInstance

    component.paginator = jasmine.createSpyObj('MatPaginator', ['length', 'pageIndex', 'pageSize'])

    fixture.detectChanges()
  })

  it('should be created', () => {
    expect(component).toBeDefined()
  })

  it('should contain a table with a list of one or more files', waitForAsync(() => {
    let table = fixture.nativeElement
      .querySelector('table.mat-table');
    let tableRows = table
      .querySelectorAll('tr.mat-row');
    expect(tableRows.length).toBeGreaterThan(0);
  }));


})
