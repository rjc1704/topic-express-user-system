import express from "express";

import reviewService from "../services/reviewService.js";
import auth from "../middlewares/auth.js";
const reviewRouter = express.Router();

reviewRouter.post("/", auth.verifyAccessToken, async (req, res, next) => {
  const { userId } = req.auth;
  try {
    const createdReview = await reviewService.create({
      ...req.body,
      authorId: userId,
    });
    return res.status(201).json(createdReview);
  } catch (error) {
    return next(error);
  }
});

reviewRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const review = await reviewService.getById(id);
    return res.json(review);
  } catch (error) {
    return next(error);
  }
});

reviewRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await reviewService.getAll();
    return res.json(reviews);
  } catch (error) {
    return next(error);
  }
});

// TODO: auth.verifyAccessToken 대신 passport.authenticate 를 사용하세요
// auth.verifyReviewAuth 내부를 확인하고 passport 인증방식에 따라 변경해야할 부분을 찾아 수정하세요
reviewRouter.put(
  "/:id",
  auth.verifyAccessToken,
  auth.verifyReviewAuth,
  async (req, res, next) => {
    try {
      const updatedReview = await reviewService.update(req.params.id, req.body);
      return res.json(updatedReview);
    } catch (error) {
      return next(error);
    }
  },
);

reviewRouter.delete(
  "/:id",
  auth.verifyAccessToken,
  auth.verifyReviewAuth,
  async (req, res, next) => {
    try {
      const deletedReview = await reviewService.deleteById(req.params.id);
      return res.json(deletedReview);
    } catch (error) {
      return next(error);
    }
  },
);

export default reviewRouter;
