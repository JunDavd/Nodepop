import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import {
  createTransport,
  sendEmail,
  generatePreviewURL,
} from "../lib/emailManager.js";

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    age: Number,
    address: {
      city: { type: String, lowercase: true, trim: true },
      postalCode: { type: String },
    },
    phone: [String],
    passWord: String,
  },
  {
    collection: "users",
  }
);

//method to hash password of the model
userSchema.statics.hashPassword = (clearPassword) => {
  return bcrypt.hash(clearPassword, 9);
};

//method of the instance of User.
//compare clearpasswors with the hashed password of the instance
userSchema.methods.comparePassword = function (clearPassword) {
  return bcrypt.compare(clearPassword, this.passWord);
};

userSchema.methods.sendEmail = async function (subject, body) {
  const transport = createTransport();
  const result = await sendEmail({
    transport,
    to: this.email,
    subject,
    body,
  });
  const previewURL = generatePreviewURL(result);
  console.log("Email simulado:", previewURL);
};

const User = mongoose.model("User", userSchema);

export default User;
