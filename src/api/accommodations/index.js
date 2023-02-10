import express from "express";
import AccommodationsModel from "./model.js";
import { checkAccommodationSchema, triggerBadRequest } from "./validator.js";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import { adminOnlyMiddleware } from "../../lib/auth/adminOnly.js";
import UsersModel from "../users/model.js";

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
      const targetUser = await UsersModel.findByIdAndUpdate(req.user._id, {
        $push: { accommodations: _id },
      });
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
accommodationRouter.put(
  "/:accommodationId",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const updatedAccommodation = await AccommodationsModel.findByIdAndUpdate(
        req.params.accommodationId,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      res.send(updatedAccommodation);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
accommodationRouter.delete(
  "/:accommodationId",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const deletedAccommodation = await AccommodationsModel.findByIdAndDelete(
        req.params.accommodationId
      );
      if (deletedAccommodation) {
        res.status(204).send();
      } else {
        next(
          createHttpError(
            404,
            `Accommodation with id ${req.params.accommodationId} not found!`
          )
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default accommodationRouter;
