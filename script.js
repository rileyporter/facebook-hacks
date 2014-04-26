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
  FB.api('/me', function(response) {
    if (response && !response.error) {
      console.log('Good to see you, ' + response.name + '.');
      console.log('Your birthday is: ' + response.birthday + '.');
      console.log('ID: ' + response.id);
      console.log('TEAMS: ' + response.favorite_teams);
    }
  });
  $("#welcome").addClass("hidden");
  $("#game").removeClass("hidden");
}

// process response from text box
function processResponse() {
  var target = $("#response");
  console.log(target.value);
  var story = $("#story_box").lastChild;
  story.innerHTML = target.value;
  target.value = "";
}
