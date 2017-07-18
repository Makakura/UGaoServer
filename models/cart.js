var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Cart Schema
var cartSchema = mongoose.Schema({
    OwnerId: String,
    OrderDetails: { type : Array , "default" : [] },
    Total: Number,
	ItemChange: Boolean
});

var Cart = module.exports = mongoose.model('Cart', cartSchema);

// Get Cart
module.exports.getCarts = function(callback, limit){
	Cart.find(callback).limit(limit);
};
// Get Cart by  user id
module.exports.getCartByUserId = function(userId, callback){
	Cart.findOne({OwnerId: userId}, callback);
}
//Add Cart
module.exports.addCart = function(cart, callback){
	Cart.create(cart, callback);
}
// Update Cart
module.exports.updateCart = function(id, cart, options, callback){
	var query = {_id: id};
	var update = {
		OwnerId: cart.OwnerId,
		OrderDetails: cart.OrderDetails,
		Total: cart.Total,
		ItemChange: cart.ItemChange
	}
	Cart.findOneAndUpdate(query, update, options, callback);
}