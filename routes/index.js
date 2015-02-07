var express = require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var models = require('../models/language_models.js');
var models2 = require('../models/game_models.js');
var languageModel = models.languageModel;
var triviaModel = models2.triviaModel;


router.get('/', function(req, res) {

	// for (var i=0;i<triviaQuestions.length;i++){
	// 	var newTriviaModel = new triviaModel({
	// 		languageName: triviaQuestions[i].language,
	// 		triviaQuestion: triviaQuestions[i].question,
	// 		triviaAnswer: triviaQuestions[i].answer,
	// 		triviaOptions: triviaQuestions[i].options
	// 	});
	// 	console.log(newTriviaModel);
	// 	newTriviaModel.save(function(error){});
	// }

	// triviaModel.find({},function(error,data){
	// 	console.log(data.length);
	// });

	if (req.user){
		res.redirect('/profile');
	}
	else {
		res.render('index');
	}
});

// router.post('/ajaxRequest',function(req,res){
// 	var languageObjects = JSON.parse(Object.keys(req.body)[0]);
// 	//console.log(languageObjects);
// 	for (var i=0;i<languageObjects.length;i++){
// 		//console.log(languageObjects[i]);
// 		var newLanguageModel = new languageModel(languageObjects[i]);
// 		newLanguageModel.save(function(){});
// 	}
// 	//languageModel.find({},function(error,languageData){console.log(languageData)});
// });


router.get('/auth/facebook',
	passport.authenticate('facebook',{failureRedirect: '/'}),
	function(req,res){
		res.redirect('/profile');
	});

router.get('/auth/facebook/callback',
	passport.authenticate('facebook',{failureRedirect: '/'}),
	function(req,res){
		res.redirect('/profile');
	});

router.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
})

module.exports = router;
