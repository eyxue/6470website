var express = require('express');
var router = express.Router();
var url = require('url');
var models = require('../models/language_models.js');
var languageModel = models.languageModel;
var languageInfoModel = models.languageInfoModel;
var models2 = require('../models/game_models.js');
var gameModel = models2.gameModel;
var models3 = require('../models/profile_models.js');
var progressProfileModel = models3.progressProfileModel;
var parseWiki = require('wiki-infobox-parser');

router.get('/',ensureAuthenticated, function(req, res) {
	// var newLanguageModel = new languageModel({
	// 	languageName:"French",
	// 	commonPhraseEnglish:"I want to go there",
	// 	commonPhraseTranslation:"Je veux y aller",
	// 	translationUpVotes:[],
	// 	translationDownVotes:["82374983274"]
	// })
	// newLanguageModel.save(function(error){});

	var languageArray = ["Afrikaans","Albanian","Arabic","Azerbaijani","Basque","Bengali","Belarusian","Bulgarian","Catalan","Chinese Simplified", "Chinese Traditional", "Croatian","Czech","Danish","Dutch","Esperanto","Estonian","Filipino","Finnish","French","Galician","Georgian","German","Greek","Gujarati","Hebrew","Hindi","Hungarian","Icelandic","Indonesian","Irish","Italian","Japanese","Kannada","Korean","Latin","Latvian","Lithuanian","Macedonian","Malay","Maltese","Norwegian","Persian","Polish","Portuguese","Romanian","Russian","Serbian","Slovak","Slovenian","Spanish","Swahili","Swedish","Tamil","Telugu","Thai","Turkish","Ukrainian","Urdu","Vietnamese","Welsh","Yiddish"];

	// var wikiStuff = {
	// 	nativeTo:"France",
	// 	speakers:"75 million",
	// 	languageFamily:"Indo-European"
	// }
	// var newLanguageInfo = new languageInfoModel({
	// 	languageName:"French",
	// 	languageInfo:[wikiStuff]
	// });
	// console.log(newLanguageInfo);
	// newLanguageInfo.save(function(error){});
	// languageInfoModel.find({},function(error,data){
	// 	var languages = []
	// 	for (var i=0;i<data.length;i++){
	// 		languages.push(data[i].languageName);
	// 	}
	// 	console.log(languages);
	// })
	res.render('language',{languageArray:languageArray});
});

router.post('/selectLanguage',function(req,res){
	var selectedLanguage = req.body.whichLanguage;
	languageModel.find({languageName:selectedLanguage},function(error,selectedLanguageData){
		if (selectedLanguageData){
			var modifiedLanguageData = {};
			for (var languageIndex=0;languageIndex<selectedLanguageData.length;languageIndex++){
				var languageObject = selectedLanguageData[languageIndex];
				var commonPhraseInEnglish = languageObject.commonPhraseEnglish;
				var translation = languageObject.commonPhraseTranslation;
				if (modifiedLanguageData[commonPhraseInEnglish]){
					modifiedLanguageData[commonPhraseInEnglish][translation] = {};
					modifiedLanguageData[commonPhraseInEnglish][translation].upVotes=languageObject.translationUpVotes.length;
					modifiedLanguageData[commonPhraseInEnglish][translation].downVotes=languageObject.translationDownVotes.length;
				}
				else {
					modifiedLanguageData[commonPhraseInEnglish] = {};
					modifiedLanguageData[commonPhraseInEnglish][translation] = {};
					modifiedLanguageData[commonPhraseInEnglish][translation].upVotes=languageObject.translationUpVotes.length;
					modifiedLanguageData[commonPhraseInEnglish][translation].downVotes=languageObject.translationDownVotes.length;
				}
			}
			languageInfoModel.findOne({languageName:selectedLanguage},function(error,languageInfoData){
				if (languageInfoData){
					if (languageInfoData){
						wikiData = languageInfoData.languageInfo[0];
						res.send({languageModifiedData:modifiedLanguageData,selectedLanguage:req.body.whichLanguage,wikiData:wikiData});
					}
					else {
						res.send({languageModifiedData:modifiedLanguageData,selectedLanguage:req.body.whichLanguage,wikiData:{}});
					}
				}
			});			
		}
		else {
			res.render("error");
		}
	});

	// languageModel.findOne({languageName:urlQueryLanguage},function(error,specificLanguageDataObject){
	// 	console.log(specificLanguageDataObject);
	// 	res.render('language',{specificLanguageData:specificLanguageDataObject,
	// 							hasQuery:true});
	// });
});

router.post('/addTranslation',function(req,res){
	var submitted = req.body.submittedTranslation;
	if (submitted.length>0 && submitted.length<100 && submitted.indexOf("<")===-1 && submitted.indexOf(">")===-1){
		languageModel.find({languageName:req.body.languageName,commonPhraseEnglish:req.body.commonPhraseEnglish,commonPhraseTranslation:req.body.submittedTranslation},function(error,languageData){
			if (languageData){
				if (languageData.length===0){
					var newLanguageModel = new languageModel({
						languageName:req.body.languageName,
						commonPhraseEnglish:req.body.commonPhraseEnglish,
						commonPhraseTranslation:req.body.submittedTranslation,
						translationUpVotes:[],
						translationDownVotes:[]
					});
					newLanguageModel.save(function(error){
						res.send({translation:req.body.submittedTranslation,index:req.body.index});
					});
				}
				else {
					res.send("translationExists");
				}
			}
			else {
				res.render("error");
			}
		});
	}
	else {
		res.send("Invalid Input");
	}
});

router.post('/upVote',function(req,res){
	languageModel.findOne({languageName:req.body.languageName,commonPhraseEnglish:req.body.commonPhraseEnglish,commonPhraseTranslation:req.body.commonPhraseTranslation},function(error,languageData){
		if (languageData){
			var currentUpVotes = languageData.translationUpVotes;
			var currentDownVotes = languageData.translationDownVotes;

			if (isInArray(req.user.id,languageData.translationDownVotes)){
				var indexOfUser = currentDownVotes.indexOf(req.user.id);
				currentDownVotes.splice(indexOfUser,1);
				currentUpVotes.push(req.user.id);
				languageModel.findByIdAndUpdate(languageData.id,{$set:{translationDownVotes:currentDownVotes,translationUpVotes:currentUpVotes}},function(error,updatedData){
					updateGame(req,res,updatedData,req.body.index);
				});
			}
			else if (isInArray(req.user.id,languageData.translationUpVotes)){
				res.send("alreadyUpVoted");
			}
			else {
				currentUpVotes.push(req.user.id);
				languageModel.findByIdAndUpdate(languageData.id,{$set:{translationUpVotes:currentUpVotes}},function(error,updatedData){
					updateGame(req,res,updatedData,req.body.index);
				});
			}
		}
		else {
			res.render("error");
		}
	});
});

router.post('/downVote',function(req,res){
	languageModel.findOne({languageName:req.body.languageName,commonPhraseEnglish:req.body.commonPhraseEnglish,commonPhraseTranslation:req.body.commonPhraseTranslation},function(error,languageData){
		if (languageData){
			var currentUpVotes = languageData.translationUpVotes;
			var currentDownVotes = languageData.translationDownVotes;

			if (isInArray(req.user.id,languageData.translationUpVotes)){
				var indexOfUser = currentUpVotes.indexOf(req.user.id);
				currentUpVotes.splice(indexOfUser,1);
				currentDownVotes.push(req.user.id);
				languageModel.findByIdAndUpdate(languageData.id,{$set:{translationUpVotes:currentUpVotes,translationDownVotes:currentDownVotes}},function(error,updatedData){
					updateGame(req,res,updatedData,req.body.index);
				});
			}
			else if (isInArray(req.user.id,languageData.translationDownVotes)){
				res.send("alreadyDownVoted");
			}
			else {
				currentDownVotes.push(req.user.id);
				languageModel.findByIdAndUpdate(languageData.id,{$set:{translationDownVotes:currentDownVotes}},function(error,updatedData){
					updateGame(req,res,updatedData,req.body.index);
				});
			}
		}
		else {
			res.render("error");
		}
	});
});

router.post('/addCommonPhrase',function(req,res){
	progressProfileModel.findOne({identifier:req.user.id,languageName:req.body.languageName},function(error,userData){
		if (userData){
			if (req.user.id==="10205496269157236" || userData.numCompletions>0){
				var withinBounds = req.body.submittedCommonPhrase.length>0 && req.body.submittedTranslation.length>0 && req.body.submittedCommonPhrase.length<100 && req.body.submittedTranslation.length<100;
				var noScriptInject = req.body.submittedCommonPhrase.indexOf("<")===-1 && req.body.submittedTranslation.indexOf(">")===-1 && req.body.submittedCommonPhrase.indexOf(">")===-1 && req.body.submittedTranslation.indexOf("<")===-1;
				if (withinBounds && noScriptInject){
					languageModel.find({languageName:req.body.submittedCommonPhrase},function(error,languageData){
						if (languageData.length===0){
							var newLanguageModel = makeLanguageModel(req.body.languageName,req.body.submittedCommonPhrase,req.body.submittedTranslation);
							var newGameModel1 = makeGameModel(req.body.languageName,req.body.submittedCommonPhrase,req.body.submittedTranslation,true);
							var newGameModel2 = makeGameModel(req.body.languageName,req.body.submittedCommonPhrase,req.body.submittedTranslation,false);
							newLanguageModel.save(function(error){});
							newGameModel1.save(function(error){});
							newGameModel2.save(function(error){});
							res.send({message:"success",commonPhraseEnglish:req.body.submittedCommonPhrase,commonPhraseTranslation:req.body.submittedTranslation});
						}
						else {
							res.send({message:"Common phrase already exists"});
						}
					});
				}
				else {
					res.send({message:"Invalid inputs"});
				}
			}
			else {
				res.send({message:"You must be an admin or complete the learning sequence once before adding a common phrase."});
			}
		}
		else {
			res.send({message:"You must be an admin or complete the learning sequence once before adding a common phrase."});
		}
	});
});

var updateGame = function(req,res,updatedData,gameIndex){
	languageModel.find({languageName:updatedData.languageName,commonPhraseEnglish:updatedData.commonPhraseEnglish},function(error,languageTranslations){
		if (languageTranslations){
			var maxLanguagePoints = -100;
			var bestTranslation;
			for (var languageIndex=0;languageIndex<languageTranslations.length;languageIndex++){
				var currentLanguagePoints = languageTranslations[languageIndex].translationUpVotes.length*0.99-languageTranslations[languageIndex].translationDownVotes.length*1.15;
				if (currentLanguagePoints>maxLanguagePoints){
					maxLanguagePoints = currentLanguagePoints;
					bestTranslation = languageTranslations[languageIndex];
				}
			}
			gameModel.update({languageName:bestTranslation.languageName,commonPhraseEnglish:bestTranslation.commonPhraseEnglish},{$set:{commonPhraseOtherLanguage:bestTranslation.commonPhraseTranslation}},{multi:true},function(error,updatedGame){
				if (updateGame){
					res.send({data:updatedData,index:gameIndex});
				}
				else {
					res.render("error");
				}
			});
		}
		else {
			res.render("error");
		}
	});
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}

var isInArray = function(queryPart,languageArray){
	var isInside = false;
	for (var j=0;j<languageArray.length;j++){
		if (queryPart===languageArray[j]){
			isInside = true;
		}
	}
	return isInside;
}

var makeLanguageModel = function(languageName,commonPhrase,bestTranslation){
	var newLanguageModel = new languageModel({
		languageName:languageName,
	    commonPhraseEnglish:commonPhrase,
	    commonPhraseTranslation:bestTranslation,
	    translationUpVotes:[],
	    translationDownVotes:[]
	});
	return newLanguageModel;
}

var makeGameModel = function(languageName,commonPhrase,bestTranslation,isForward){
	var newGameModel = new gameModel({
		languageName: languageName,
		commonPhraseEnglish: commonPhrase,
		commonPhraseOtherLanguage:bestTranslation,
		forward:isForward
	});
	return newGameModel;
}

module.exports = router;
