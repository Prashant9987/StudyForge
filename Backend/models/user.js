import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: {
        type: String,
      },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
  
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  userSchema.methods.isPasswordCorrect = async function (password) {
    console.log(password);
    console.log(this.password);
    
    return await bcrypt.compare(password, this.password);
  };

userSchema.methods.generateAccessTokens = async function () {
    return await jwt.sign(
      {
        _id: this._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
  };
  
  userSchema.methods.generateRefreshTokens = async function () {
    return await jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
  };

const User = mongoose.model("User", userSchema);

export default User;
