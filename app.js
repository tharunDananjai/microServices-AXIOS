const express  = require("express");
const app = express()
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json()); 
const dotenv = require("dotenv");
dotenv.config();

const Order = require('./Order')

const mongoose = require("mongoose");

mongoose.connect(process.env.DB)
const db = mongoose.connection

db.on("error",(err) =>{
    console.log(err);
})

db.once("open",() =>{
    console.log("Database is Connected");
})


// Create an order for a user
app.post("/order", async (req, res) => {
	const newOrder = {
		"name":req.body.name,
		"customerId":req.body.customerId,
		"amount":req.body.amount,
		"image":req.body.image,
		"createdAt":req.body.createdAt,
		"qty":req.body.qty,
	}
	const order = new Order(newOrder)
	order.save().then((orderObj) => {
		res.send(orderObj)
	}).catch( (err) => {
		if(err) {
			throw err
		}
	})
	
})


// Delete a single order
app.delete("/orders/:oid", async (req, res) => {
	Order.findByIdAndDelete(req.params.oid).then(() => {
		res.send("Order deleted with success...")
	}).catch( () => {
		res.sendStatus(404)
	})
})

// Delete all orders for a user
app.delete("/orders", async (req, res) => {
	Order.findOneAndDelete({customerId: req.query.uid}).then((o) => {
		if(o) {
			res.send({success:true})
		} else {
			res.sendStatus(404)
		}
	})
})

const PORT = 5000

app.listen(PORT, () => {
	console.log(`Server running in port--->${PORT}`)
})
