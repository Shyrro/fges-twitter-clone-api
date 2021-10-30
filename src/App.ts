import * as express from "express";

import connectToDb from './DbUtils/connect';

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
    
    this.express.use("/", router);
  }

  private mountUsersRoute(router: express.Router) {
    router.get('/users', async (req, res) => {
      const client = await connectToDb();

      const collection = client.db(process.env['DB_NAME']).collection('Users');

      collection.find({}).toArray(function (err, users) {
        if (err) throw err;
  
        return res.json(users);
      });
    });
  }
}   
        
export default new App().express;