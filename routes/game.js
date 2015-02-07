var express = require('express');
var router = express.Router();
var url = require('url');
var models1 = require('../models/language_models.js');
var languageModel = models1.languageModel;
var models2 = require('../models/game_models.js');
var gameModel = models2.gameModel;
var triviaModel = models2.triviaModel;
var models3 = require('../models/profile_models.js');
var progressProfileModel = models3.progressProfileModel;
var highScoreModel = models3.highScoreModel;

var userPointsLives = {};
var LanguageCodes = {"Afrikaans":"af", "Albanian":"sq", "Arabic":"ar", "Azerbaijani":"az", "Basque":"eu","Bengali":"bn", "Belarusian":"be", "Bulgarian":"bg", "Catalan":"ca", "Chinese Simplified":"zh-CN",	"Chinese Traditional":"zh-TW", "Croatian":"hr", "Czech":"cs", "Danish":"da", "Dutch":"nl",	"Esperanto":"eo", "Estonian":"et", "Filipino":"tl", "Finnish":"fi", "French":"fr", "Galician":"gl",	"Georgian":"ka", "German":"de", "Greek":"el", "Gujarati":"gu", "Haitian (Creole)":"ht", "Hebrew":"iw","Hindi":"hi", "Hungarian":"hu", "Icelandic":"is", "Indonesian":"id", "Irish":"ga", "Italian":"it",	"Japanese":"ja", "Kannada":"kn", "Korean":"ko", "Latin":"la", "Latvian":"lv", "Lithuanian":"lt",	"Macedonian":"mk", "Malay":"ms", "Maltese":"mt", "Norwegian":"no", "Persian":"fa", "Polish":"pl","Portuguese":"pt", "Romanian":"ro", "Russian":"ru", "Serbian":"sr", "Slovak":"sk", "Slovenian":"sl","Spanish":"es", "Swahili":"sw", "Swedish":"sv", "Tamil":"ta", "Telugu":"te", "Thai":"th", "Turkish":"tr","Ukrainian":"uk", "Urdu":"ur", "Vietnamese":"vi", "Welsh":"cy", "Yiddish":"yi"};

//router.get('/', function(req, res) {

router.get('/',ensureAuthenticated, function(req, res) {
	//insertGameDataFromLanguageData();
	var languageArray = ["Afrikaans","Albanian","Arabic","Azerbaijani","Basque","Bengali","Belarusian","Bulgarian","Catalan","Chinese Simplified","Chinese Traditional","Croatian","Czech","Danish","Dutch","Esperanto","Estonian","Filipino","Finnish","French","Galician","Georgian","German","Greek","Gujarati","Hebrew","Hindi","Hungarian","Icelandic","Indonesian","Irish","Italian","Japanese","Kannada","Korean","Latin","Latvian","Lithuanian","Macedonian","Malay","Maltese","Norwegian","Persian","Polish","Portuguese","Romanian","Russian","Serbian","Slovak","Slovenian","Spanish","Swahili","Swedish","Tamil","Telugu","Thai","Turkish","Ukrainian","Urdu","Vietnamese","Welsh","Yiddish"];
	var gameArray = ["questionsGame1","questionsGame2"];
	var validLanguages = true;
	var urlParts = url.parse(req.url, true);
	var urlQueryGame = urlParts.query.whichGame;
	var urlQueryLanguages = [];
	var validGame = false;

	highScoreModel.findOne({identifier:req.user.id},function(error,highScoreData){
		if (!highScoreData){
			var newHighScoreModel = new highScoreModel({
				identifier:req.user.id,
				highScore1:0,
				languages1:"",
				highScore2:0,
				languages2:"",
				highScore3:0,
				languages3:""
			});
			newHighScoreModel.save(function(error){});
		}

		if (isInArray(urlQueryGame,gameArray)){
			validGame=true;
		}

		if (urlQueryGame==="questionsGame2"){
			if (!isInArray(urlParts.query.whichLanguage,languageArray)){
				validLanguages = false;
			}
			else {
				urlQueryLanguages.push(urlParts.query.whichLanguage);
			}
		}
		else if (urlQueryGame==="questionsGame1") {
			urlQueryLanguages = urlParts.query.whichLanguage.split(',');
			for (var i=0;i<urlQueryLanguages.length;i++){
				if (!isInArray(urlQueryLanguages[i],languageArray)){
					validLanguages = false;
				}
			}
		}
		else {
			validLanguages = false;
		}

		var stringOfLanguages = urlQueryLanguages[0];
		for (var s=0;s<urlQueryLanguages.length-1;s++){
			stringOfLanguages += ","+urlQueryLanguages[s+1];
		}

		if (validLanguages && validGame){
			gameModel.find({languageName:{$in:urlQueryLanguages}},function(error,gameData){
				if (gameData){
					triviaModel.find({languageName:{$in:urlQueryLanguages}},function(error,triviaData){
						if (triviaData){
							progressProfileModel.find({identifier:req.user.id,languageName:{$in:urlQueryLanguages}},function(error,profileDataArray){
								if (!(req.user.id in userPointsLives)){
									userPointsLives[req.user.id] = {
										currentPoints:0,
										currentLives:3
									}
								}
								if (urlQueryGame==="questionsGame1"){
									//var gameAdjusted = triviaData;
									var gameAdjusted = gameData.concat(triviaData);
								}
								else {
									var gameAdjusted = gameData;
								}
								for (var i=0;i<profileDataArray.length;i++){
									var profileData = profileDataArray[i];
									if (profileData){
										var doneQuestions = profileData[urlQueryGame];
										gameAdjusted = gameAdjusted.filter(function(element){
											return (!isInArray(element.id,doneQuestions));
										});
									}
								}
								if (gameAdjusted.length===0){
									res.render('game',{hasQuery:true,
														whichGame:urlQueryGame,
														whichLanguage:stringOfLanguages,
														isComplete:true,
														LanguageCodes:LanguageCodes});
								}
								else{
									var randInt = Math.floor(Math.random()*gameAdjusted.length);
									if (urlQueryGame==="questionsGame2"){
										if (profileDataArray[0]){
											var decimalProgress = profileDataArray[0].questionsGame2.length/gameData.length;								
										}
										else {
											var decimalProgress = 0;
										}
										res.render('game',{hasQuery:true,
															whichGame:"questionsGame2",
															randomGameData:gameAdjusted[randInt],
															isComplete:false,
															progress:decimalProgress,
															LanguageCodes:LanguageCodes});
									}
									else {
										if ("triviaQuestion" in gameAdjusted[randInt]){
											var answerchoices = gameAdjusted[randInt].triviaOptions;
											res.render('game',{hasQuery:true,
																whichGame:"questionsGame1",
																randomGameData:gameAdjusted[randInt],
																options:shuffle(answerchoices),
																languages:stringOfLanguages,
																isComplete:false,
																currentScore:userPointsLives[req.user.id].currentPoints,
																currentLives:userPointsLives[req.user.id].currentLives,
																LanguageCodes:LanguageCodes});
										}
										else {
											var forwardvalue = gameAdjusted[randInt].forward;
											gameModel.find({languageName:gameAdjusted[randInt].languageName,forward:forwardvalue},function(error,gameChangedData){
												var optionBank = gameChangedData;
												var index = 0;
												for (var q=0;q<optionBank.length;q++){
													if (optionBank[q].id===gameAdjusted[randInt].id){
														index = q;
													}
												}
												optionBank.splice(index,1);
												var options = [];
												for(var i = 0; i < 3; i++) {
													var index2 = Math.floor(Math.random()*optionBank.length)
													var option = optionBank[index2];
													options.push(option);
													optionBank.splice(index2,1);
												};
												var answerchoices = [];
												var answer = null;
												if (gameAdjusted[randInt].forward) {
													answer = gameAdjusted[randInt].commonPhraseOtherLanguage;
													answerchoices.push(answer);
													for (var b = 0; b < options.length; b++) {
														answerchoices.push(options[b].commonPhraseOtherLanguage);
													}
												}
												else {
													answer = gameAdjusted[randInt].commonPhraseEnglish;
													for (var j = 0; j < options.length; j++) {
														answerchoices.push(options[j].commonPhraseEnglish);
													}
													answerchoices.push(answer);
												}

												res.render('game',{hasQuery:true,
																	whichGame:"questionsGame1",
																	randomGameData:gameAdjusted[randInt],
																	options:shuffle(answerchoices),
																	languages:stringOfLanguages,
																	isComplete:false,
																	currentScore:userPointsLives[req.user.id].currentPoints,
																	currentLives:userPointsLives[req.user.id].currentLives,
																	LanguageCodes:LanguageCodes});
											});
										}
									}
								}
							});
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
			// gameModel.find({languageName:urlQueryLanguage},function(error,gameData){
			// 	profileModel.findOne({identifier:req.user.identifier},function(error,profileData){
			// 		console.log(profileData.languages);
			// 		var gameAdjusted = gameData;
			// 		if (profileData.languages){
			// 			var profileLanguage = profileData.languages.urlQueryLanguage;
			// 			if (profileLanguage){
			// 				var questionsGame = profileLanguage.questionsGame1;
			// 				if (questionsGame){
			// 					for (var commonPhrase in questionsGame){
			// 						if (questionsGame.commonPhrase.forward){
			// 							gameAdjusted.filter(function(element){
			// 								filterOut = element.languageName!==urlQueryLanguage && element.commonPhraseEnglish!==commonPhrase && !element.forward
			// 								return filterOut
			// 							});
			// 						}
			// 						if (questionsGame.commonPhrase.backward){
			// 							gameAdjusted.filter(function(element){
			// 								filterOut = element.languageName!==urlQueryLanguage && element.commonPhraseEnglish!==commonPhrase && element.forward
			// 								return filterOut
			// 							});
			// 						}
			// 					}
			// 				}
			// 			}
			// 		}
			// 		var randInt = Math.floor(Math.random()*gameAdjusted.length);
			// 		res.render('game',{hasQuery:true,randomGameData:gameAdjusted[randInt]});			
			// 	});
			// });
		}
		else {
			res.render('game',{hasQuery:false, languageArray:languageArray, LanguageCodes:LanguageCodes});
		}
	});


});

router.post('/submitAnswer',function(req,res){
	gameModel.findById(req.body.correctAnswer,function(error,correctGamePhrase){
		triviaModel.findById(req.body.correctAnswer,function(error,correctGameTrivia){
				var correctAnswer;
				if (correctGamePhrase){
					if (correctGamePhrase.forward){
						correctAnswer = correctGamePhrase.commonPhraseOtherLanguage;
					}
					else {
						correctAnswer = correctGamePhrase.commonPhraseEnglish;
					}
				}
				else if (correctGameTrivia) {
					correctAnswer = correctGameTrivia.triviaAnswer;
				}
				else {
					res.render('error');
				}
			
				if (correctAnswer.toLowerCase()===req.body.submittedAnswer.toLowerCase() || correctAnswer.toLowerCase()===(req.body.submittedAnswer.toLowerCase()+"?") || correctAnswer.toLowerCase()===("¿"+req.body.submittedAnswer.toLowerCase()+"?")){
					progressProfileModel.findOne({identifier:req.user.id,languageName:req.body.whichLanguage},function(error,profileData){
						if (req.body.whichGame==="questionsGame1"){
							userPointsLives[req.user.id].currentPoints += 1;
							if (profileData){
								var newScore = profileData.userScore+1;
								progressProfileModel.findOneAndUpdate({identifier:req.user.id,languageName:req.body.whichLanguage},{$push:{questionsGame1:req.body.correctAnswer},$set:{userScore:newScore}},function(error){
									res.send({message:"answerCorrect",
												whichGame:"questionsGame1",
												whichLanguage:req.body.whichLanguage,
												currentScore:userPointsLives[req.user.id].currentPoints,
												currentLives:userPointsLives[req.user.id].currentLives});
								});
							}
							else {
								var newProfile = new progressProfileModel({
									identifier:req.user.id,
									languageName:req.body.whichLanguage,
									questionsGame1:[req.body.correctAnswer],
									userScore:1,
									questionsGame2:[],
									numCompletions:0
								});
								newProfile.save(function(error){
									res.send({message:"answerCorrect",
												whichGame:"questionsGame1",
												whichLanguage:req.body.whichLanguage,
												currentScore:userPointsLives[req.user.id].currentPoints,
												currentLives:userPointsLives[req.user.id].currentLives});
								});
							}
						}
						else {
							if (profileData){
								progressProfileModel.findOneAndUpdate({identifier:req.user.id,languageName:req.body.whichLanguage},{$push:{questionsGame2:req.body.correctAnswer}},function(error){
									res.send({message:"answerCorrect",
												whichGame:"questionsGame2",
												whichLanguage:req.body.whichLanguage});
								});
							}
							else {
								var newProfile = new progressProfileModel({
									identifier:req.user.id,
									languageName:req.body.whichLanguage,
									questionsGame1:[],
									userScore:0,
									questionsGame2:[req.body.correctAnswer],
									numCompletions:0
								});
								newProfile.save(function(error){
									res.send({message:"answerCorrect",
												whichGame:"questionsGame2",
												whichLanguage:req.body.whichLanguage});
								});
							}
						}
					});
				}
				else {
					if (req.body.whichGame==="questionsGame1"){
						if (userPointsLives[req.user.id].currentLives>1){
							userPointsLives[req.user.id].currentLives -= 1
							res.send({message:"answerIncorrect",answer:correctAnswer,
										whichGame:"questionsGame1",
										whichLanguage:req.body.whichLanguage,
										currentScore:userPointsLives[req.user.id].currentPoints,
										currentLives:userPointsLives[req.user.id].currentLives});			
						}
						else {
							highScoreModel.findOne({identifier:req.user.id},function(error,highScoreData){
								if (highScoreData){
									var sortedScores = sortHighScores(highScoreData,userPointsLives[req.user.id].currentPoints,req.body.whichLanguage);
									highScoreModel.findOneAndUpdate({identifier:req.user.id},{$set:{
																								highScore1:sortedScores.highScore1,
																								languages1:sortedScores.languages1,
																								highScore2:sortedScores.highScore2,
																								languages2:sortedScores.languages2,
																								highScore3:sortedScores.highScore3,
																								languages3:sortedScores.languages3,																						
																							}},function(error){
										userPointsLives[req.user.id].currentLives = 3;
										res.send({message:"outOfLives",highScore:userPointsLives[req.user.id].currentPoints});
										userPointsLives[req.user.id].currentPoints = 0;
									});									
								}
								else {
									res.render("error");
								}
							});
						}
					}
					else {
						res.send({message:"answerIncorrect",
									whichGame:"questionsGame2",
									whichLanguage:req.body.whichLanguage,
									answer:correctAnswer});	
					}
				}
		});
	});

	// gameModel.findById(req.body.correctAnswer,function(error,correctGame){
	// 	var correctAnswer;
	// 	if (correctGame.forward){
	// 		correctAnswer = correctGame.commonPhraseOtherLanguage;
	// 	}
	// 	else {
	// 		correctAnswer = correctGame.commonPhraseEnglish;
	// 	}
	// 	var commonPhrase = correctGame.commonPhraseEnglish;
	// 	if (correctAnswer.toLowerCase()===req.body.submittedAnswer.toLowerCase()){
	// 		if (correctGame.forward){
	// 			profileModel.findOneAndUpdate({identifier:req.user.identifier},{$set:{languages:{urlQueryLanguage:{questionsGame1:{commonPhrase:{forward:true}}}}}},{upsert:true},function(error){
	// 				res.send("answerCorrect");
	// 			});
	// 		}
	// 		else {
	// 			profileModel.findOneAndUpdate({identifier:req.user.identifier},{$set:{languages:{urlQueryLanguage:{questionsGame1:{commonPhrase:{backward:true}}}}}},{upsert:true},function(error){
	// 				res.send("answerCorrect");
	// 			});
	// 		}
	// 	}
	// 	else {
	// 		res.send("answerIncorrect");
	// 	}
	// });
});

router.post('/startOver',function(req,res){
	if (req.body.whichGame==="questionsGame2"){
		progressProfileModel.findOne({identifier:req.user.id,languageName:req.body.whichLanguage},function(error,profileData){
			completionsCounter = profileData.numCompletions+1;
			progressProfileModel.findByIdAndUpdate(profileData.id,{$set:{numCompletions:completionsCounter,questionsGame2:[]}},function(error,updateData){
				if (updateData){
					res.redirect('/game?whichLanguage='+req.body.whichLanguage+'&whichGame='+req.body.whichGame);
				}
				else{
					res.render("error");
				}
			});
		});
	}
	else{
		queryLanguages = req.body.whichLanguage.split(',');
		// progressProfileModel.find({languageName:{$in:queryLanguages},identifier:req.user.id},function(error,data){
		// 	console.log(data);
		// });
		progressProfileModel.update({languageName:{$in:queryLanguages},identifier:req.user.id},{$set:{questionsGame1:[]}},{multi:true},function(error,updatedData){
			if (updatedData){
				res.redirect('/game?whichLanguage='+req.body.whichLanguage+'&whichGame='+req.body.whichGame);				
			}
			else {
				res.render("error");
			}
		});
	}
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/');
}


var isInArray = function(queryPart,languageArray){
	//console.log(languageArray);
	var isInside = false;
	for (var j=0;j<languageArray.length;j++){
		if (queryPart===languageArray[j]){
			isInside = true;
		}
	}
	return isInside;
}

var insertGameDataFromLanguageData = function(){
	languageModel.find({},function(error,languageData){
		for (var languageIndex=0;languageIndex<languageData.length;languageIndex++){
			var languageName = languageData[languageIndex].languageName;
			var commonPhrase = languageData[languageIndex].commonPhraseEnglish;
			var bestTranslation = languageData[languageIndex].commonPhraseTranslation;
			var newGameModelForward = makeModel(languageName,commonPhrase,bestTranslation,true);
			var newGameModelBackward = makeModel(languageName,commonPhrase,bestTranslation,false);
			newGameModelForward.save(function(error){
			});
			newGameModelBackward.save(function(error){
			});
		}
	});
	

	// for (var languageIndex=0;languageIndex<language.length;languageIndex++){
	// 	var languageObject = language[languageIndex];
	// 	for (var commonPhraseIndex=0;commonPhraseIndex<languageObject.commonPhrases.length;commonPhraseIndex++){
	// 		var commonPhraseObject = languageObject.commonPhrases[commonPhraseIndex];
	// 		var bestTranslation = "No valid translation available yet";
	// 		var maxTranslationPoints = 0;
	// 		for (var translationIndex=0;translationIndex<commonPhraseObject.translations.length;translationIndex++){
	// 			var translationObject = commonPhraseObject.translations[translationIndex];
	// 			var translationPoints = translationObject.upVotes.length-translationObject.downVotes.length*1.15;
	// 			if (translationPoints>=maxTranslationPoints){
	// 				bestTranslation = translationObject.translation;
	// 				maxTranslationPoints = translationPoints;
	// 			}
	// 		}
	// 		var newGameModelForward = makeModel(languageObject,commonPhraseObject,bestTranslation,true);
	// 		var newGameModelBackward = makeModel(languageObject,commonPhraseObject,bestTranslation,false);
	// 		newGameModelForward.save(function(error){
	// 		});
	// 		newGameModelBackward.save(function(error){
	// 		});
	// 	}
	// }
}

var makeModel = function(languageName,commonPhrase,bestTranslation,isForward){
	var newGameModel = new gameModel({
		languageName: languageName,
		commonPhraseEnglish: commonPhrase,
		commonPhraseOtherLanguage:bestTranslation,
		forward:isForward
	});
	return newGameModel;
}

var shuffle = function(array) {
	var currentIndex = array.length;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

var sortHighScores = function(highScoreData,newHighScore,currentLanguages){
	if (newHighScore>=highScoreData.highScore1){
		sortedScores = {
			highScore1:newHighScore,
			languages1:currentLanguages,
			highScore2:highScoreData.highScore1,
			languages2:highScoreData.languages1,
			highScore3:highScoreData.highScore2,
			languages3:highScoreData.languages2
		}
	}
	else if (newHighScore>=highScoreData.highScore2){
		sortedScores = {
			highScore1:highScoreData.highScore1,
			languages1:highScoreData.languages1,
			highScore2:newHighScore,
			languages2:currentLanguages,
			highScore3:highScoreData.highScore2,
			languages3:highScoreData.languages2
		}
	}
	else if (newHighScore>=highScoreData.highScore3){
		sortedScores = {
			highScore1:highScoreData.highScore1,
			languages1:highScoreData.languages1,
			highScore2:highScoreData.highScore2,
			languages2:highScoreData.languages2,
			highScore3:newHighScore,
			languages3:currentLanguages
		}		
	}
	else {
		sortedScores = highScoreData;
	}
	return sortedScores
}

module.exports = router;
