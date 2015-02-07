
// $(document).ready(function(){
// 	$(".login-button").on("submit",function(f){
// 		f.preventDefault();
// 		$.ajax({
//             url: $(this).attr("action"),
//             type: 'GET',
//             data: $(this).serialize(),
//             beforeSend: function() {
//             },
//             success: function(message) {
//             	console.log(message);
//             }
//         });
// 	})
// }

// var translator = new Translator();
// translator.speakTextUsingGoogleSpeaker({
//     textToSpeak: 'Bonjour',
//     targetLanguage: 'fr',
//     api_key: 'AIzaSyAFnSwfXuVKTKzJTzVfB1i93z_BZ2Eu0-M'
// });

// var audio = new Audio();
// audio.src ='http://translate.google.com/translate_tts?ie=utf-8&tl=zh-CN&q=名前.';
// audio.play();

// var msg = new SpeechSynthesisUtterance('Hello world!');
// window.speechSynthesis.speak(msg);

// var voices = speechSynthesis.getVoices();
//       for(var i = 0; i < voices.length; i++ ) {
//         console.log("Voice " + i.toString() + ' ' + voices[i].name + ' ' + voices[i].uri);
//       }
// var utterance = new SpeechSynthesisUtterance("\u308F\u305F\u3057\u306F\u3046\u308C\u3057\u3044\u3067\u3059");
// var worte = new SpeechSynthesisUtterance("\u308F\u305F\u3057\u306F\u3046\u308C\u3057\u3044\u3067\u3059");
// worte.lang = "ja-JP";
// window.speechSynthesis.speak(worte);


var LanguageCodes = {"Afrikaans":"af", "Albanian":"sq", "Arabic":"ar", "Azerbaijani":"az", "Basque":"eu","Bengali":"bn", "Belarusian":"be", "Bulgarian":"bg", "Catalan":"ca", "Chinese Simplified":"zh-CN",	"Chinese Traditional":"zh-TW", "Croatian":"hr", "Czech":"cs", "Danish":"da", "Dutch":"nl",	"Esperanto":"eo", "Estonian":"et", "Filipino":"tl", "Finnish":"fi", "French":"fr", "Galician":"gl",	"Georgian":"ka", "German":"de", "Greek":"el", "Gujarati":"gu", "Haitian (Creole)":"ht", "Hebrew":"iw","Hindi":"hi", "Hungarian":"hu", "Icelandic":"is", "Indonesian":"id", "Irish":"ga", "Italian":"it",	"Japanese":"ja", "Kannada":"kn", "Korean":"ko", "Latin":"la", "Latvian":"lv", "Lithuanian":"lt",	"Macedonian":"mk", "Malay":"ms", "Maltese":"mt", "Norwegian":"no", "Persian":"fa", "Polish":"pl","Portuguese":"pt", "Romanian":"ro", "Russian":"ru", "Serbian":"sr", "Slovak":"sk", "Slovenian":"sl","Spanish":"es", "Swahili":"sw", "Swedish":"sv", "Tamil":"ta", "Telugu":"te", "Thai":"th", "Turkish":"tr","Ukrainian":"uk", "Urdu":"ur", "Vietnamese":"vi", "Welsh":"cy", "Yiddish":"yi"};

var CommonPhrases = ["Hello", "Good morning", "Good evening", "Goodnight", "Goodbye", "See you tomorrow","Thank you", "I am sorry", "Excuse me", "What is your name?", "What time is it?","It is 7 o'clock", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Hundred", "Thousand", "Million", "Nice to meet you", "Where are you from?", "I am from America", "Yes", "No","Maybe", "Can you say that again?", "What do you think?", "Are you okay?", "I am fine", "What is your job?","Is this correct?", "Where is the bathroom?", "It is over there", "I am a college student","How much does this cost?", "That is mine", "Is this yours?","I don't know","Left","Right","Forward","Backward","Where is the hospital?","Where is the police station?","What is this?","Where is this?"];
//var CommonPhrases = ["I don't know","I want to go there"];

var languageArray = ["Afrikaans","Albanian","Arabic","Azerbaijani","Basque","Bengali","Belarusian","Bulgarian","Catalan","Chinese Simplified", "Chinese Traditional", "Croatian","Czech","Danish","Dutch","Esperanto","Estonian","Filipino","Finnish","French","Galician","Georgian","German","Greek","Gujarati","Haitian Creole","Hebrew","Hindi","Hungarian","Icelandic","Indonesian","Irish","Italian","Japanese","Kannada","Korean","Latin","Latvian","Lithuanian","Macedonian","Malay","Maltese","Norwegian","Persian","Polish","Portuguese","Romanian","Russian","Serbian","Slovak","Slovenian","Spanish","Swahili","Swedish","Tamil","Telugu","Thai","Turkish","Ukrainian","Urdu","Vietnamese","Welsh","Yiddish"];
//var languageArray = ["Afrikaans","French"];

var translate = function(targetLanguageCode, text, callback) {
	var translation = $.getJSON( "https://www.googleapis.com/language/translate/v2?key=AIzaSyAFnSwf" + 
		"XuVKTKzJTzVfB1i93z_BZ2Eu0-M&source=en&target=" + 
		targetLanguageCode + "&q=" + text, function(translateObject) {
			callback(translateObject.data.translations[0].translatedText);
  });
};

// var LanguageDataStructure = [];
// for (var a = 0; a < languageArray.length; a++) {
// 	for (var b = 0; b < CommonPhrases.length; b++) {
// 		(function(a,b) {
// 			var newLangObject = {};
// 			newLangObject.languageName = languageArray[a];
// 			translate(LanguageCodes[languageArray[a]], CommonPhrases[b], function(translatedText) {
// 				newLangObject.commonPhraseEnglish = CommonPhrases[b];
// 				newLangObject.commonPhraseTranslation = translatedText;
// 				newLangObject.translationUpVotes = ["8978242343", "2398493824"];
// 				newLangObject.translationDownVotes = [];
// 				LanguageDataStructure.push(newLangObject);
// 				if (LanguageDataStructure.length===languageArray.length*CommonPhrases.length){
// 					console.log(LanguageDataStructure);
// 					saveToFile(JSON.stringify(LanguageDataStructure),"languageData.json");
// 					console.log(JSON.stringify(LanguageDataStructure));
// 					$.ajax({
// 					    type: "POST",
// 					    url: "/ajaxRequest", 
// 					    dataType: "application/json",
// 					    data: JSON.stringify(LanguageDataStructure),
// 					    success: function(data){
// 					    	alert('success');
// 					    }
// 					});
// 				}
// 			});

// 		})(a,b);
// 	};
// };



var saveToFile = function(arrayOfLines, fileName) {
   /* adds linebreaks at the end*/
   var blob, blobText;
   blobText = [arrayOfLines];
   
   blob = new Blob(blobText, {
     type: "text/plain;charset=utf-8"
   });
   
   return saveAs(blob, fileName);
 };


$(document).ready(function() {

  // $('.welComtainer').css({
  //       width: $(window).width(),
  //       height: $(window).height()
  //     })

  // $(".dot").click(function (){

  //     $(".dot").removeClass("filled");
  //     $(this).addClass("filled");
  //     $target = $(this).attr("title");
  //     console.log($target);
  //       $('html, body').animate({
  //         scrollTop: $('#' + $target).offset().top
  //       }, 500);
  //     });

   $("#welComtainerid-dot").click(function (){

      $(".dot").removeClass("filled");
      $(this).addClass("filled");
        $('html, body').animate({
          scrollTop: $('#welComtainerid').offset().top
        }, 500);
      });

   $("#aboutArea-dot").click(function (){

      $(".dot").removeClass("filled");
      $(this).addClass("filled");
        $('html, body').animate({
          scrollTop: $('#aboutArea').offset().top
        }, 500);
      });

   $("#playArea-dot").click(function (){

      $(".dot").removeClass("filled");
      $(this).addClass("filled");
        $('html, body').animate({
          scrollTop: $('#playArea').offset().top
        }, 500);
      });

   $("#learnArea-dot").click(function (){

      $(".dot").removeClass("filled");
      $(this).addClass("filled");
        $('html, body').animate({
          scrollTop: $('#learnArea').offset().top
        }, 500);
      });

   $("#getStartedArea-dot").click(function (){

      $(".dot").removeClass("filled");
      $(this).addClass("filled");
        $('html, body').animate({
          scrollTop: $('#getStartedArea').offset().top
        }, 500);
      });

   $("#Info").click(function() {
      $('html, body').animate({
          scrollTop: $('#aboutArea').offset().top
        }, 500);
   });

   // $(window).bind("scroll", function() {
   //  $('.dot').removeClass('filled');
   //  $(".sectionContainer > .section").withinViewport().each(function() {
   //       $('#' + $(".sectionContainer > .section").withinViewport()[0].id + "-dot").addClass('filled');
   //       console.log($(".sectionContainer > .section").withinViewport()[0].id);
   //  });

    $(window).scroll(function() {
      //console.log($(':in-viewport')[3].nextElementSibling);
      $('.dot').removeClass('filled');
      if ($('#learnArea:in-viewport').length > 0) {
        $('#learnArea-dot').addClass('filled');
        //console.log($('#learnArea:in-viewport'));
        };
      if ($('#playArea:in-viewport').length > 0) {
        $('#playArea-dot').addClass('filled');
        //console.log($('#playArea:in-viewport'));
        };
      if ($('#aboutArea:in-viewport').length > 0) {
        $('#aboutArea-dot').addClass('filled');
        //console.log($('#aboutArea:in-viewport'));
        };

      if ($('#welComtainerid:in-viewport').length > 0) {
        $('#welComtainerid-dot').addClass('filled');
        //console.log($('#welComtainerid:in-viewport'));
        };
      if ($('#getStartedArea:in-viewport').length > 0) {
        $('#getStartedArea-dot').addClass('filled');
        //console.log($('#getStartedArea:in-viewport'));
        };
      });

    $("#slideshow > div:gt(0)").hide();

    setInterval(function() { 
      $('#slideshow > div:first')
        .fadeOut(1000)
        .next()
        .fadeIn(1000)
        .end()
        .appendTo('#slideshow');
    },  3000);

    $("#slideshowSmall > div:gt(0)").hide();

    setInterval(function() { 
      $('#slideshowSmall > div:first')
        .fadeOut(1000)
        .next()
        .fadeIn(1000)
        .end()
        .appendTo('#slideshowSmall');
    },  3000);

    $("#slideshowSmallish > div:gt(0)").hide();

    setInterval(function() { 
      $('#slideshowSmallish > div:first')
        .fadeOut(1000)
        .next()
        .fadeIn(1000)
        .end()
        .appendTo('#slideshowSmallish');
    },  3000);

    $(document).keydown(function(key) {

      var currentID = $(':in-viewport')[3].id;
      var currentView = $(':in-viewport')[3];
      console.log($(':in-viewport'));
      console.log(currentID);
      console.log(key.which);
      // console.log(currentView);
      // console.log(currentView.previousElementSibling);
      // console.log(currentView.nextElementSibling);
      //console.log($('#learnArea'));
      if (currentID === "aboutArea" || currentID === "playArea" || currentID === "learnArea") {
        switch(parseInt(key.which,10)) {
        // Left arrow key pressed
        case 37:
          $('html, body').animate({
            scrollTop: $(currentView.previousElementSibling).offset().top
          }, 500);
          break;
        case 38:
          $('html, body').animate({
            scrollTop: $(currentView.previousElementSibling).offset().top
          }, 500);
          break;
        // Right Arrow Pressed
        case 39:
          $('html, body').animate({
            scrollTop: $(currentView.nextElementSibling).offset().top
          }, 500);
          break;
        case 40:
          $('html, body').animate({
            scrollTop: $(currentView.nextElementSibling).offset().top
          }, 500);
          break;
        }
      };
      if (currentID === "welComtainerid") {
        if (key.which === 39 || key.which === 40) {
          $('html, body').animate({
            scrollTop: $(currentView.nextElementSibling).offset().top
          }, 500);
        }
      };
      if ($(':in-viewport')[5].id === "getStartedArea" || $(':in-viewport')[9].id === "getStartedArea" || $(':in-viewport')[4].id === "getStartedArea") {
        if (key.which === 37 || key.which === 38) {
          $('html, body').animate({
            scrollTop: $("#learnArea").offset().top
          }, 500);
        }
      };
      if ($(':in-viewport')[12].id === "aboutArea" || $(':in-viewport')[16].id === "aboutArea" || $(':in-viewport')[6].id === "aboutArea" || $(':in-viewport')[4].id === "aboutArea" || $(':in-viewport')[0].id === "aboutArea") {
        if (key.which === 37 || key.which === 38) {
          $('html, body').animate({
            scrollTop: $("#welComtainerid").offset().top
          }, 500);
        }
        if (key.which === 39 || key.which === 40) {
          $('html, body').animate({
            scrollTop: $("#playArea").offset().top
          }, 500);
        }
      };
      if ($(':in-viewport')[12].id === "playArea" || $(':in-viewport')[16].id === "playArea" || $(':in-viewport')[6].id === "playArea" || $(':in-viewport')[4].id === "playArea" || $(':in-viewport')[0].id === "playArea") {
        if (key.which === 37 || key.which === 38) {
          $('html, body').animate({
            scrollTop: $("#aboutArea").offset().top
          }, 500);
        }
        if (key.which === 39 || key.which === 40) {
          $('html, body').animate({
            scrollTop: $("#learnArea").offset().top
          }, 500);
        }
      };
      if ($(':in-viewport')[12].id === "learnArea" || $(':in-viewport')[16].id === "learnArea" || $(':in-viewport')[6].id === "learnArea" || $(':in-viewport')[4].id === "learnArea" || $(':in-viewport')[5].id === "learnArea") {
        if (key.which === 37 || key.which === 38) {
          $('html, body').animate({
            scrollTop: $("#playArea").offset().top
          }, 500);
        }
        if (key.which === 39 || key.which === 40) {
          $('html, body').animate({
            scrollTop: $("#getStartedArea").offset().top
          }, 500);
        }
      };
    });
  });


  //     if ($(':in-viewport')[12].id === "aboutArea" || $(':in-viewport')[12].id === "playArea" || $(':in-viewport')[12].id === "learnArea") {
  //       switch(parseInt(key.which,10)) {
  //       // Left arrow key pressed
  //       case 37:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[12].previousElementSibling).offset().top
  //         }, 500);
  //         break;
  //       case 38:
  //       $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[12].previousElementSibling).offset().top
  //         }, 500);
  //         break;
  //       // Right Arrow Pressed
  //       case 39:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[12].nextElementSibling).offset().top
  //         }, 500);
  //         break;
  //       case 40:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[12].nextElementSibling).offset().top
  //         }, 500);
  //         break;
  //       }
  //     }
  //     if ($(':in-viewport')[16].id === "aboutArea" || $(':in-viewport')[16].id === "playArea" || $(':in-viewport')[16].id === "learnArea") {
  //       switch(parseInt(key.which,10)) {
  //       // Left arrow key pressed
  //       case 37:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[16].previousElementSibling).offset().top
  //         }, 500);
  //         break;
  //       case 38:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[16].previousElementSibling).offset().top
  //         }, 500);
  //         break;
  //       // Right Arrow Pressed
  //       case 39:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[16].nextElementSibling).offset().top
  //         }, 500);
  //         break;
  //       case 40:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[16].nextElementSibling).offset().top
  //         }, 500);
  //         break;
  //       }
  //     }
  //     if ($(':in-viewport')[6].id === "aboutArea" || $(':in-viewport')[6].id === "playArea" || $(':in-viewport')[6].id === "learnArea") {
  //       switch(parseInt(key.which,10)) {
  //       // Left arrow key pressed
  //       case 37:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[6].previousElementSibling).offset().top
  //         }, 500);
  //         break;
  //       case 38:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[6].previousElementSibling).offset().top
  //         }, 500);
  //         break;
  //       // Right Arrow Pressed
  //       case 39:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[6].nextElementSibling).offset().top
  //         }, 500);
  //         break;
  //       case 40:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[6].nextElementSibling).offset().top
  //         }, 500);
  //         break;
  //       }
  //     }
  //     if ($(':in-viewport')[4].id === "aboutArea" || $(':in-viewport')[4].id === "playArea" || $(':in-viewport')[4].id === "learnArea") {
  //       switch(parseInt(key.which,10)) {
  //       // Left arrow key pressed
  //       case 37:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[4].previousElementSibling).offset().top
  //         }, 500);
  //         break;
  //       case 38:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[4].previousElementSibling).offset().top
  //         }, 500);
  //         break;
  //       // Right Arrow Pressed
  //       case 39:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[4].nextElementSibling).offset().top
  //         }, 500);
  //         break;
  //       case 40:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[4].nextElementSibling).offset().top
  //         }, 500);
  //         break;
  //       }
  //     }

  //     if ($(':in-viewport')[0].id === "aboutArea" || $(':in-viewport')[0].id === "playArea" || $(':in-viewport')[0].id === "learnArea") {
  //       switch(parseInt(key.which,10)) {
  //       // Left arrow key pressed
  //       case 37:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[0].previousElementSibling).offset().top
  //         }, 500);
  //         break;
  //       case 38:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[0].previousElementSibling).offset().top
  //         }, 500);
  //         break;
  //       // Right Arrow Pressed
  //       case 39:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[0].nextElementSibling).offset().top
  //         }, 500);
  //         break;
  //       case 40:
  //         $('html, body').animate({
  //           scrollTop: $($(':in-viewport')[0].nextElementSibling).offset().top
  //         }, 500);
  //         break;
  //       }
  //     }

  // });

 // for (var i = 0; i < $(':in-viewport').length; i++) {
 //        ids.push($(':in-viewport')[i].ids);
 //      }
 //      if (isinArray("aboutArea", ids) || isinArray("playArea", ids)) {
 //        var element = "cool";
 //        if (isinArray("aboutArea", ids)) {
 //          element = "aboutArea";
 //        }
 //        else {
 //          element = "playArea";
 //        }
 //        switch(parseInt(key.which,10)) {
 //        // Left arrow key pressed
 //        case 37:
 //          $('html, body').animate({
 //            scrollTop: $($(':in-viewport').indexOf(element).previousElementSibling).offset().top
 //          }, 500);
 //          break;
 //        case 38:
 //          $('html, body').animate({
 //            scrollTop: $($(':in-viewport').indexOf(element).previousElementSibling).offset().top
 //          }, 500);
 //          break;
 //        // Right Arrow Pressed
 //        case 39:
 //          $('html, body').animate({
 //            scrollTop: $($(':in-viewport').indexOf(element).nextElementSibling).offset().top
 //          }, 500);
 //          break;
 //        case 40:
 //          $('html, body').animate({
 //            scrollTop: $($(':in-viewport').indexOf(element).nextElementSibling).offset().top
 //          }, 500);
 //          break;
 //        }
 //      }
 //      if (isinArray("welComtainerid", ids)) {
 //        if (key.which === 39 || key.which === 40) {
 //          $('html, body').animate({
 //            scrollTop: $(currentView.nextElementSibling).offset().top
 //          }, 500);
 //        }
 //      }
 //      if (isinArray("learnArea", ids)) {
 //        if (key.which === 37 || key.which === 38) {
 //          $('html, body').animate({
 //            scrollTop: $("#playArea").offset().top
 //          }, 500);
 //        }
 //      }

  // var lastScrollTop = 0;
  // $(window).scroll(function(event){
  //    var st = $(this).scrollTop();
  //    current = $(".section").withinViewport();
  //    console.log(current);
  //    if (st > lastScrollTop){
  //        // $('html, body').animate({
  //        //  scrollTop: $().offset().top
  //       // }, 500);
  //    } else {
  //       // upscroll code
  //    }
  //    lastScrollTop = st;
  // });
 //})








