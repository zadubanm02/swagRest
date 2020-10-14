export interface IPost {
  name: String;
  description: String;
  added: Date;
  comments?: {
    username: String;
    commentdata: String;
    rating: number;
  };
}

export interface PostResponse {
  _id: string;
  name: String;
  description: String;
  added: Date;
  comments?: {
    _id: string;
    username: String;
    commentdata: String;
    rating: number;
  };
}
