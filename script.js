var gameState

$(document).ready(function() {
	console.log("script file running...");
    loadGame();
    console.log("game state loaded?");


});

function loadGame() {
	$.getJSON("./gamestate.json", function(data){
		console.log(data);
		gameState = data;
	});
	/*$.ajax({
		url: 'gamestate.json',
		type: 'GET',
		dataType: 'json',
		success: function(response){
			console.log(reponse)
			gameState = response},

	});*/
}

function postLogin() {
  console.log("In my javascript file");
  console.log(FB.getLoginStatus());
  FB.api('/me', function(response) {
    console.log('Good to see you, ' + response.name + '.');
  });
  $("#welcome").addClassName("hidden");
  $("#game").removeClassName("hidden");
}

// process response from text box
function processResponse() {
  var target = $("#response");
  console.log(target.value);
  var story = $("#story_box").lastChild;
  story.innerHTML = target.value;
  target.value = "";
}
