import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import validator from "validator";
import DownloadBrochure from "../model/downloadBrochure.js";
import { sendEmail } from "../utils/emailSend.js";


export const createDetails = catchAsyncError(async (req, res, next) => {

  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return next(new ErrorHandler('All fields are required', 400));
  }

  // Validate email
  if (email && !validator.isEmail(email)) {
    return next(new ErrorHandler('Invalid email format', 400));
  }


  // Create new document
  const newDetail = new DownloadBrochure({
    name: name || "Download Without Name",
    email: email || "Download Without Email",
    phone: "+" + phone,
  });

  // Save the document
  await newDetail.save();


  try {
    await sendEmail(name, `New Broucher Download By ${name}`, phone, `${name} his Phone Number is ${phone} You can Contact Him`);

  } catch (error) {
    console.log(error);
  }

  res.status(201).json({
    success: true,
    message: 'Details created successfully',
    data: newDetail
  });
});

export const getAllDetails = catchAsyncError(async (req, res, next) => {
  try {

    const allDetails = await DownloadBrochure.find();

    res.status(201).json({
      success: true,
      allDetails,
    });
  } catch (error) {
    return next(new ErrorHandler('Server error', 500));
  }
});

export const deleteDetails = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const detail = await DownloadBrochure.findByIdAndDelete(id);

  if (!detail) {
    return next(new ErrorHandler('Detail not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Detail deleted successfully'
  });
});
