import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import userRouter from "./routes/userRouter.js";

import productRouter from "./routes/productRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

// TODO: passport 초기화 및 session 설정 추가

app.use("", userRouter);
app.use("/products", productRouter);
app.use("/reviews", reviewRouter);

app.use(errorHandler);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
