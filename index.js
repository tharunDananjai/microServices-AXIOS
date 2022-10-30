// Load express
const express  = require("express");
const app = express()
const bodyParser = require("body-parser");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json()); 

const mongoose = require("mongoose");
const User = require('./User')

mongoose.connect(process.env.DB)
const db = mongoose.connection

db.on("error",(err) =>{
    console.log(err);
})

db.once("open",() =>{
    console.log("Database is Connected");
})

//const sampleUrl = "http://localhost:5000/orders"

// GET all users
app.get("/users",async (req, res) => {
	try{
		let users = await User.find//.then((users) => {
			res.send(users)
	}catch(error) {
		res.status(400).json({ error: error }) 
	}	
	
})

// GET single user
app.get("/users/:uid",async (req, res) => {
	try{
		let user = await User.findById(req.params.uid)//.then((user) => {
		if(user){
			res.json(user)
		} else {
			res.json("user not found")
		}
	}catch(error){
		res.status(400).json({ error: error })
	}
})

// ------------------------->GET all orders for an user
app.get("/users/:uid/orders", async (req, res) => {
	try{
		const orders = await axios.get(`http://localhost:5000/orders?uid=${req.params.uid}`)
			if(orders) {
				console.log(orders);
			}			
			else{
				res.json("user not found")
			}
	}catch(error){
		res.json({ error: error })
	}
})


// Create new user
app.post("/user", async (req, res) => {
	const newUser = {
		"firstName":req.body.firstName,
		"lastName": req.body.lastName,
		"email":req.body.email,
		"phone": req.body.phone,
		"address": req.body.address,
		"orders": req.body.orders
	}
	const user = new User(newUser)
	user.save().then((r) => {
		res.send("User created..")
	}).catch( (err) => {
		if(err) {
			throw err
		}
	})
	
})

// Create new order for an user

app.post("/users/:uid/order", async (req, res) => {
	try {
		const orderResponse = await axios.post("http://localhost:5000/order",{
			name:req.body.name,
			customerId: mongoose.Types.ObjectId(req.params.uid),
			amount:req.body.amount,
			image:req.body.image,
			createdAt:req.body.createdAt,
			qty:req.body.qty
		})
		
		if(orderResponse.status === 200) {
			User.findById(req.params.uid, (err, user) => {
				user.orders.push(orderResponse.data._id)
				user.save().then(() => {
					res.send(`Order created for user:${user.email} with orderId:${orderResponse.data._id}`)
				}).catch(e => {
					res.send("failed to add orderId in user's doc")
				})
			})	
		} else {
			res.send("Order not created..")
		}
	} catch (error) {
		res.json({ error: error })
		
	}
})

// Delete user by userId
app.delete("/users/:uid", async (req, res) => {
	try{
		let userDelete = await User.findByIdAndDelete(req.params.uid)//.then(() => {
			res.send("User deleted with success...")
	}catch(error){
		res.sendStatus(error)
	}
})

// Delete all the orders for an user
app.delete("/users/:uid/orders", async (req, res) => {
	axios.delete(`http://localhost:5000/orders?uid=${req.params.uid}`).then( delRes => {
		if(delRes.data.success) {
			res.send("Orders deleted..")
		} else {
			res.sendStatus(404).send(delRes.data)
		}
	}).catch( (err) => {
		res.sendStatus(404).send(err)
	})
})


const PORT = 6000
app.listen(PORT, () => {
	console.log(`Server running in port-->${PORT}`)
})