import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";

import mountTweetRoutes from './routes/tweets';
import mountUserRoutes from './routes/user';
import mountLikeRoutes from './routes/likes';

require("dotenv").config({ path: path.normalize(__dirname + "/../.env") });

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.json({ message: "Go away, world!" });
});

mountUserRoutes(app);
mountTweetRoutes(app);
mountLikeRoutes(app);

const port = process.env.PORT || 3000;

app.listen(port);
