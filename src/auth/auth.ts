import { NextFunction, Response, Request } from "express";
import { MongoClient } from "mongodb";
import User from "../models/User";

const checkUserIdentity = async (
  client: MongoClient,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = client.db(process.env["DB_NAME"]).collection("Users");
  const apiKey = req.headers["x-fges-user-key"] as string;

  try {
    const user = await users.findOne<User>({ apiKey });
    if (!user) throw new Error("Wrong API key");
    return user;
  } catch (e) {
    res.status(401).send({
      error: `Api-Key: '${apiKey}' in header 'x-fges-user-key' is not a valid key.`,
    });

    return next(e);
  }
};

export default checkUserIdentity;
