var gameState
var currentState

var possessions = []
var defaultActions = ["help", "possessions", "grab"]

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
	var response = $('#response').val()
	$('#response').val("")
	console.log(response);
	console.log(defaultActions)
	console.log($.inArray(response, defaultActions))

	var command = response.split(/\s+/);
	var action = command[0]
	var object = command[1]

	// handle generic commands
	if($.inArray(action, defaultActions) >= 0) {
		performDefaultAction(action, object);
	} else {

		// advance state
		if(command.length == 2 &&
			currentState['actions'][action] != undefined &&
			currentState['actions'][action][object] != undefined){
			// if the command parsed correctly
			
			var nextState = findState(currentState['actions'][action][object])
			currentState = nextState;
			renderState(nextState);
		
		} else {
			reportInvalidAction();
		}
	}
	
}

function performDefaultAction(action, object){
	var response = "";
	switch(action){
		case "help":
			response = "Your available actions are: "
			$.each(defaultActions, function(i, action){response +=  " " + action});
			$.each(currentState['actions'], function(key, val) {response += " " +key});
			break;
		case "possessions":
			console.log("reporting possessions")
			if(possessions.length == 0){
				response = "You have no possessions, loser"
			} else {
				response = "Your possessions are: "
				$.each(possessions, function(i, pos){response += " " + pos});
			}
			break;
		case "grab":
			// if object exists
			if(object != undefined && ($.inArray(object, currentState['objects']) >= 0)){
				response = "You've picked up a " + object
				possessions.push(object);
			} else {
				response = "You attempted to pick up " + object + ", it does not exist";
			}
			break
	}
	$("#prompt").html(response);
}


// doesn't do anything. called whenever an action lookup fails
function reportInvalidAction(){
	$("#prompt").html("That didn't work. What will you do?")
}

// loads the game from our flat .json file. This method should almost certainly
// be called first thing when page is loaded.
function loadGame() {
	$.getJSON("./gamestate.json", function(data){
		console.log(data);
		gameState = data;
		// here be hacks, the start of game should be called after user logs in
		// for dev purposes it's being called immediately after game is loaded.
		$("#welcome").hide();// more hacks
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

/*** outdated by 'takeAction' ***/
// process response from text box
/*function processResponse() {
  var target = $("#response");
  console.log(target.value);
  var story = $("#story_box").lastChild;
  story.innerHTML = target.value;
  target.value = "";
}*/
