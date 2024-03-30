import express from "express";
import displayRoutes from "express-routemap";

import config from "./config.js";
import productRouter from "./routes/products.routes.js";

const app = express();

app.use("/api", productRouter)

app.listen(config.PORT, () => {
  displayRoutes(app);
  console.log(`Server up on port ${config.PORT}`)
})