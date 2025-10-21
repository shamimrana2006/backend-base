import app from "./app";
import { port } from "./config/secrete";

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});


