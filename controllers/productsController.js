import Product from "../models/Product.js";

export function index(req,res,next){
    res.render('add-product')
}

export async function addProduct(req,res,next) {

    try {
        const {name, price,image,tags} = req.body
        const userId = req.session.userId
        
        const product = new Product({
            name,
            price,
            image,
            tags,
            owner: userId,
        })
    
        await product.save()
        res.redirect('/') 
    } catch (error) {
        next(error)
    }
}

export async function deleteProdcut(req,res,next) {
    try {
        const userId = req.session.userId
        const productId = req.params.productId
        await Product.deleteOne({_id: productId, owner: userId})
        res.redirect('/')
    } catch (error) {
        next(error)
    }
}