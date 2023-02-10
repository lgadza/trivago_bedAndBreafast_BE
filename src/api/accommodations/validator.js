import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const accommodationSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage:
        "Accommodation name is mandatory field and needs to be a string!",
    },
  },
  host: {
    in: ["body"],
    isString: {
      errorMessage: "Host is mandatory field and needs to be a string!",
    },
  },
  city: {
    in: ["body"],
    isString: {
      errorMessage: "City is mandatory field and needs to be a string!",
    },
  },
};

export const checkAccommodationSchema = checkSchema(accommodationSchema);
export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during Accommodation validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
