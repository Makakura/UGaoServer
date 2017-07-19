var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// user Schema
var userSchema = mongoose.Schema({
	UserName: String,
    Pass: String,
    Birthday: Date,
    FullName: String,
    Phone: String,
    Email: String,
    Address: String,
    PushToken: String,
    Type: Number, // Role
    isActive: Boolean,
    DayUse: Number,
    DayRemain: Number
});

var User = module.exports = mongoose.model('User', userSchema);

// Get Users
module.exports.getUsers = function(callback, limit){
	User.find({Type: 1}, callback);
};
// Get Staff
module.exports.getStaffs = function(callback, limit){
	User.find({Type: 3}, callback);
};
// Get User by user name
module.exports.getUserByUserName = function(userName, callback){
	User.findOne({UserName:userName}, callback);
};
// Get User by user name
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}
// Add user
module.exports.addUser = function(user, callback){
	User.create(user, callback);
}
// Update user
module.exports.updateUser = function(id, user, options, callback){
	var query = {_id: id};
	var update = {
        Pass: user.Pass,
        Birthday: user.Birthday,
        FullName: user.FullName,
        Phone: user.Phone,
        Email: user.Email,
        Address: user.Address,
        PushToken: user.PushToken,
        Type: user.Type,
        isActive: user.isActive,
        DayUse: user.DayUse,
        DayRemain: user.DayRemain
	}
	User.findOneAndUpdate(query, update, options, callback);
}