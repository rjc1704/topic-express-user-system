import express from "express";

import reviewService from "../services/reviewService.js";

const reviewRouter = express.Router();

reviewRouter.post("/", async (req, res, next) => {
  const { userId } = req.user;
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

reviewRouter.put("/:id", async (req, res, next) => {
  try {
    const updatedReview = await reviewService.update(req.params.id, req.body);
    return res.json(updatedReview);
  } catch (error) {
    return next(error);
  }
});

reviewRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedReview = await reviewService.deleteById(req.params.id);
    return res.json(deletedReview);
  } catch (error) {
    return next(error);
  }
});

export default reviewRouter;
