import mongoose, { Schema } from "mongoose"


const userSchema = new Schema({
    name: String,
    email: String,
    age: Number,
    address: {
        city: {type:  String, lowercase: true, trim: true},
        postalCode: {type: String}
    },
    phone: [String],
    passWord: String
},{
    collection: 'users'
})

const User = mongoose.model('User', userSchema)

export default User
