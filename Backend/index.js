import dotenv from "dotenv";
import dbconnect from "./db/dbase.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});
dbconnect().then(() => {
  app.on("error", (error) => {
    console.error("Error :", error);
    throw error;
  });
  app.listen(process.env.PORT || 9000, () => {
    console.log(`Server started at port: ${process.env.PORT}`);
  });
});