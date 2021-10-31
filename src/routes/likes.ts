import { Application } from "express";
import checkUserIdentity from "../auth/auth";
import connectToDb from "../DbUtils/connect";
import Like from "../models/Like";
import User from "../models/User";

const mountLikesRoute = (app: Application) => {
  app.get("/likes", async (req, res, next) => {
    const client = await connectToDb();
    await checkUserIdentity(client, req, res, next);

    const likesCollection = client
      .db(process.env["DB_NAME"])
      .collection("Likes");

    likesCollection.find({}).toArray((err, likes) => {
      if (err) throw err;

      return res.json(likes);
    });
  });
};

const mountTweetLikesRoute = (app: Application) => {
  app.get("/likes/:tweetId", async (req, res, next) => {
    const client = await connectToDb();

    await checkUserIdentity(client, req, res, next);
    const tweetId = req.params.tweetId;

    const likesCollection = client
      .db(process.env["DB_NAME"])
      .collection("Likes");

    likesCollection.find<Like>({ tweetId }).toArray((err, likes) => {
      if (err) throw err;

      return res.json(likes);
    });
  });
};

const mountPostLikeRoute = (app: Application) => {
  app.post("/like", async (req, res, next) => {
    const client = await connectToDb();

    const user = await checkUserIdentity(client, req, res, next) as User;
    const tweetRequest = {
        tweetId: req.body.tweetId,
        userId: user._id.toString()
    };
    const likesCollection = client
      .db(process.env["DB_NAME"])
      .collection("Likes");

    const insertedResponse = await likesCollection.insertOne(tweetRequest);


    return res.json(insertedResponse.insertedId);
  });
};

const mountLikeRoutes = (app: Application) => {
  mountLikesRoute(app);
  mountTweetLikesRoute(app);
  mountPostLikeRoute(app);
};

export default mountLikeRoutes;
