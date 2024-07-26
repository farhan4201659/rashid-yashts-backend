import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { sendCookie } from "../middlewares/sendCookie.js";
import { User } from "../model/users.js";
import { sendEmail } from "../utils/emailSend.js";
import { ErrorHandler } from "../utils/ErrorHandler.js"



// Sign Up User ------------------------> Are Creating User -----------------> Public


export const createUser = catchAsyncError(async (req, res, next) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please Fill All the Required Feilds", 400));
  }

  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler("User Already Exist With this email", 401));
  }

  user = await User.create({
    name: name,
    email: email,
    password: password,
  });

  const token = await user.activeLinkToken();

  const link = `${req.protocol}://${req.get("host")}/api/v1/user/verify-token/${token}`;

  sendEmail(name, email, link, "Verify Your Email Account", "Thank you for registering with us. Please verify your email address by clicking the button below:");

  user.activeToken = token;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Check Your Inbox to Verify Your Account",
  });

});


// Verify User ------------------------> Sign Up Completed

export const verifyUser = catchAsyncError(async (req, res, next) => {

  const { id: token } = req.params;

  if(!token){
    return next(new ErrorHandler("Please Enter the valid address" , 404));
  }

  const user = await User.findOneAndUpdate({ activeToken: token, activeTokenExpires: { $gt: Date.now() } },
    {
      isActive: true,
      activeToken: "",
      activeTokenExpires: Date.now(),
    }, { new: true });

  if (!user) {
    return next(new ErrorHandler("You Have Entered Invalid Token", 400));
  }

  sendCookie(user, res, 201 ,"You Have Successfully Verifed Your Account");

});


// Sign In  ------------------------> Public 

export const loginUser = catchAsyncError(async (req, res, next) => {

  const { email, password } = req.body;


  if (!email || !password) {
    return next(new ErrorHandler("Please Fill All The Required Feilds", 401));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("No User Exist with this Email Id", 401));
  }

  const comparePassword = await user.comparePassword(password);

  if (!comparePassword) {
    return next(new ErrorHandler("Password Doesn't Match"));
  }

  console.log(user);

  if(!user.isActive){
    return next(new ErrorHandler("Check Your Inbox to Verify Your Account" , 401));
  }
  
  sendCookie(user, res, 200);
  
});

// Verify Email Reequest Again  ------------------------> Public 

export const verifyEmailRequest = catchAsyncError(async (req, res, next) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Fill All The Required Feilds", 401));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("No User Exist with this Email Id", 401));
  }

  if(user.isActive){
    return next(new ErrorHandler(`${user.name} your email is  Alredy Verified. Please Login`, 400));
  }

  const comparePassword = await user.comparePassword(password);

  if (!comparePassword) {
    return next(new ErrorHandler("Password Doesn't Match"));
  }

  const token = await user.activeLinkToken();

  const link = `${req.protocol}://${req.get("host")}/api/v1/user/verify-token/${token}`;

  sendEmail("user", email, link, "Verify Your Email Account", "Thank you for registering with us. Please verify your email address by clicking the button below:");

  user.activeToken = token;

  await user.save();
  
  res.status(200).json({
    success : true,
    message : "An Verification Email has been sent . Please Verify Your Email Address",
  })
});


// Logout User ----------------------> Only Authenticated

export const logoutUser = catchAsyncError((req, res, next) => {

  res.cookie("token", "", {
    expires: new Date(Date.now())
  }).status(200).json({
    success: true,
    message: "Logout Successfully",
  })

});


// Get My Profile ----------------------> Only Authenticated

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new ErrorHandler("You cannot access this because you are logged In", 401));
  }

  res.status(200).json({
    success: true,
    user,
  })

});


// Edit My Profile Detials ----------------------> Only Authenticated

export const editMyProfile = catchAsyncError(async (req, res, next) => {

  const { name, email } = req.body;
  const { _id } = req.user;


  if (!name || !email) {
    return next(new ErrorHandler("Please Fill All The Required Feilds", 401));
  }

  const user = await User.findByIdAndUpdate(_id, {
    name: name,
    email: email,
  }, { new: true });

  res.status(200).json({
    success: true,
    user,
  });
});

// Edit My Password Detials ----------------------> Only Authenticated

export const editMyPassword = catchAsyncError(async (req, res, next) => {

  const { oldPassword, password, confirmPassword } = req.body;
  const user = req.user;

  if (!password || !confirmPassword || !oldPassword) {
    return next(new ErrorHandler("Please Fill All The Required Feilds", 401));
  }

  const oldPasswordConfirm = await user.comparePassword(oldPassword);

  if (!oldPasswordConfirm) {
    return next(new ErrorHandler("Old Password is not correct", 404));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password and Confirm Password Should Match"))
  }

  user.password = password;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Updated Successfully",
  });
});


// Forget Password  ------------------------> Public 

export const forgetPassword = catchAsyncError(async(req , res , next) => {
  
  const {email} = req.body;

  if(!email){
    return next(new ErrorHandler("Please Provide you Email Address to Reset Your Password" , 400));
  }
  
  const user = await User.findOne({email});

  if(!user){
    return next(new ErrorHandler("Please Provide Valid Email Address" , 404));
  }
  
  const token = await user.activeLinkToken();

  const link = `${req.protocol}://${req.get("host")}/api/v1/user/reset-password/${token}`;

  sendEmail(user.name, email, link, "Reset Password Link", `Dear ${user.name} Your Reset Password Link is Below. Please click on Button to reset Your Password`);

  user.activeToken = token;

  await user.save();

  res.status(200).json({
    success : true,
    message : "Please Check Your Email Address to Verify Your Email",
  })

});


// Reset Password  ------------------------> If Requested

export const resetPassword = catchAsyncError(async(req , res , next) => {
  
  const {token} = req.params;
  const {password , confirmPassword} = req.body;

  if(!token){
    return next(new ErrorHandler("Please Enter Valid Path" , 404));
  }

  if(!password || !confirmPassword){
    return next(new ErrorHandler("Please Fill Password and Confirm Password Correctly" , 400));
  }

  if(password !== confirmPassword){
    return next(new ErrorHandler("Your Password Doen't Match" , 400));
  }
  
  const user = await User.findOneAndUpdate({activeToken : token},{
    activeToken : null,
    activeTokenExpires : Date.now(),
  } , {new : true});

  if(!user){
    return next(new ErrorHandler("Your Link Has Been Expired or Invalid Token" , 404));
  }

  user.password = password;

  await user.save();

  sendCookie(user , res , 200 , "Password Reset Successfully");

});