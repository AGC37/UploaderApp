import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {FileService} from "../../services/file.service";
import {HttpEventType} from "@angular/common/http";
import {FilesizeconvertPipe} from "../../filesizeconvert.pipe";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  public progress!: number;
  public message!: string;
  public errorMessage: string;
  selectedFiles: any;

  @Input() sizeConfig: number;
  @Input() typeConfig: any[];

  @Output() public onUploadFinished = new EventEmitter();

  constructor(private fileService: FileService,
              private filesize: FilesizeconvertPipe) {}
  ngOnInit() {}

  public validate(files: any){
    this.selectedFiles = files;
    if (files.length === 0){
      this.errorMessage = 'Please choose a file.';
      return;
    }
    for (let i = 0; i < files.length; i++)
    {
      if (files[i].size > this.sizeConfig){
        this.errorMessage = `File - ${files[i].name} - Maximum size ${this.filesize.transform(this.sizeConfig)} exceeded`;
        return;
      } else {
        let temp = [];
        for (let t = 0; t < this.typeConfig.length; t++)
        {
          temp.push(files[i].name.toLowerCase().endsWith(this.typeConfig[t]));
        }
        if (!temp.includes(true)){
          this.errorMessage = `File Extension Is InValid - Only Upload ${this.typeConfig.join()} File`;
          return;
        }
      }
    }
    this.errorMessage = '';
  }

  public uploadFiles(files: any) {
    if (files.length === 0) {
      return;
    }
    let fileToUpload : File[] = files;
    const formData = new FormData();

    Array.from(fileToUpload).map((file, index) => {
      return formData.append('file'+index, file, file.name);
    });

    this.fileService.uploadFiles(formData).subscribe((event) => {
      if (event.type === HttpEventType.UploadProgress)
      {
        this.progress = Math.round((100 * event.loaded) / event.total);
      }
      else if (event.type === HttpEventType.Response) {
        this.message = 'Upload all!';
        this.onUploadFinished.emit(true);
      }
    });
  };
}
