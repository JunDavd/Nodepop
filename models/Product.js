import { name } from "ejs";
import mongoose, {Schema} from "mongoose";


const productSchema = new Schema({
    name: String,
    price: Number,
    image: String,
    tags: [String]
},{
    collection: 'productos'
})

const Product = mongoose.model('Producto', productSchema)

export default Product