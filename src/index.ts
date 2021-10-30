import app from "./App";
import * as cors from "cors";
import * as path from "path";

require('dotenv').config({ path: path.normalize(__dirname+'/../.env') });

app.use(cors());
const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if (err) {
    console.error(`Error starting server: ${err}`);
    process.abort();
  }
  console.log(`Server is listening on port ${port}.`);
  return;
});
