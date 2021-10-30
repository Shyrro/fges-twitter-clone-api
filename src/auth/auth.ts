import { MongoClient, ObjectId } from "mongodb";

const checkUserIdentity = async (client: MongoClient, userId: string) => {
  const users = client.db(process.env["DB_NAME"]).collection("Users");

  return users
    .findOne({ _id: new ObjectId(userId) })
    .then((user) => user)
    .catch((e) => {
      throw e;
    });
};

export default checkUserIdentity;
