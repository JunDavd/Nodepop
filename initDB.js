import readline from "node:readline/promises";
import connectMongoose from "./lib/connectMongoose.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const connection = await connectMongoose();
console.log("connected to MongoDB");

const answerCI = await askCI(
  "Are you sure you want to delete database collections? (n)"
);
if (answerCI.toLowerCase() !== "y") {
  console.log("Not changes made to the database");
  process.exit(0);
}

await initUsers();
await initProducts();
await connection.close();

async function initProducts() {
  const deleteResult = await Product.deleteMany();
  console.log(`Products: ${deleteResult.deletedCount} products deleted`);

  //find users to asign their ownership of a product
  const [userOne, userTwo] = await Promise.all([
    User.findOne({ email: "admin@example.com" }),
    User.findOne({ email: "user1@example.com" }),
  ]);

  //create products

  const insertProducts = await Product.insertMany([
    {
      name: "cellphone",
      price: 120,
      image: "cellphone.jpg",
      tags: ["mobile"],
      owner: userOne._id,
    },
    {
      name: "desktop",
      price: 1500,
      image: "desktop.jpg",
      tags: ["tecnology", "work"],
      owner: userOne._id,
    },
    {
      name: "keyboard",
      price: 150,
      image: "keyboard.jpg",
      tags: ["tecnology", "work"],
      owner: userTwo._id,
    },
    {
      name: "mouse pad",
      price: 200,
      image: "mouse-pad.jpg",
      tags: ["tecnology", "work"],
      owner: userTwo._id,
    },
    {
      name: "motor v8",
      price: 5000,
      image: "v8-motor.jpg",
      tags: ["motor"],
      owner: userOne._id,
    },
    {
      name: "papple visions",
      price: 2500,
      image: "papple-visions.jpg",
      tags: ["tecnology", "work"],
      owner: userOne._id,
    },
    {
      name: "pc gaming",
      price: 3500,
      image: "pc-gaming.jpg",
      tags: ["tecnology"],
      owner: userTwo._id,
    },
    {
      name: "t-shirt",
      price: 25,
      image: "tshirt.jpg",
      tags: ["lifestyle"],
      owner: userTwo._id,
    },
  ]);
  console.log(`Products: ${insertProducts.length} items inserted`);
}

async function initUsers() {
  const deleteResult = await User.deleteMany();
  console.log(`Users: ${deleteResult.deletedCount} users deleted`);

  //create users

  const insertUsers = await User.insertMany([
    {
      name: "Roberto",
      email: "admin@example.com",
      age: 35,
      address: { city: "Bogotá", postalCode: "110141" },
      passWord: await User.hashPassword("1234"),
    },
    {
      name: "Juan",
      email: "user1@example.com",
      age: 28,
      address: { city: "Bogotá", postalCode: "110161" },
      passWord: await User.hashPassword("1234"),
    },
  ]);
  console.log(`Users: ${insertUsers.length} users inserted`);
}

async function askCI(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const askResult = await rl.question(question);
  rl.close();
  return askResult;
}
