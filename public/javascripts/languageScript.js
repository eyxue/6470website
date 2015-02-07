
var LanguageCodes = {"Afrikaans":"af", "Albanian":"sq", "Arabic":"ar", "Azerbaijani":"az", "Basque":"eu","Bengali":"bn", "Belarusian":"be", "Bulgarian":"bg", "Catalan":"ca", "Chinese Simplified":"zh-CN",	"Chinese Traditional":"zh-TW", "Croatian":"hr", "Czech":"cs", "Danish":"da", "Dutch":"nl",	"Esperanto":"eo", "Estonian":"et", "Filipino":"tl", "Finnish":"fi", "French":"fr", "Galician":"gl",	"Georgian":"ka", "German":"de", "Greek":"el", "Gujarati":"gu", "Haitian (Creole)":"ht", "Hebrew":"iw","Hindi":"hi", "Hungarian":"hu", "Icelandic":"is", "Indonesian":"id", "Irish":"ga", "Italian":"it",	"Japanese":"ja", "Kannada":"kn", "Korean":"ko", "Latin":"la", "Latvian":"lv", "Lithuanian":"lt",	"Macedonian":"mk", "Malay":"ms", "Maltese":"mt", "Norwegian":"no", "Persian":"fa", "Polish":"pl","Portuguese":"pt", "Romanian":"ro", "Russian":"ru", "Serbian":"sr", "Slovak":"sk", "Slovenian":"sl","Spanish":"es", "Swahili":"sw", "Swedish":"sv", "Tamil":"ta", "Telugu":"te", "Thai":"th", "Turkish":"tr","Ukrainian":"uk", "Urdu":"ur", "Vietnamese":"vi", "Welsh":"cy", "Yiddish":"yi"};



    // //var host = "http://YOUR SERVER PATH GOES HERE";
    // // Global variables
    // var audioContext;
    // var audio_buffer = 0;
    // // function to respond when the Enter key is hit
    // var setup_select_menu = function(){
    //     var languages = [
    //             { "language": "ar", "name": "Arabic" },
    //             { "language": "bg", "name": "Bulgarian" },
    //             { "language": "ca", "name": "Catalan" },
    //             { "language": "zh-CHS", "name": "Chinese (Simplified)" },
    //             { "language": "zh-CHT", "name": "Chinese (Traditional)" },
    //             { "language": "cs",  "name": "Czech"  },
    //             { "language": "da",  "name": "Danish" },
    //             { "language": "nl",  "name": "Dutch"  },
    //             { "language": "en",  "name": "English" },
    //             { "language": "et",  "name": "Estonian" },
    //             { "language": "fa",  "name": "Persian (Farsi)" },
    //             { "language": "fi",  "name": "Finnish" },
    //             { "language": "fr",  "name": "French" },
    //             { "language": "de",  "name": "German" },
    //             { "language": "el",  "name": "Greek" },
    //             { "language": "ht",  "name": "Haitian Creole" },
    //             { "language": "iw",  "name": "Hebrew" },
    //             { "language": "hi",  "name": "Hindi" },
    //             { "language": "hu",  "name": "Hungarian" },
    //             { "language": "id",  "name": "Indonesian" },
    //             { "language": "it",  "name": "Italian" },
    //             { "language": "ja",  "name": "Japanese" },
    //             { "language": "ko",  "name": "Korean" },
    //             { "language": "lv",  "name": "Latvian" },
    //             { "language": "lt",  "name": "Lithuanian" },
    //             { "language": "ms",  "name": "Malay" },
    //             { "language": "mww", "name": "Hmong Daw" },
    //             { "language": "no",  "name": "Norwegian" },
    //             { "language": "pl",  "name": "Polish" },
    //             { "language": "pt",  "name": "Portuguese" },
    //             { "language": "ro",  "name": "Romanian" },
    //             { "language": "ru",  "name": "Russian" },
    //             { "language": "sr",  "name": "Serbian" },
    //             { "language": "sk",  "name": "Slovak" },
    //             { "language": "sl",  "name": "Slovenian" },
    //             { "language": "es",  "name": "Spanish" },
    //             { "language": "sv",  "name": "Swedish" },
    //             { "language": "th",  "name": "Thai" },
    //             { "language": "tr",  "name": "Turkish" },
    //             { "language": "uk",  "name": "Ukrainian" },
    //             { "language": "ur",  "name": "Urdu" },
    //             { "language": "vi",  "name": "Vietnamese" }
    //           ];
    //     var str = "<option value='en' selected>English</option>";
    //     $('#language').append(str);
    //     for(var i=0; i< languages.length; i++) {
    //         if(languages[i]['language'] != 'en') {
    //             str = "<option value='" + languages[i]['language'] + "'>" + languages[i]['name'] + "</option>";
    //             $('#language').append(str);
    //         }
    //     }
    // }
    // var submit_query = function(){
    //     var query    = $('#query').val();
    //     var language = $('#language').val();
    //     if(query != '') {
    //         var url = './text_to_speech_web_audio_api?query="' + query + '"&language=' + language;
    //         load_audio(url);
    //     }
    // }
    // // load the sound from a URL
    // function load_audio(url) {
    //     var request = new XMLHttpRequest();
    //     request.open('GET', url, true);
    //     request.responseType = 'arraybuffer';
    //     // When loaded decode the data and store the audio buffer in memory
    //     request.onload = function() {
    //         audioContext.decodeAudioData(request.response, function(buffer) {
    //             audio_buffer = buffer;
    //             play_audio(audio_buffer);
    //         }, onError);
    //     }
    //     request.send();
    // }
    // function play_audio(buffer) {
    //     var audioSourceNode = audioContext.createBufferSource();
    //     audioSourceNode.buffer = audio_buffer;
    //     audioSourceNode.connect(audioContext.destination);
    //     audioSourceNode.noteOn(0);
    // }
    // // log if an error occurs
    // function onError(e) {
    //     console.log(e);
    // }


$(document).ready(function(){
	$("#langData").addClass("closed")
	$(".select-language-form").on("submit",function(e){
		e.preventDefault();
		$.ajax({
			url:$(this).attr("action"),
			type:"POST",
			data:$(this).serialize(),
			beforeSend: function(){
			},
			success:function(languageData){
				var adjustedEnglishData = Object.keys(languageData.languageModifiedData).sort();
				$(".languages").animate({width: "0px"}, 650);
				$(".languages").hide(0);
				$('#langData').show(0);
				$("#langData").removeClass("closed").addClass("langData");
				$("#langData").animate({width: "1195px"}, 650);
				$("<div id='data-close'>").appendTo("#langData");
				$("<i class='fa fa-arrow-circle-o-left' id='language-back'>").appendTo('#data-close');
				$("<div class='dataHead'>").text(languageData.selectedLanguage).appendTo('#langData');
				$('#langData').append("<div class='language-data'>");
				$("<div class='lang-info'>").appendTo(".language-data");
				$('.language-data').append("<div class='data-table'>");
				$("<div class='lang-row lang-data-container'>").appendTo('.data-table');
				$(".lang-data-container").append("<div class='lang-cell column1'>"+"</div>"+"<div class='lang-cell column2'>"+"</div>");
				$("<div class='bottomLang'>").appendTo('.language-data');

				// if (languageData.wikiData){
				wikiInfo = languageData.wikiData;
				//console.log(languageData.wikiData);
				if (languageData.selectedLanguage.substring(0,7)==="Chinese"){
					var picLanguage = "Chinese";
				}
				else {
					var picLanguage = languageData.selectedLanguage;
				}

				$(".lang-info").append("<div class='lang-info-content'>"+
										"<img src=./images/languagePics/"+picLanguage+".jpg />"+
										"<p>Native Countries: "+wikiInfo.nativeTo+"</p>"+
										"<p>Language Family: "+wikiInfo.languageFamily+"</p>"+
										"<p>Number of Native Speakers: "+wikiInfo.speakers+"</p>"+
										"<hr id='langBreak' />"+
										"<p id='phraseHead'>Phrases:</p>"+
										"</div>");
				// 	$(".lang-info").append("<div class='lang-cell'>");
				// 	if (wikiInfo.nativename){
				// 		$(".lang-info").append("<p>"+"Native Name: "+wikiInfo.nativename+"</p>");					
				// 	}
				// 	if (wikiInfo.familycolor){
				// 		$(".lang-info").append("<p>"+"Family: "+wikiInfo.familycolor+"</p>");					
				// 	}
				// 	if (wikiInfo.speakers){
				// 		$(".lang-info").append("<p>"+"Number of Speakers: "+wikiInfo.speakers+"</p>");					
				// 	}
				// 	if (wikiInfo.nation){
				// 		$(".lang-info").append("<p>"+"Nation: "+wikiInfo.nation+"</p>");
				// 	}
				// 	$(".lang-info").append("</div>");
				// }
			

				var translations = languageData.languageModifiedData;
				for (var i=0;i<adjustedEnglishData.length;i++){
					var englishCommonPhrase = adjustedEnglishData[i];

					var translationsCommonPhrase = "";

					var translationsArray = Object.keys(translations[englishCommonPhrase]);
					translationsArray.sort(function(a,b){
						aPoints = translations[englishCommonPhrase][a].upVotes*0.99 - translations[englishCommonPhrase][a].downVotes*1.15;
						bPoints = translations[englishCommonPhrase][b].upVotes*0.99 - translations[englishCommonPhrase][b].downVotes*1.15;
						return bPoints-aPoints;
					});

					for (var j=0;j<translationsArray.length;j++){
						var translatedCommonPhrase = translationsArray[j];

						if (languageData.selectedLanguage==="Spanish" && translatedCommonPhrase.substring(translatedCommonPhrase.length-1)==="?" && translatedCommonPhrase.substring(0,1)!=="¿"){
							var modifiedTranslatedCommonPhrase = "¿"+translatedCommonPhrase;
						}
						else {
							var modifiedTranslatedCommonPhrase = translatedCommonPhrase;
						}

						translationsCommonPhrase += "<div class='translations-row'>"+
															"<div class='translations-cell'>"+
																"<p>"+modifiedTranslatedCommonPhrase+"</p>"+
															"</div>"+
															"<div class='translations-cell'>" +
															//'<a class="voiceSource" href="http://translate.google.com/translate_tts?key=AIzaSyAFnSwfXuVKTKzJTzVfB1i93z_BZ2Eu0-M&ie=utf-8&tl=' + LanguageCodes[languageData.selectedLanguage] + '&q=' + translatedCommonPhrase + '." rel="noreferrer">' +
															"<button type='submit' id='voice-button' class='textToVoice-button' rel='noreferrer' value='"+translatedCommonPhrase+"''>"+
															//"<form class='textToVoice-form' action='language/downVote' rel='noreferrer' method='post'>"+
															//'<input type="hidden" name="commonPhraseTranslation" rel="noreferrer" value="'+translatedCommonPhrase+'">'+
															'<input type="hidden" name="languageCode" rel="noreferrer" value="'+LanguageCodes[languageData.selectedLanguage]+'">' +
															//"<div class='voiceSource'>"+
															//'<a class="voiceSource" href="http://translate.google.com/translate_tts?key=AIzaSyAFnSwfXuVKTKzJTzVfB1i93z_BZ2Eu0-M&ie=utf-8&tl=' + LanguageCodes[languageData.selectedLanguage] + '&q=' + translatedCommonPhrase + '" rel="noreferrer"></a>'
															// 		"<button type='submit' class='textToVoice-button' value='voice'></button>"+
															//"</div>"+
															//"</form>"+
															"&#xf028;</button>"+
															//'</a>' +
															"</div>"+
															"<div class='translations-cell'>"+
																"<form class='up-vote-form' action='language/upVote' method='post'>"+
																	"<input type='hidden' name='languageName' value='"+languageData.selectedLanguage+"'>"+
																	'<input type="hidden" name="commonPhraseEnglish" value="'+englishCommonPhrase+'">'+
																	'<input type="hidden" name="commonPhraseTranslation" value="'+translatedCommonPhrase+'">'+
																	"<input type='hidden' name='index' value='"+i+"r"+j+"'>"+
																	"<button type='submit' class='vote' id='up'>&#xf102;</button>"+
																"</form>"+
															"</div>"+
															"<div class='translations-cell upVote"+i+"r"+j+"'>"+
																"<p>"+translations[englishCommonPhrase][translatedCommonPhrase].upVotes+"</p>"+
															"</div>"+
															"<div class='translations-cell'>"+
																"<form class='down-vote-form' action='language/downVote' method='post'>"+
																	"<input type='hidden' name='languageName' value='"+languageData.selectedLanguage+"'>"+
																	'<input type="hidden" name="commonPhraseEnglish" value="'+englishCommonPhrase+'">'+
																	'<input type="hidden" name="commonPhraseTranslation" value="'+translatedCommonPhrase+'">'+
																	"<input type='hidden' name='index' value='"+i+"r"+j+"'>"+
																	"<button type='submit' class='vote' id='down'>&#xf103;</button>"+
																"</form>"+
															"</div>"+
															"<div class='translations-cell downVote"+i+"r"+j+"'>"+
																"<p>"+translations[englishCommonPhrase][translatedCommonPhrase].downVotes+"</p>"+
															"</div>"+

														"</div>";
					}

					var addTranslation = "<form class='add-translation-form' action='language/addTranslation' method='post'>"+
											"<input type='hidden' name='languageName' value='"+languageData.selectedLanguage+"'>"+
											'<input type="hidden" name="commonPhraseEnglish" value="'+englishCommonPhrase+'">'+
											"<input type='hidden' name='index' value='"+i+"'>"+
											"<input type='text' class='form-control' id='add-trans-form' name='submittedTranslation' placeholder='Add a better translation'>"+
											"<button type='submit' class='vote' id='add'>&#xf0fe;</button>"+
										"</form>";

					if (i<adjustedEnglishData.length/2){
						$('.column1').append("<div class='language-row'>"+
														"<div class='language-cell'>"+
															"<p>"+englishCommonPhrase+"</p>"+
														"</div>"+
														"<div class='language-cell'>"+
															"<div class='translations-container "+i+"'"+
																translationsCommonPhrase+
																addTranslation+
															"</div>"+
														"</div>"+
													"</div>");						
					}
					else {
						$('.column2').append("<div class='language-row'>"+
														"<div class='language-cell'>"+
															"<p>"+englishCommonPhrase+"</p>"+
														"</div>"+
														"<div class='language-cell'>"+
															"<div class='translations-container "+i+"'"+
																translationsCommonPhrase+
																addTranslation+
															"</div>"+
														"</div>"+
													"</div>");						
					}
						// if (i===adjustedEnglishData.length-1 && i%2===1){
						// 	$(.'language-data').append("</div>");
						// }
				}

				var addCommonPhrase = "<div class='add-common-phrase-container'>"+
											"<p>Add A Common Phrase</p>"+
											"<form class='add-common-phrase-form' action='language/addCommonPhrase' method='post'>"+
												"<input type='hidden' name='languageName' value='"+languageData.selectedLanguage+"'>"+
												"<input type='text' class='form-control' id='add-phrase' name='submittedCommonPhrase' placeholder='English Phrase'>"+
												"<input type='text' class='form-control' id='add-phrase1' name='submittedTranslation' placeholder='Translation'>"+
												"<button type='submit' id='add-phrase-button'>&#xf0fe;</button>"+
											"</form>"+
										"</div>";

				var addGame2Button = "<button id='learn-button'><a href='/game?whichLanguage="+languageData.selectedLanguage+"&whichGame=questionsGame2'>LEARN <i class='fa fa-chevron-right'></i></a></button>";

				$('.bottomLang').append(addCommonPhrase+addGame2Button);

				$(".add-translation-form").on("submit",function(f){
					f.preventDefault();
					$.ajax({
						url:$(this).attr("action"),
						type:"POST",
						data:$(this).serialize(),
						beforeSend: function(){
						},
						success:function(message){
							if (message==="translationExists"){
								alert("Translation Exists");
							}
							else if (message==="Invalid Input"){
								alert("Invalid Input");
							}
							else {
								$("."+message.index).append("<p>"+message.translation+"</p>");
								$('.form-control').val('');
							}
						}
					});
				});

				$(".up-vote-form").on("submit",function(g){
					g.preventDefault();
					$.ajax({
						url:$(this).attr("action"),
						type:"POST",
						data:$(this).serialize(),
						beforeSend: function(){
						},
						success:function(message){
							if (message==="alreadyUpVoted"){
								alert("Already Upvoted");
							}
							else {
								$(".upVote"+message.index).empty();
								$(".upVote"+message.index).append("<p>"+message.data.translationUpVotes.length+"</p>");
								$(".downVote"+message.index).empty();
								$(".downVote"+message.index).append("<p>"+message.data.translationDownVotes.length+"</p>");
							}
						}
					});
				});

				$(".down-vote-form").on("submit",function(h){
					h.preventDefault();
					$.ajax({
						url:$(this).attr("action"),
						type:"POST",
						data:$(this).serialize(),
						beforeSend: function(){
						},
						success:function(message){
							if (message==="alreadyDownVoted"){
								alert("Already Downvoted");
							}
							else {
								$(".upVote"+message.index).empty();
								$(".upVote"+message.index).append("<p>"+message.data.translationUpVotes.length+"</p>");
								$(".downVote"+message.index).empty();
								$(".downVote"+message.index).append("<p>"+message.data.translationDownVotes.length+"</p>");
							}
						}
					});
				});

				$(".add-common-phrase-form").on("submit",function(r){
					r.preventDefault();
					$.ajax({
						url:$(this).attr("action"),
						type:"POST",
						data:$(this).serialize(),
						beforeSend: function(){
						},
						success:function(message){
							if (message.message==="success"){
								$('.column2').append("<div class='language-row'>"+
															"<div class='language-cell'>"+
																"<p>"+message.commonPhraseEnglish+"</p>"+
															"</div>"+
															"<div class='language-cell'>"+
																"<p>"+message.commonPhraseTranslation+"</p>"+
															"</div>"+
														"</div>");
							}
							else {
								alert(message.message);
							}
						}
					});
				});

				$("#data-close").on("click", function(){
					$(".languages").show(0);
					$(".languages").animate({width: "1195px"}, 650);
					$("#langData").animate({width: "0px"}, 650);
					setTimeout(function() {
						$('#langData').empty();
					}, 650);
					$('#langData').hide(0);
				});


				$(".voiceSource").hide()

				// $(".textToVoice-button").click(function() {
				// 	$(this).addClass("selectedVoice", function() {
				// 	var section, frame;
				//  	section = document.getElementsByTagName("head")[0];
				//  	frame = document.createElement("iframe");
				//  	//var audio = new Audio();
				//     var languagecode = document.getElementsByName("languageCode")[0].value;
				// 	var translation = document.getElementsByClassName("selectedVoice")[0].value;
				//     frame.src = 'http://translate.google.com/translate_tts?key=AIzaSyAFnSwfXuVKTKzJTzVfB1i93z_BZ2Eu0-M&ie=utf-8&tl=' + languagecode + '&q=' + translation;
					
				// 	// try {
				// 	// 	audio.src = 'http://translate.google.com/translate_tts?key=AIzaSyAFnSwfXuVKTKzJTzVfB1i93z_BZ2Eu0-M&ie=utf-8&tl=' + languagecode + '&q=' + translation;
				// 	// }
				// 	// catch(err) {
				// 	// 	audio.src = 'http://translate.google.com/translate_tts?key=AIzaSyAFnSwfXuVKTKzJTzVfB1i93z_BZ2Eu0-M&ie=utf-8&tl=' + languagecode + '&q=' + translation + '.';
				// 	// }

				// 	// audio.play();
				// 	//console.log(audio.src);
				// 	section.appendChild( frame );
				// 	console.log(frame.src);
					
				// 	}).removeClass("selectedVoice");
				// });

				$(".textToVoice-button").click(function() {
					$(this).addClass("selectedVoice", function() {
						var languagecode = document.getElementsByName("languageCode")[0].value;
						var translation = document.getElementsByClassName("selectedVoice")[0].value;
						var msg = new SpeechSynthesisUtterance(translation);
						msg.lang = languagecode;
						window.speechSynthesis.speak(msg);
			        }).removeClass("selectedVoice");
		        });
			}
		});
	});
	// $(function(){
	// 	$('#lang-map').vectorMap({
	// 		regionStyle:{
	// 			initial:{
	// 				fill:"rgba(123, 170, 240, .6)"
	// 			},
	// 			hover:{
	// 				fill:"blue"
	// 			},
	// 			selected:{
	// 				fill:"green"
	// 			},
	// 			selectedHover:{
	// 				fill:"yellow"
	// 			}
	// 		},
	// 		backgroundColor:"#FCFCFC"
	// 	});
	// });
});
