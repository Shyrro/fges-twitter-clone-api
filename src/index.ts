import app from "./App";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";

require('dotenv').config({ path: path.normalize(__dirname+'/../.env') });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if (err) {
    console.error(`Error starting server: ${err}`);
    process.abort();
  }
  console.log(`Server is listening on port ${port}.`);
  return;
});
