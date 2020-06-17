import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import HttpError from "./models/http-error";
import { router as placesRoutes } from "./routes/places-routes";
import { router as usersRoutes } from "./routes/users-routes";

const app = express();

app.use(bodyParser.json());

app.use("/api/users", usersRoutes);
app.use("/api/places", placesRoutes);

app.use((req, res, next) => {
  const error = new HttpError(404, "Could not find this route");
  throw error;
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

mongoose
  .connect(
    "mongodb+srv://nikita:Nikita12345@cluster0-wi8ed.mongodb.net/places?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => app.listen(5000))
  .catch((err) => console.log(err));
