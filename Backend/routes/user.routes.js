import User from "../models/user.js";
import { Router } from "express";
import { ApiError } from "../utils/Apierrors.js";
import { ApiResponse } from "../utils/Apiresponses.js";
const router = Router();

router.route("/signUp").post(async (req, res, next) => {
    try {
      const { fullname, email, password } = req.body;
      if (!fullname) throw new ApiError(400, "FullName is required");
      if (!email) throw new ApiError(400, "Email is required");
      if (!password) throw new ApiError(400, "Password is required");
  
      const existedUser = await User.findOne({ email });
      if (existedUser) throw new ApiError(409, "User with email already exists");
  
      const newUser = await User.create({ fullname, email, password });
      const createdUser = await User.findById(newUser._id).select("-password -refreshToken");
  
      if (!createdUser) throw new ApiError(500, "Not able to register the user");
  
      const { accessToken, refreshToken } = await generateAccessandRefreshTokens(createdUser._id);
      const options = { secure: true, sameSite: "None", httpOnly: true };
  
      res.cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options);
      return res.status(200).json(new ApiResponse(200, createdUser, "Successful Registration"));
    } catch (error) {
      next(error); 
    }
  });
  

const generateAccessandRefreshTokens = async (userid) => {
    try {
      const user = await User.findById(userid);
  
      const accessToken = await user.generateAccessTokens();
      if (!accessToken) throw new ApiError(500, "can't generate token");
      const refreshToken = await user.generateRefreshTokens();
      //saving refresh tokens in db and saving it without any validation
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(500, "Something went wrong while generating tokens");
    }
  };

router.route("/login").post(async (req, res) => {
    const { email, password } = req.body;

  if (!email) throw new ApiError(400, "UserName is required");
  if (!password) throw new ApiError(400, "password is required");

  const currentUser = await User.findOne({ email });
  console.log("current user :", currentUser);
  if (!currentUser) throw new ApiError(400, "Unknown User");

  const correctPassword = await currentUser.isPasswordCorrect(password);
  if (!correctPassword)
    throw new ApiError(400, "Please enter correct password");

  // const loggedinUser = User.findById(currentUser._id);

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    currentUser._id
  );

  //for security purpose of our cookies we set some options so that the cookies can only be modified from the server side and not from the frontend
  const options = {
    secure: true,
    sameSite: "None",
    httpOnly: true,
  };
  //new database call so that all the updated information can come in the new user
  const updatedloggedinUser = await User.findById(currentUser._id).select(
    "-password -refreshTokens"
  );
  console.log(updatedloggedinUser);
  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedloggedinUser, "Logged In SuccessFully"));
});



export default router;
