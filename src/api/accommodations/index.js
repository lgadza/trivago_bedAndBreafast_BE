import express from "express";
import AccommodationsModel from "./model.js";
import { checkAccommodationSchema, triggerBadRequest } from "./validator.js";

const accommodationRouter = express.Router();

accommodationRouter.post(
  "/",
  checkAccommodationSchema,
  triggerBadRequest,
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

export default accommodationRouter;
