import { Component, NgZone } from '@angular/core';
import { ImageService } from '../services/image.service';
import { Observable, Observer } from 'rxjs';
import { ImageListRequest, ImageList } from '../models/imageListRequest.model';
import {
  LoadingController,
  ToastController,
  ActionSheetController
} from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { environment } from '../../environments/environment';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/File/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  emptyList: boolean = false;
  selectedImage: any = '';
  imageData: any = '';
  uploadSize: any = '';
  maxUploadSize: any = 15.0;
  public loadingRequest = false;
  public result: Observable<any>;
  public uploadedList: ImageList[];

  ionViewWillEnter() {
    this.loadContents();
  }
  constructor(
    private ngZone: NgZone,
    private file: File,
    private transfer: FileTransfer,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private imageService: ImageService
  ) {}

  async loadContents() {
    this.emptyList = false;
    this.loadingRequest = true;
    this.uploadedList = [];
    this.result = this.imageService.getImages();
    this.result.subscribe(
      (response: ImageListRequest) => {
        this.loadingRequest = false;
        if (response.status == 'OK') {
          response.result.sort((a, b) =>
            a.timestamp < b.timestamp ? 1 : b.timestamp < a.timestamp ? -1 : 0
          );
          this.ngZone.run(() => {
            this.uploadedList = response.result;
          });
          if (this.uploadedList.length == 0) {
            this.emptyList = true;
          }
        } else if (response.status == 'ERROR') {
          this.presentToast('Opps' + JSON.stringify(response.result), 2000);
        }
      },
      (error: any) => {
        this.loadingRequest = false;
        this.presentToast(JSON.stringify(error), 2000);
      }
    );
  }

  actionUpload() {
    this.presentActionSheet();
  }

  nativeCameraUpload() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.imageData = imageData;
        this.file.resolveLocalFilesystemUrl(this.imageData).then(file => {
          file.getMetadata(
            meta => {
              this.uploadSize = meta.size / 1024 / 1024;
              if (this.uploadSize < this.maxUploadSize) {
                this.upload();
              } else {
                this.presentToast('Image is too Large', 2000);
              }
            },
            error => {}
          );
        });
      },
      err => {
        // Handle error
        this.presentToast(JSON.stringify(err), 2000);
      }
    );
  }

  getImageSize(data_url) {
    var head = 'data:image/jpg;base64,';
    return (((data_url.length - head.length) * 6) / 8 / (1024 * 1024)).toFixed(
      4
    );
  }

  async presentToast(message: string, length: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: length
    });
    toast.present();
  }

  async upload() {
    const loading = await this.loadingController.create({
      message: 'Uploading...'
    });
    await loading.present();

    const fileTransfer: FileTransferObject = this.transfer.create();

    let options1: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'name.jpg',
      headers: {}
    };

    fileTransfer
      .upload(
        this.imageData,
        environment.apiBaseUrl + 'uploadImage?appId=' + environment.token,
        options1
      )
      .then(
        data => {
          // success
          loading.dismiss();
          this.presentToast('Image Uploaded!', 2000);
          this.loadContents();
        },
        err => {
          // error
          this.presentToast(JSON.stringify(err), 2000);
        }
      );
  }

  async uploadSelectedImage() {
    const loading = await this.loadingController.create({
      message: 'Uploading...'
    });
    await loading.present();

    const fileTransfer: FileTransferObject = this.transfer.create();

    let options1: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'name.jpg',
      headers: {}
    };

    fileTransfer
      .upload(
        this.selectedImage,
        environment.apiBaseUrl + 'uploadImage?appId=' + environment.token,
        options1
      )
      .then(
        data => {
          // success
          loading.dismiss();
          this.presentToast('Image Uploaded!', 2000);
          this.loadContents();
        },
        err => {
          // error
          this.presentToast(JSON.stringify(err), 2000);
        }
      );
  }

  selectFromGallery() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true,
      allowEdit: false
    };

    this.camera.getPicture(options).then(
      imageData => {
        let base64data = 'data:image/jpeg;base64,' + imageData;
        this.selectedImage = (<any>window).Ionic.WebView.convertFileSrc(
          base64data
        );
        this.uploadSize = this.getImageSize(base64data);
        if (this.uploadSize < this.maxUploadSize) {
          this.uploadSelectedImage();
        } else {
          this.presentToast('Image is too Large', 2000);
        }
      },
      err => {
        // Handle error
        this.presentToast(JSON.stringify(err), 2000);
      }
    );
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose an option',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.nativeCameraUpload();
          }
        },
        {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            this.selectFromGallery();
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    await actionSheet.present();
  }
}
