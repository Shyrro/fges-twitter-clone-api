import { ObjectId } from "mongodb";
import checkUserIdentity from "../auth/auth";
import connectToDb from "../DbUtils/connect";
import bodyParser from "body-parser";
import { Tweet, TweetRequest } from "../models/Tweet";
import User from "../models/User";

const mountAllTweetsRoute = (app) => {
  app.get("/allTweets", async (req, res, next) => {
    const client = await connectToDb();
    await checkUserIdentity(client, req, res, next);

    const allTweetsCollection = client
      .db(process.env["DB_NAME"])
      .collection("Tweets");

    allTweetsCollection.find({}).toArray(function (err, tweets: Tweet[]) {
      if (err) throw err;

      const rootTweets = tweets.filter((tweet) => tweet.parent === "");
      const formattedTweets = rootTweets.map((tweet) => {
        const children = tweets.filter(
          (childTweet) => childTweet.parent === tweet._id.toString()
        );
        const formmattedChildren = children.map((child) => {
          const formattedChild = { ...child };
          delete formattedChild.parent;

          return formattedChild;
        });
        return {
          ...tweet,
          children: formmattedChildren,
        };
      });

      return res.json(formattedTweets);
    });
  });
};

const mountPickTweetRoute = (app) => {
  app.get("/tweet/:id", async (req, res, next) => {
    const client = await connectToDb();
    await checkUserIdentity(client, req, res, next);

    const tweetId = req.params.id;
    const tweetsCollection = client
      .db(process.env["DB_NAME"])
      .collection("Tweets");

    let children = [];
    tweetsCollection.find({ parent: tweetId }).toArray((err, result) => {
      if (err) throw err;
      children = result;
    });
    const tweet = await tweetsCollection.findOne({
      _id: new ObjectId(tweetId),
    });

    return res.json({
      ...tweet,
      children,
    });
  });
};

const mountPostTweetRoute = (app) => {
  app.post("/tweet", async (req, res, next) => {
    const client = await connectToDb();
    const user = (await checkUserIdentity(client, req, res, next)) as User;
    const content = {
      ...req.body,
      owner: user._id.toString(),
    }

    const dbResponse = await client
      .db(process.env["DB_NAME"])
      .collection("Tweets")
      .insertOne(content);

    return res.json(dbResponse.insertedId.toString());
  });
};

const mountTweetRoutes = (app) => {
  mountAllTweetsRoute(app);
  mountPickTweetRoute(app);
  mountPostTweetRoute(app);
};

export default mountTweetRoutes;
