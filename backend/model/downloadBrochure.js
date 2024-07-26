import mongoose from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [50, 'Name must be less than 50 characters long'],
    validate: {
      validator: function(v) {
        return validator.isAlpha(v.replace(/\s+/g, ''), 'en-US'); // Allows letters and spaces
      },
      message: props => `${props.value} is not a valid name!`
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
      validator: function(v) {
        return validator.isEmail(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        return validator.isMobilePhone(v, 'any', { strictMode: true });
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
});

const DownloadBrochure = mongoose.model("DownloadBrochure", schema);

export default DownloadBrochure;
