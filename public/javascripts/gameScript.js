$(document).ready(function(){
	$('#nextArrow').hide();
	$('#nextArrow1').hide();
	$(function() {
	  $("#transAnswer").focus();
	});
	$(".translate-form").on("submit",function(e){
		e.preventDefault();
		$.ajax({
			url:$(this).attr("action"),
			type:"POST",
			data:$(this).serialize(),
			beforeSend:function(){
			},
			success:function(sentData){
				$('.translate-container').hide();
				if (sentData.message==="answerCorrect"){
					$('.correct-answer-container').show();
					if ("currentScore" in sentData){
						$('.current-score').text("Score: "+sentData.currentScore*25);
						$('.current-lives').text("Lives: "+sentData.currentLives);
					}
					$(document).keydown(function(e) {
					    e.preventDefault();
					    if (e.keyCode===13){
					    	window.location.href = "/game?whichLanguage="+sentData.whichLanguage+"&whichGame="+sentData.whichGame;
					    }
					});
				}
				else if (sentData.message==="answerIncorrect") {
					$('.incorrect-answer-container').show();
					$('.incorrect-answer-container').prepend("<p class='answer-message'>Sorry, the answer we were looking for was "+'<b>'+sentData.answer+'</b>'+"</p>");
					if ("currentScore" in sentData){
						$('.current-score').text("Score: "+sentData.currentScore*25);
						$('.current-lives').text("Lives: "+sentData.currentLives);
					}
					$(document).keydown(function(e) {
					    e.preventDefault();
					    if (e.keyCode===13){
					    	window.location.href = "/game?whichLanguage="+sentData.whichLanguage+"&whichGame="+sentData.whichGame;
					    }
					});
				}
				else {
					$('.current-lives').hide();
					$('.current-score').hide();
					$('.out-of-lives-container').show();
					$('.out-of-lives-container').prepend("<p>Your Score: "+sentData.highScore*25+"</p>");
					$('.out-of-lives-container').prepend("<p>Game Over</p>");
				}
			}
		});
	});

	$(".language-choice").mousedown(function() {
		$(this).toggleClass("selected");
	})

	$(".language-choice").hover(function(){
	    $(this).addClass('active');
	    },
	    function(){
	    $(this).removeClass('active'); 
	});

	$('.language-choice').mouseup(function(){
		var selected = document.getElementsByClassName("selected");
		var selectedLang = [];
		for (var i = 0; i < selected.length; i++) {
			if (selected[i].innerHTML==="Chinese(S)"){
				selectedLang.push("Chinese Simplified");
			}
			else if (selected[i].innerHTML==="Chinese(T)"){
				selectedLang.push("Chinese Traditional");
			}
			else {
			selectedLang.push(selected[i].innerHTML);	
			}
		};
		var selectedLanguages = selectedLang[0];
		for (var i = 1; i<selectedLang.length; i++) {
			selectedLanguages = selectedLanguages + "," + selectedLang[i];
		}
		if (selected.length != 0) {
			$('.pickHead').replaceWith("<div class='playHead'>Click to <i>play</i></div>");
			$('.playHead').click(function(){
				var selected = document.getElementsByClassName("selected");
				var selectedLang = [];
				for (var i = 0; i < selected.length; i++) {
					if (selected[i].innerHTML==="Chinese(S)"){
						selectedLang.push("Chinese Simplified");
					}
					else if (selected[i].innerHTML==="Chinese(T)"){
						selectedLang.push("Chinese Traditional");
					}
					else {
					selectedLang.push(selected[i].innerHTML);	
					}
				};
				var selectedLanguages = selectedLang[0];
				for (var i = 1; i<selectedLang.length; i++) {
					selectedLanguages = selectedLanguages + "," + selectedLang[i];
				}
				if (selected.length != 0) {
					window.location.href = "/game?whichLanguage="+selectedLanguages+"&whichGame=questionsGame1";
				}
				else {
					$(this).replaceWith("<div class='pickHead'>Please select the language(s) for your game</div>")
				}
			});
		};
		//else {
		//	$('.playHead').replaceWith("<div class='pickHead'>Select the language(s) for your game</div>");
		//  	}
		// // 		$("#bottomGame").remove("<p class='gameError'>You have not selected any languages. Please try again</p>");
		// // 	}
		// // 	$("#bottomGame").append("<p class='gameError'>You have not selected any languages. Please try again</p>");
		//};
	});
	$('.nextSurround').mouseenter(function(){
		$('#nextWords').animate({left: '+=77px'}, 150);
		$('#nextArrow').show();
		$('#nextArrow').animate({left: '+=77px'}, 150);
		setTimeout(function() {
			$('#nextWords').hide();
		}, 150);
	});
	$('.nextSurround').mouseleave(function(){
		$('#nextWords').animate({left: '-=77px'}, 150);
		$('#nextWords').show();
		$('#nextArrow').animate({left: '-=77px'}, 150);
		setTimeout(function() {
			$('#nextArrow').hide();
		}, 150);
	});
	$('.nextSurround1').mouseenter(function(){
		$('#nextWords1').animate({left: '+=77px'}, 150);
		$('#nextArrow1').show();
		$('#nextArrow1').animate({left: '+=77px'}, 150);
		setTimeout(function() {
			$('#nextWords1').hide();
		}, 150);
	});
	$('.nextSurround1').mouseleave(function(){
		$('#nextWords1').animate({left: '-=77px'}, 150);
		$('#nextWords1').show();
		$('#nextArrow1').animate({left: '-=77px'}, 150);
		setTimeout(function() {
			$('#nextArrow1').hide();
		}, 150);
	});
	$(".textToVoice-buttonGame").click(function() {
					$(this).addClass("selectedVoice", function() {
						var languagecode = document.getElementsByName("languageCode")[0].value;
						var translation = document.getElementsByClassName("selectedVoice")[0].value;
						var msg = new SpeechSynthesisUtterance(translation);
						msg.lang = languagecode;
						window.speechSynthesis.speak(msg);
			        }).removeClass("selectedVoice");
		        });
})











