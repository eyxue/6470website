var express = require('express');
var router = express.Router();
var models = require('../models/profile_models.js');
var progressProfileModel = models.progressProfileModel;
var highScoreModel = models.highScoreModel;
var models2 = require('../models/game_models.js');
var gameModel = models2.gameModel;
var triviaModel = models2.triviaModel;

router.get('/',ensureAuthenticated, function(req, res) {
	progressProfileModel.find({identifier:req.user.id},function(error,progressProfiles){
		var languagesData = {};
		if (progressProfiles.length!==0){
			for (var i=0;i<progressProfiles.length;i++)(function(i){
				var currentLanguageName = progressProfiles[i].languageName;
				languagesData[currentLanguageName] = {};
				languagesData[currentLanguageName].numCompletions = progressProfiles[i].numCompletions;
				var numAnswered = progressProfiles[i].questionsGame2.length;
				gameModel.find({languageName:currentLanguageName},function(error,gameData){
					var numTotal = gameData.length;
					languagesData[currentLanguageName].decimalComplete = numAnswered/numTotal;
					var canSend = true;
					for (var j in languagesData){
						if (!("decimalComplete" in languagesData[j])){
							canSend = false;
						}
					}
					if (canSend){
						var modifiedLanguagesData = {};
						for (var obj in languagesData){
							if (languagesData[obj].decimalComplete>0){
								modifiedLanguagesData[obj] = languagesData[obj];
							}
						}
						highScoreModel.findOne({identifier:req.user.id},function(error,highScoreData){
							if (highScoreData){
								res.render('profile',{username:req.user.displayName,
														languageData:modifiedLanguagesData,
														firstTime:false,
														highScore1:{
															score:highScoreData.highScore1,
															languages:highScoreData.languages1
														},
														highScore2:{
															score:highScoreData.highScore2,
															languages:highScoreData.languages2
														},
														highScore3:{
															score:highScoreData.highScore3,
															languages:highScoreData.languages3
														}
													});
							}
							else {
								res.render('profile',{username:req.user.displayName,
														languageData:modifiedLanguagesData,
														firstTime:false,
														highScore1:{
															score:0,
															languages:""
														},
														highScore2:{
															score:0,
															languages:""
														},
														highScore3:{
															score:0,
															languages:""
														}
													});
							}
						})

					}
					// if (Object.keys(languagesData).length===progressProfiles.length){
					// 	for (var j in languagesData){
					// 		if (!("decimalComplete" in languagesData[j])){
					// 			canSend = false;
					// 		}
					// 	}
					// 	if (canSend){
					// 		var modifiedLanguagesData = {};
					// 		for (var obj in languagesData){
					// 			if (languagesData[obj].gameScore>0 || languagesData[obj].decimalComplete>0){
					// 				modifiedLanguagesData[obj] = languagesData[obj];
					// 			}
					// 		}
					// 		res.render('profile',{username:req.user.displayName,
					// 								languageData:modifiedLanguagesData,
					// 								firstTime:false});
					// 	}
					// }
				});
			})(i);
		}
		else {
			res.render('profile',{username:req.user.displayName,
									languageData:[],
									firstTime:true});
		}
	});
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/');
}

module.exports = router;
