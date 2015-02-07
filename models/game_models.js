var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var gameSchema = mongoose.Schema({
    languageName:String,
    commonPhraseEnglish:String,
    commonPhraseOtherLanguage:String,
    forward:Boolean
});

var triviaSchema = mongoose.Schema({
	languageName: String,
	triviaQuestion: String,
	triviaAnswer: String,
	triviaOptions:[String]
});

var gameModel = mongoose.model("game",gameSchema);
var triviaModel = mongoose.model("trivia",triviaSchema);

exports.gameModel = gameModel;
exports.triviaModel = triviaModel;