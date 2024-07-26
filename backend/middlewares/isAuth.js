import { User } from "../model/users.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncError(async (req , res , next) => {
  const {token} = req.cookies;

  if(!token){
    return next(new ErrorHandler("Please Login First to access this path" , 401));
  }

  const {id} = jwt.verify(token , process.env.JWT_SECRET);

  if(!id){
    return next(new ErrorHandler("You Are Providing an Fake Token which is not acceptable" , 401));
  }

  req.user = await User.findById(id);

  next();
})