import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import validator from "validator";
import DownloadBrochure from "../model/Broucher.js";
import { sendEmail } from "../utils/emailSend.js";


export const createDetails = catchAsyncError(async (req, res, next) => {

  const { phone } = req.body;

  if (!phone) {
    return next(new ErrorHandler('Must Provide Valid Phone Number', 400));
  }

  // Create new document
  const newDetail = new DownloadBrochure({
    phone: "+" + phone,
  });

  // Save the document
  await newDetail.save();

  try {

    await sendEmail("" , "Broucher Download" , phone , `Broucher has been Download by ${phone}`);

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

  const allDetails = await DownloadBrochure.find();

  res.status(201).json({
    success: true,
    allDetails,
  });

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
