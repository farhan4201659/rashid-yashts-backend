import mongoose from "mongoose";
import validator from "validator";


const schema = new mongoose.Schema({
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

const Broucher = mongoose.model("Broucher" , schema);

export default Broucher;