import readline from 'node:readline/promises'
import connectMongoose from './lib/mongooseConnection'
import Product from './models/Product'
import User from './models/User'

const connection = await connectMongoose()
console.log('connected to MongoDB')

const answerCI = await ask('Are you sure you want to delete database collections? (n)')
if (answerCI.toLowerCase() !== 'y'){
    console.log('Not changes made to the database')
    process.exit(0)
}

await initUsers()
await initProducts()
await connection.close()

async function initProducts() {
    const deleteResult = await  Product.deleteMany()
    console.log(`Products: ${deleteResult.deletedCount} products deleted`)

    //find users to asign their ownership of a product
    const [userOne, userTwo] = await Promise.all([
        User.findOne({email: 'userOne@mail.com'}),
        User.findOne({email: 'userTwo@mail.com'}),
    ])

    //create products

    const inserProducts = await Product.insertMany([
        {name:'adidas boots', price: 600,image:'/assets/adidas-boots.jpg',tags:['sport','training','football'],owner: userOne._id},
        {name:'desktop', price: 1500,image:'/assets/desktop.jpg',tags:['tecnology','work','computer-parts'],owner: userOne._id},
        {name:'keyboard', price: 150,image:'/assets/keyboard.jpg',tags:['tecnology','work','computer-parts'],owner: userTwo._id},
        {name:'mouse pad', price: 200,image:'/assets/mouse-pad.jpg',tags:['tecnology','work','computer-parts'],owner: userTwo._id},
        {name:'nike ball', price: 95,image:'/assets/nike-ball.jpg',tags:['sport','training','football'],owner: userOne._id},
        {name:'papple visions', price: 2500,image:'/assets/papple-visions.jpg',tags:['tecnology','entertainment','computer-parts','work'],owner: userOne._id},
        {name:'pc gaming', price: 3500,image:'/assets/pc-gaming.jpg',tags:['tecnology','entertainment'],owner: userTwo._id},
        {name:'t-shirt', price: 25,image:'/assets/tshirt.jpg',tags:['fashion','lifestyle','men'],owner: userTwo._id},
    ])
}