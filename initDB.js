import readline from 'node:readline/promises'
import connectMongoose from './lib/mongooseConnection'
import Product from './models/Product'
import User from './models/User'

const connection = await connectMongoose()
console.log('connected to MongoDB')