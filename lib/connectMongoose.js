import mongoose from "mongoose";

export default function connectMongoose() {
  return mongoose.connect().then((mongoose) => mongoose.connection);
}
