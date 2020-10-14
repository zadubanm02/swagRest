import * as express from "express";
import mongoose from "mongoose";
import { IPost, PostResponse } from "./post.interface";
import postModel from "./post.model";
import {
  Controller,
  Get,
  Route,
  Tags,
  Put,
  Post,
  Delete,
  Request,
  Response,
  Body,
  Query
} from "tsoa";

/*interface Controller {
  path: String;
  router: express.Router;
}*/

@Route("/posts")
@Tags("Post")
export class PostController extends Controller {
  public path = "/posts";
  public router = express.Router();
  private post = postModel;

  constructor() {
    super();
    //this.initializeRoutes();
  }

  /*private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getOnePost);
    this.router.post(this.path, this.createPost);
    this.router.put(`${this.path}/:id`, this.updatePost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }*/

  @Response<PostResponse[]>("200", "Success")
  @Get()
  public async getAllPosts(
    @Query() limit: number,
    @Query() offset: number
  ): Promise<PostResponse[]> {
    try {
      let posts = await this.post
        .find()
        .limit(limit)
        .skip(offset);
      if (!posts) {
        throw new Error("Posts unavailable.");
      }
      return <PostResponse[]>posts;
    } catch (err) {
      this.setStatus(500);
      return [];
      console.error(err);
    }
  }

  /*private getAllPosts = async (
    request: express.Request,
    response: express.Response
  ) => {
    const posts = await this.post.find();
    response.send(posts);
  };*/

  @Response<PostResponse>("200", "Success")
  @Post()
  public async createPost(
    @Body() requestBody: IPost,
    @Request() request: express.Request
  ): Promise<PostResponse> {
    try {
      const postData = request.body;
      const createdPost = new this.post(postData);
      const savedPost = await createdPost.save();
      if (!savedPost) {
        throw new Error(`Post not saved!`);
      }
      this.setStatus(201);
      return <PostResponse>savedPost;
    } catch (err) {
      this.setStatus(500);
      console.error(err);
      return <PostResponse>{};
    }
  }

  /*private createPost = async (
    request: express.Request,
    response: express.Response
  ) => {
    const postData = request.body;
    const createdPost = new this.post(postData);
    const savedPost = await createdPost.save();
    response.send(savedPost);
    console.log(savedPost, "Post succesfully created");
  };*/

  @Response<PostResponse>("200", "Success")
  @Get("{id}")
  public async getOnePost(
    id: string,
    @Request() request: express.Request
  ): Promise<PostResponse> {
    try {
      let findedPost = await this.post.findById(mongoose.Types.ObjectId(id));
      if (!findedPost) {
        this.setStatus(404);
        return <PostResponse>{};
        throw new Error(`Post with id ${id} not found!`);
      }
      return <PostResponse>findedPost;
    } catch (err) {
      this.setStatus(500);
      return <PostResponse>{};
      console.error(err);
    }
  }

  /*private getOnePost = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const id = request.params.id;
      const posts = await this.post.findById(mongoose.Types.ObjectId(id));
      if (posts) {
        response.send(posts);
      } else {
        response.status(404).send(`Post with id ${id} not found!`);
      }
    } catch (err) {
      response.status(500).send(err);
    }
  };*/

  @Response<PostResponse>("200", "Success")
  @Put("{id}")
  public async updatePost(
    id: string,
    @Body() requestBody: IPost,
    @Request() request: express.Request
  ): Promise<PostResponse> {
    try {
      const id = request.params.id;
      const postData: IPost = request.body;
      const post = await this.post.findByIdAndUpdate(
        mongoose.Types.ObjectId(id),
        postData,
        { new: true }
      );
      if (!post) {
        this.setStatus(404);
        return <PostResponse>{};
        throw new Error(`Post with id ${id} not found!`);
      }
      return <PostResponse>post;
    } catch (err) {
      this.setStatus(500);
      return <PostResponse>{};
      console.error(err);
    }
  }

  /*private updatePost = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const id = request.params.id;
      const postData: IPost = request.body;
      const post = await this.post.findByIdAndUpdate(
        mongoose.Types.ObjectId(id),
        postData,
        { new: true }
      );
      if (post) {
        response.send(post);
      } else {
        response.status(404).send(`Book with id ${id} not found!`);
      }
    } catch (err) {
      response.status(500).send(err);
    }
  };*/

  @Response<IPost>("200", "Success")
  @Delete("{id}")
  public async deletePost(
    id: string,
    @Body() requestBody: IPost,
    @Request() request: express.Request
  ): Promise<PostResponse> {
    try {
      const id = request.params.id;
      const postData: IPost = request.body;
      const post = await this.post.findByIdAndDelete(
        mongoose.Types.ObjectId(id)
      );
      if (!post) {
        this.setStatus(404);
        throw new Error(`Post with id ${id} not found!`);
        return <PostResponse>{};
      }
      return <PostResponse>post;
    } catch (err) {
      this.setStatus(500);
      console.error(err);
      return <PostResponse>{};
    }
  }

  /*private deletePost = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const id = request.params.id;
      const success = await this.post.findByIdAndDelete(
        mongoose.Types.ObjectId(id)
      );
      if (success) {
        response.sendStatus(200).send("Succesfuly deleted");
      } else {
        response.status(404).send(`Book with id ${id} not found!`);
      }
    } catch (err) {
      response.status(500).send(err);
    }
  };*/
}
