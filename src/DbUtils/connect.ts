import { MongoClient, ConnectOptions } from "mongodb";

const connectToDb = async () => {
  const uri = `mongodb+srv://${process.env["DB_USERNAME"]}:${process.env["DB_PASSWORD"]}@fgescluster.1d8do.mongodb.net/${process.env["DB_NAME"]}?retryWrites=true&w=majority`;

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);

  await client.connect().catch((err) => console.log(err));
  return client;
};

export default connectToDb;
