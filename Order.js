const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	customerId: {
		type: mongoose.SchemaTypes.ObjectId,
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	createdAt: {
		type: String,
		required: true
	},
	qty: {
		type: Number,
		required: false
	}

})
const Order  = mongoose.model('Order', userSchema);

module.exports = Order;