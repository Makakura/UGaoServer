var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// feedback Schema
var feedbackSchema = mongoose.Schema({
    catalogue: String,
    contain: String,
    dateCreate: Date,
    userId: String,
    userName: String,
    isDeleteFlag: Boolean,
    isRead: Boolean
});

var Feedback = module.exports = mongoose.model('Feedback', feedbackSchema);

// Get feedback
module.exports.getFeedbacks = function(callback, limit){
	Feedback.find({isDeleteFlag:false}, callback).limit(limit);
};
//Add feedback
module.exports.addFeedback = function(input, callback){
    console.log(input);
	Feedback.create(input, callback);
}
// Delete feedback
module.exports.removeFeedback = function(id, feedback, options, callback){
	var query = {_id: id};
	var update = {
		isDeleteFlag: true
	}
	Feedback.findOneAndUpdate(query, update, options, callback);
}