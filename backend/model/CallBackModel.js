import mongoose from "mongoose";
import validator from "validator";


const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [50, 'Name must be less than 50 characters long'],
    validate: {
      validator: function (v) {
        return validator.isAlpha(v.replace(/\s+/g, ''), 'en-US'); // Allows letters and spaces
      },
      message: props => `${props.value} is not a valid name!`
    }
  },

  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function (v) {
        return validator.isMobilePhone(v, 'any', { strictMode: true });
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },

  status: {
    type: String,
    default: "pending",
    requierd: true,
  }
});

export const CallBack = mongoose.model("CallBack", schema);