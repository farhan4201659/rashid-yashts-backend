import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { CallBack } from "../model/CallBackModel.js";
import { sendEmail } from "../utils/emailSend.js";
import { ErrorHandler } from "../utils/ErrorHandler.js"; // Ensure ErrorHandler is properly imported

export const createCallBack = catchAsyncError(async (req, res, next) => {
  const { name, phone } = req.body;

  // Validate request body
  if (!name || !phone) {
    return next(new ErrorHandler('All fields are required', 400));
  }

  // Create new document
  const newDetail = new CallBack({
    name,
    phone: "+" + phone, // Assuming phone number needs a "+" prefix
  });

  // Save the document
  await newDetail.save();

  try {
    
  const emailData = await sendEmail(name , `New CallBack Request ${name}` , phone , `${name} has been requested for a call from ${phone}`);

  console.log(emailData);
  } catch (error) {
    console.log(error , "Error");    
  }

  res.status(201).json({
    success: true,
    message: 'Details created successfully',
    data: newDetail,
  });
});

export const getAllCallBack = catchAsyncError(async (req, res, next) => {
  
  const data = await CallBack.find();

  res.status(201).json({
    success: true,
    message: 'Details created successfully',
    data
  });
});


export const updateCallBack = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const detail = await CallBack.findById(id);

  if (!detail) {
    return next(new ErrorHandler('Detail not found', 404));
  }

  detail.status = status;

  // Save the document
  await detail.save();

  res.status(200).json({
    success: true,
    message: 'Details updated successfully',
    data: detail,
  });
});

export const deleteCallBack = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const detail = await CallBack.findByIdAndDelete(id);

  if (!detail) {
    return next(new ErrorHandler('Detail not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Details deleted successfully',
    data: detail,
  });
});
