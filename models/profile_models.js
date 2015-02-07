var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var progressProfileSchema = mongoose.Schema({
    identifier:String,
    languageName:String,
    questionsGame1:[String],
    userScore:Number,
    questionsGame2:[String],
    numCompletions:Number
});

var highScoreSchema = mongoose.Schema({
	identifier:String,
	highScore1:Number,
	languages1:String,
	highScore2:Number,
	languages2:String,
	highScore3:Number,
	languages3:String
})

var progressProfileModel = mongoose.model("progressProfile",progressProfileSchema);
var highScoreModel = mongoose.model("highScore",highScoreSchema);
exports.progressProfileModel = progressProfileModel;
exports.highScoreModel = highScoreModel;