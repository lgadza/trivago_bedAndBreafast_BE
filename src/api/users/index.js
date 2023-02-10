import express from "express";
import createHttpError from "http-errors";
import { adminOnlyMiddleware } from "../../lib/auth/adminOnly.js";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import { createAccessToken } from "../../lib/auth/tools.js";
import UsersModel from "./model.js";
import passport from "passport";
import AccommodationsModel from "../accommodations/model.js";
import q2m from "query-to-mongo";

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.findOne({ email });
    const userCridentials = await UsersModel.checkCredentials(email, password);

    if (user && userCridentials) {
      const payload = {
        _id: userCridentials._id,
        role: userCridentials.role,
      };

      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else if (!user) {
      const newUser = new UsersModel(req.body);
      const user = await newUser.save();
      const payload = { _id: user._id, role: user.role };
      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get(
  "/",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const users = await UsersModel.find({});
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);
usersRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
usersRouter.get(
  "/googleRedirect",
  passport.authenticate("google", { session: false }),
  async (req, res, next) => {
    console.log(req.user);
    // res.send({ accessToken: req.user.accessToken });
    res.redirect(
      `${process.env.FE_DEV_URL}?accessToken=${req.user.accessToken}`
    );
  }
);

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.user._id);
    res.send(user);
  } catch (error) {
    next(error);
  }
});
usersRouter.get(
  "/me/accommodations",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const user = await UsersModel.findById(req.user._id).populate({
        path: "accommodations",
        select: "name description maxGuests city",
      });
      if (user) {
        res.send(user);
      } else {
        next(createHttpError(404, `Not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await UsersModel.findByIdAndUpdate(req.user._id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId);
    res.send(user);
  } catch (error) {
    next(error);
  }
});
usersRouter.put(
  "/:userId",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.delete(
  "/:userId",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UsersModel.checkCredentials(email, password);

    if (user) {
      const payload = { _id: user._id, role: user.role };

      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
