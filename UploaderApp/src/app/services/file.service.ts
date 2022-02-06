import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BaseService} from "./base.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileService extends BaseService {

  constructor(
    http: HttpClient,
    @Inject('BASE_URL') baseUrl: string) {
    super(http, baseUrl)
  }
  private url = this.baseUrl + 'api/files';

  public uploadFiles(formData: FormData) {
    return this.http.post(`${this.url}`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  delete<File>(id: number): Observable<File> {
    const url = this.url + '/' +id;
    return this.http.delete<File>(url);
  }

  public getFiles<ApiResult>(
    pageIndex?: number,
    pageSize?: number,
    sortColumn?: string,
    sortOrder?: string,
    typeFile?: string,
  ): Observable<ApiResult> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex!.toString())
      .set('pageSize', pageSize!.toString())
      .set('sortColumn', sortColumn!)
      .set('sortOrder', sortOrder!)
      .set('typeFile', typeFile!);
    return this.http.get<ApiResult>(`${this.url}`, {params})
  }
}

