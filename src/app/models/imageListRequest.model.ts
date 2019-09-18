export interface RequestResponse {
  status: string;
  result: any;
}
export interface ImageListRequest {
  status: string;
  result: Array<ImageList>;
}

export interface ImageList {
  id: string;
  url: string;
  timestamp: Number;
}
