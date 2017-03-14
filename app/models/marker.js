//define model for markers

var mongoose	= require('mongoose');
var Schema	= mongoose.Schema;


var MarkerSchema = new Schema({
    title: String,
    type: String,
    content: String,
    author: String,
    time: Date,
    xLocation: Number,
    yLocation: Number,
});

MarkerSchema.statics.findByTitle = function(title, currentOB){
	return this.find({ title: new RegExp(title, 'i')}, currentOB);
};

module.exports = mongoose.model('Marker', MarkerSchema);