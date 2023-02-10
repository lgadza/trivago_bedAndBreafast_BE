import express from "express";
import AccommodationsModel from "./model.js";
import { checkAccommodationSchema, triggerBadRequest } from "./validator.js";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import { adminOnlyMiddleware } from "../../lib/auth/adminOnly.js";

const accommodationRouter = express.Router();

accommodationRouter.post(
  "/",
  checkAccommodationSchema,
  triggerBadRequest,
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const newAccommodation = new AccommodationsModel(req.body);
      const { _id } = await newAccommodation.save();
      res.status(201).send({ _id });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
accommodationRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accommodations = await AccommodationsModel.find({});
    res.send(accommodations);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
accommodationRouter.get("/:accommodationId", async (req, res, next) => {
  try {
    const accommodation = await AccommodationsModel.findById(
      req.params.accommodationId
    );
    res.send(accommodation);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
accommodationRouter.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
});
accommodationRouter.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default accommodationRouter;
