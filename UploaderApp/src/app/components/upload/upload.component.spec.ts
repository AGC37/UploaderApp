import {UploadComponent} from "./upload.component";
import {FileService} from "../../services/file.service";
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {By} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {FilesizeconvertPipe} from "../../filesizeconvert.pipe";

describe('UploadComponent', () => {
  let component: UploadComponent
  let fixture: ComponentFixture<UploadComponent>

  beforeEach(waitForAsync(() => {
    const fileService = jasmine.createSpyObj<FileService>('fileService', ['uploadFiles'])
    const filesize = jasmine.createSpyObj<FilesizeconvertPipe>('filesize', ['transform'])

    TestBed.configureTestingModule({
      declarations: [ UploadComponent, FilesizeconvertPipe ],
      providers: [
        {provide: FileService, useValue: fileService},
        {provide: FilesizeconvertPipe, useValue: filesize}
      ],
      imports: [
        HttpClientModule
      ]
    }).compileComponents();
  }))

  beforeEach(() => {


    fixture = TestBed.createComponent(UploadComponent)
    component = fixture.componentInstance
    component.sizeConfig = 5242880

    fixture.detectChanges()

  })

  it('should be create', () => {
    expect(component).toBeDefined()
  })

  it('should detect file input change and set selectedFiles', () => {
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(new File(new Array(100), 'test.pdf'))

    const inputDebugEl  = fixture.debugElement.query(By.css('input[type=file]'));
    inputDebugEl.nativeElement.files = dataTransfer.files;

    inputDebugEl.nativeElement.dispatchEvent(new InputEvent('change'));

    fixture.detectChanges();

    expect(component.selectedFiles).toBeTruthy()
    expect(component.selectedFiles[0].name).toBe('test.pdf')

  });
  it('should be errorMessage if the file size is larger than allowed', () => {
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(new File(new Array(100), 'test.pdf'))
    component.sizeConfig = 54
    const fileList = dataTransfer.files
    component.validate(fileList)
    expect(component.errorMessage).toBeTruthy()
  });
  it('should be Validate OK', () => {
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(new File(new Array(100), 'test.pdf'))
    component.sizeConfig = 5242880
    component.typeConfig = ['.txt', '.doc', '.pdf']
    const fileList = dataTransfer.files
    component.validate(fileList)
    expect(component.errorMessage).toBeFalsy()
  });

})
