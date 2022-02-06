import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  rerender = false;

  //Configuration
  public typeFile = ['.txt', '.doc', '.pdf'];
  public size = 5242880;

  constructor(private cdRef:ChangeDetectorRef) {
  }

  title = 'UploaderApp';

  reloadPage(event: any) {
    if (event){
      this.rerender = true;
      this.cdRef.detectChanges();
      this.rerender = false;
    }
  }
}

