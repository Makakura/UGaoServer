var mongoose = require('mongoose');
//var fs = require('fs');
//var multer = require('multer');
var Schema = mongoose.Schema;
// item Schema
var itemSchema = mongoose.Schema({
    available: Boolean,
    description:  String,
    image:  String,
    name:  String,
    price: Number,
    stock: Number
});

var Item = module.exports = mongoose.model('Item', itemSchema);

// Get item
module.exports.getItems = function(callback, limit){
	Item.find(callback).limit(limit);
};
// Get item by id
module.exports.getItemById = function(id, callback){
	Item.findById(id, callback);
}
// Get item by  user id
module.exports.getItemByUserId = function(userId, callback){
	Item.find({OwnerId: userId}, callback);
}
// Get item by  fields id
module.exports.getItemByFieldId = function(fieldId, callback){
	Item.find({FieldId: fieldId}, callback);
}
//Add item
module.exports.addItem = function(input, callback){
    console.log(input);
	Item.create(input, callback);
}
// Update item
module.exports.updateItem = function(id, item, options, callback){
	var query = {_id: id};
	var update = {
		available: item.available,
		description: item.description,
        image: item.image,
        name: item.name,
		price: item.price,
        stock: item.stock//,
	}
	Item.findOneAndUpdate(query, update, options, callback);
}
// Delete item
module.exports.removeItem = function(id, callback){
	var query = {_id: id};
	Item.remove(query, callback);
}