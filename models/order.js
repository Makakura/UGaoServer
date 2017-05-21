var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Order Schema
var orderSchema = mongoose.Schema({
    OwnerId: String,
    OrderDetails: { type : Array , "default" : [] },
	Total: Number,
    Status: Number, // 1 Đặt hàng, 2 Đã xác nhận, 3 đã chuyển đi, 4 đơn hàng thành công, 0 đơn hàng bị hủy
	Name: String,
	Shipper: {},
	PhoneNumber: String,
    Address: String,
	Note: String,
	OrderDate: Date,
    OrderSuccessDate: Date
});

var Order = module.exports = mongoose.model('Order', orderSchema);

// Get Order
module.exports.getOrders = function(callback, limit){
	Order.find(callback).limit(limit);
};
// Get Order by id
module.exports.getOrderById = function(id, callback){
	Order.findById(id, callback);
}

// Get Order by  user id
module.exports.getOrderByUserId = function(value, callback){
	Order.find({OwnerId: value}, callback);
}
// Get Order by  shipper id
module.exports.getOrderByShipperId = function(value, callback){
	Order.find({"Shipper._id" : value}, callback);
}
// Get Order by  confirmed
module.exports.getOrderByStatus = function(value, callback){
	Order.find({Status: value}, callback);
}
//Add Order
module.exports.addOrder = function(order, callback){
	var myDate=new Date();
	var inputDate = new Date(myDate.toISOString());
	console.log(myDate+" "+inputDate);
	order.OrderDate=inputDate;
	console.log("sss"+order.OrderDate);
	Order.create(order, callback);
}
// Update Order
module.exports.updateOrder = function(id, order, options, callback){
	var query = {_id: id};
	var update = {
		OwnerId: order.OwnerId,
		OrderDetails: order.OrderDetails,
		Total: order.Total,
        Status: order.Status,
		Name: order.Name,
        PhoneNumber: order.PhoneNumber, 
		Address: order.Address,
		Note: order.Note,
		OrderDate: order.OrderDate,
        OrderSuccessDate: order.OrderSuccessDate
	}
	Order.findOneAndUpdate(query, update, options, callback);
}

module.exports.removeOrder = function(id, callback){
	var query = {_id: id};
	Order.remove(query, callback);
}
// Update Order
module.exports.updateOrderStatus = function(id, order, options, callback){
	var query = {_id: id};
	var myDate=new Date();
	var inputDate = new Date(myDate.toISOString());
	console.log(myDate+" "+inputDate);
	var update = {
        Status: order.Status,
		Shipper:order.Shipper,
		OrderSuccessDate: inputDate
	}
	Order.findOneAndUpdate(query, update, options, callback);
}
// Update Order
module.exports.updateOrder = function(id, order, options, callback){
	var query = {_id: id};

	//console.log(myDate+" "+inputDate);
	
	var update = {
		OwnerId: order.OwnerId,
		OrderDetails: order.OrderDetails,
		Total: order.Total,
        Status: order.Status,
		Name: order.Name,
		ShipperID: order.ShipperID,
        PhoneNumber: order.PhoneNumber, 
		Address: order.Address,
		Note: order.Note,
		OrderDate: order.OrderDate,
        OrderSuccessDate: order.OrderSuccessDate
	}
	Order.findOneAndUpdate(query, update, options, callback);
}
//lấy hóa đơn nhân viên giao hàng đã giao trong ngày
module.exports.getOrderByShipperIdInCurrentDay = function(value, callback){
	var myDate=new Date();
	myDate.setHours(0);
	myDate.setMinutes(0);
	myDate.setSeconds(0);
	Order.find({"Shipper._id": value,OrderSuccessDate: {$gte: myDate }}, callback);
}
module.exports.getOrderByShipperIdInMonth = function(value, callback){
	var beginDay=new Date();
	beginDay.setHours(0);
	beginDay.setMinutes(0);
	beginDay.setSeconds(0);
	beginDay.setDate(1);
	var endDay=new Date();
	endDay.setHours(23);
	endDay.setMinutes(59);
	endDay.setSeconds(59);
	endDay.setDate(31);
	Order.find({"Shipper._id": value,OrderDate: {$gte: beginDay,$lte:endDay }},callback);
}
module.exports.getSuccessOrderByDay=function(callback){
	//var myDate=new Date(2017,1,1);
	var myDate=new Date();
	myDate.setHours(0);
	myDate.setMinutes(0);
	myDate.setSeconds(0);
	var inputDate = new Date(myDate.toISOString());
	//console.log(myDate+" "+inputDate);
	console.log(myDate+" "+inputDate);
	Order.find({Status: 4,OrderSuccessDate: {$gte: myDate }},callback);
}
module.exports.getOrderByDay=function(callback){
	var myDate=new Date();
	myDate.setHours(0);
	myDate.setMinutes(0);
	myDate.setSeconds(0);
	var inputDate = new Date(myDate.toISOString());
	console.log(myDate+" "+inputDate);
	Order.find({OrderDate: {$gte: myDate }},callback);
}
module.exports.getOrderByCurrentMonth=function(callback){
	var beginDay=new Date();
	beginDay.setHours(0);
	beginDay.setMinutes(0);
	beginDay.setSeconds(0);
	beginDay.setDate(1);
	var endDay=new Date();
	endDay.setHours(23);
	endDay.setMinutes(59);
	endDay.setSeconds(59);
	endDay.setDate(31);
	Order.find({OrderDate: {$gte: beginDay,$lte:endDay }},callback);
}

