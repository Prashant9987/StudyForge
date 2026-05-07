import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { ApiError } from "../utils/Apierrors.js";

const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(401, "Invalid token");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token expired"));
    }
    next(error);
  }
};

export default authMiddleware;
