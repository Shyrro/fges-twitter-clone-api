import * as express from "express";
import { MongoClient, ObjectId } from "mongodb";

import connectToDb from "./DbUtils/connect";

class App {
  public express;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router();
    router.get("/", (req, res) => {
      res.json({ message: "Go away, world!" });
    });

    this.mountUsersRoute(router);
    this.mountTweetRoutes(router);

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

  private mountTweetRoutes(router: express.Router) {
    router.get("/allTweets", async (req, res, next) => {
      const client = await connectToDb();
      const userId = req.headers["x-fges-user"] as string;
 
      try {
        await this.checkUserIdentity(client, userId);
      } catch (e) {
        res.status(401).send({
          error: `UserId: '${userId}' in header "x-fges-user" is not authorized. `,
        });

        return next(e);
      }

      const allTweets = client.db(process.env["DB_NAME"]).collection('Tweets');

      allTweets.find({}).toArray(function (err, tweets) {
        if (err) throw err;

        return res.json(tweets);
      });
    });
  }

  private async checkUserIdentity(client: MongoClient, userId: string) {
    const users = client.db(process.env["DB_NAME"]).collection('Users');

    return users
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        return user;
      })
      .catch((e) => {
        throw e;
      });
  }
}

export default new App().express;
