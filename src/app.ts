import express from "express";
import mongoose from "mongoose";
import { PostController } from "./prispevok/post.controller";
import bodyParser from "body-parser";
import { RegisterRoutes } from "./prispevok/routes";
import * as swaggerUi from "swagger-ui-express";

export default class App {
  public app: any;
  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.connectToTheDatabase();
    this.initializeControllers();
    this.startSwagger();
  }

  public listen() {
    this.app.set("port", process.env.PORT || 3000);
    this.app.listen(this.app.get("port"), () => {
      console.log(
        "App is running on http://localhost:%d",
        this.app.get("port")
      );
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToTheDatabase() {
    const uri: string =
      "mongodb+srv://zadubanm:spartak02@myrestapi-pq4jd.mongodb.net/test";
    mongoose.set("useUnifiedTopology", true);
    mongoose
      .connect(uri, { useNewUrlParser: true, useFindAndModify: false })
      .then(() => {
        console.log("Succesfuly connected");
      })
      .catch(err => {
        console.log("connection error");
        throw err;
      });
  }

  private initializeControllers() {
    //this.app.use("/", new PostController().router);
    RegisterRoutes(this.app);
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private startSwagger() {
    try {
      const swaggerDocument = require("../swagger.json");
      this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    } catch (err) {
      console.log("Unable to load swagger.json", err);
    }
  }
}
