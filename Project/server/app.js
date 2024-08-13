
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
import postRoutes from './routes/posts.js';

const app = express();


app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use('/posts', postRoutes);

const CONNECTION_URL = 'mongodb+srv://js_mastery:123123123@practice.jto9p.mongodb.net/test';
const routes = require("./routes");
const { routeNotFound, errorHandler } = require("./middlewares");


app.use(morgan("tiny"));
app.use(cookieParser());
app.use(express.json());
app.use("/api/", routes);
app.use(routeNotFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  mongoose.connect(process.env.MONGO_URL);
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
  });
}

module.exports = app;