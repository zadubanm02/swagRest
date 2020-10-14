import mongoose from "mongoose";
import { IPost } from "./post.interface";

const CommentsSchema = new mongoose.Schema({
  username: String,
  commentdata: String,
  rating: Number
});

const PostSchema = new mongoose.Schema({
  name: String,
  description: String,
  added: Date,
  comments: { type: [CommentsSchema], default: undefined }
});

const postModel = mongoose.model<IPost & mongoose.Document>("Post", PostSchema);

export default postModel;
