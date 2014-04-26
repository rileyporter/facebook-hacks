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


// process response from text box
function processResponse() {
  var target = document.getElementById("response");
  console.log(target.value);
  var story = document.getElementById("story_box").lastChild;
  story.innerHTML = target.value;
  target.value = "";
}
