import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private http: HttpClient) {}
  getImages(): any {
    return this.http.get(
      environment.apiBaseUrl + 'getImages?appId=' + environment.token
    );
  }
  uploadImage(formData): any {
    return this.http.post(
      environment.apiBaseUrl + 'uploadImage?appId=' + environment.token,
      formData
    );
  }
}
