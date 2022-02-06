import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filesizeconvert'
})
export class FilesizeconvertPipe implements PipeTransform {

  transform(bytes: number): string {
    if (Math.abs(bytes) < 1024) {
      return bytes + ' B';
    }
    const units = ['kB', 'MB', 'GB', 'TB'];
    let u = -1;
    do {
      bytes /= 1024;
      u++;
    } while (Math.abs(bytes) >= 1024 && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
  }

}
