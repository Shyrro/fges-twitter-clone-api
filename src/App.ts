import * as express from "express";
import { MongoClient, ObjectId } from "mongodb";
import mountTweetRoutes from "./routes/tweets";
import mountUserRoutes from "./routes/user";

import connectToDb from "./DbUtils/connect";
import checkUserIdentity from "./auth/auth";

class App {
  public express;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes() {
    const router = express.Router();
    router.get("/", (req, res) => {
      res.json({ message: "Go away, world!" });
    });
    this.mountUsersRoute(router);
    mountTweetRoutes(router);
    mountUserRoutes(router);

    this.express.use("/", router);
  }

  private mountUsersRoute(router: express.Router) {
    router.get("/users", async (req, res) => {
      const client = await connectToDb();
      const collection = client.db(process.env["DB_NAME"]).collection("Users");

      collection.find({}).toArray(function (err, users) {
        if (err) throw err;

        return res.json(users);
      });
    });
  }
}

export default new App().express;
