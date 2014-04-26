var gameState
var currentState

$(document).ready(function() {
	console.log("script file running...");
    loadGame();
    console.log("game state loaded?");

    // register text action listener
    //$('#response').keypress(takeAction(event));

});


// linked in by event register in html page... to my everlasting shame
function takeAction(){
	console.log("taking action..");

	// handle generic commands

	var command = $('#response').val().split(/\s+/);;
	var action = command[0]
	var object = command[1]
	
	// advance state
	console.log($('#response').val())
	console.log(action + object)


	console.log(currentState['actions'])
	console.log(currentState['actions'][action])
	console.log(currentState['actions'][action][object])
	if(currentState['actions'][action] != undefined &&
		currentState['actions'][action][object] != undefined){
		var nextState = findState(currentState['actions'][action][object])
		currentState = nextState;
		renderState(nextState);
	} else {
		reportInvalidAction();
	}
	
}

// doesn't do anything. called whenever an action lookup fails
function reportInvalidAction(){
	console.log("that didn't work");
}

// loads the game from our flat .json file. This method should almost certainly
// be called first thing when page is loaded.
function loadGame() {
	$.getJSON("./gamestate.json", function(data){
		console.log(data);
		gameState = data;
		startGame();
	});
}

// begin the game. Sets the current state to start state (determined by state with
// id == "state"). Renders that state then waits on input
function startGame() {
	console.log(gameState);
	var startState = findState("start");
	currentState = startState;
	renderState(startState);
}

// Given the current state object, render the state passed as object. Right now this
// simply involves copying state's body to the html page. In the future this is where
// parsing in user specific data should happen.
function renderState(state){
	$("#story_box").html(state['body']);

}



// State search function, O(n). Finds the last state whose id exactly matches
// the argument. (we should probably avoid duplicating ids, since that'll be
// convusing)
function findState(id){

	var result;
	$.each(gameState, function(index) {
		if (gameState[index]['id'] == id){
			result = gameState[index];
		} 
	});
	return result
}

// idk yo
function postLogin() {
  console.log("In my javascript file");
  console.log(FB.getLoginStatus);
  FB.api('/me', function(response) {
    console.log('Good to see you, ' + response.name + '.');
  });
  document.getElementById("welcome").addClassName("hidden");
  document.getElementById("game").removeClassName("hidden");
}

/*** outdated by 'takeAction' ***/
// process response from text box
/*function processResponse() {
  var target = document.getElementById("response");
  console.log(target.value);
  var story = document.getElementById("story_box").lastChild;
  story.innerHTML = target.value;
  target.value = "";
}*/
