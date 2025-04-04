import mongoose, {Schema} from "mongoose";

//schema od the product, include index
const productSchema = new Schema({
    name: String,
    price: Number,
    image: String,
    tags: [String],
    owner: {type: Schema.Types.ObjectId, ref: 'User', index: true}
},{
    collection: 'products'
})

const Product = mongoose.model('Products', productSchema)

export default Product