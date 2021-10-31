import checkUserIdentity from "../auth/auth";
import connectToDb from "../DbUtils/connect";
import { Tweet } from "../models/Tweet";

const mountUserTweetsRoute = (app) => {
  app.get("/user/:userId/tweets", async (req, res, next) => {
    const client = await connectToDb();

    await checkUserIdentity(client, req, res, next);
    const userId = req.params.userId;
    const tweetsCollection = client
      .db(process.env["DB_NAME"])
      .collection("Tweets");

    const parentCursor = tweetsCollection.find<Tweet>({
      owner: userId,
      parent: "",
    });
    const tweets = [] as Tweet[];
    const result = [] as Tweet[];
    await parentCursor.forEach((parent) => {
      tweets.push(parent);
    });

    const tweetMapCallback = tweets.map(async (tweet) => {
      const children = [];
      const cursor = tweetsCollection.find({
        parent: tweet._id.toString(),
      });

      await cursor.forEach((childTweet: Tweet) => {
        children.push(childTweet);
      });

      result.push({
        ...tweet,
        children,
      });
    });

    await Promise.all(tweetMapCallback).then(() => {
      return res.json(result);
    });
  });
};

function mountUsersRoute(app) {
  app.get("/users", async (req, res) => {
    const client = await connectToDb();
    const collection = client.db(process.env["DB_NAME"]).collection("Users");

    collection.find({}).toArray(function (err, users) {
      if (err) throw err;
      const noApiUsers = users.map((user) => {
        const copyUser = { ...user };
        delete copyUser.apiKey;

        return copyUser;
      })
      return res.json(noApiUsers);
    });
  });
}

const mountUserRoutes = (app) => {
  mountUsersRoute(app);
  mountUserTweetsRoute(app);
};

export default mountUserRoutes;
