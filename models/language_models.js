var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var languageSchema = mongoose.Schema({
    languageName:String,
    commonPhraseEnglish:String,
    commonPhraseTranslation:String,
    translationUpVotes:[String],
    translationDownVotes:[String]
});

var languageInfoSchema = mongoose.Schema({
	languageName:String,
	languageInfo:[]
})

var languageModel = mongoose.model("language",languageSchema);
var languageInfoModel = mongoose.model("languageInfo",languageInfoSchema);

exports.languageModel = languageModel;
exports.languageInfoModel = languageInfoModel;