var gameState
var currentState
var userInfo = [];

var possessions = []
var defaultActions = ["help", "possessions", "grab"]

$(document).ready(function() {
	console.log("script file running...");
    loadGame();
    console.log("game state loaded?");
    $("#enter").click(function () {
    	$("#game").removeClass("hidden");
    	$("#welcome").addClass("hidden");
    	startGame();
    	console.log("started game");
    });


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
	console.log("about to request json");
	$.getJSON("./gamestate.json", function(data){
		console.log("data imported");
		gameState = data;
		// here be hacks, the start of game should be called after user logs in
		// for dev purposes it's being called immediately after game is loaded.
		//startGame();
	});
}

// begin the game. Sets the current state to start state (determined by state with
// id == "state"). Renders that state then waits on input
function startGame() {
	console.log(gameState);
	var startState = findState("1");
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

// sets up the map of all the state for this game.
function postLogin() {
  setSignificantOther();
  setMusic();
  setBooks();
  setFriend();
  console.debug(userInfo);
  $("#welcome").addClass("hidden");
  $("#game").removeClass("hidden");
  startGame();
}

function setSignificantOther() {
  FB.api('/me?field=significant_other', function(response) {
    if (response && !response.error) {
      // set up significant other
        userInfo['significant_other'] = response.significant_other;
        console.debug(response.significan_other);
    }
  });
}

function setMusic() {
  FB.api('/me/music', function(response) {
    if (response && !response.error) {
      var data = response.data;
      console.debug(response.data);

      var x1 = Math.floor(Math.random()*data.length);
      while (data[x1].category !== "Musician/band") {
        x1 = Math.floor(Math.random()*data.length);
      }
      var x2 = Math.floor(Math.random()*data.length);
      while (data[x2].category !== "Musician/band") {
        x2 = Math.floor(Math.random()*data.length);
      }
      var object = [];
      object['artist1'] = data[x1].name;
      object['artist2'] = data[x2].name;
      console.log("music: ");
      console.debug(object);
      userInfo['music'] = object;
    }
  });
}

function setBooks() {
  FB.api('/me/books', function(response) {
    if (response && !response.error) {
      var data = response.data;
      console.debug(response.data);

      var x1 = Math.floor(Math.random()*data.length);
      var x2 = Math.floor(Math.random()*data.length);
      var object = [];
      object['book1'] = data[x1].name;
      object['book2'] = data[x2].name;
      console.log("books: ");
      console.debug(object);
      userInfo['books'] = object;
    }
  });
}

function setFriend() {
  FB.api('/me/friends', function(response) {
    if (response && !response.error) {
      var data = response.data;
      console.debug(response.data);

      var x1 = Math.floor(Math.random()*data.length);
      var birthday = getBirthday(data[x1].id);
      while (birthday !== undefined && birthday.length < 7) { // get a friend with a birthday
        x1 = Math.floor(Math.random()*data.length);
        birthday = getBirthday(data[x1].id);
      }
      var x2 = Math.floor(Math.random()*data.length);
      while (data[x1].id === data[x2].id) { // don't choose the same person
        x2 = Math.floor(Math.random()*data.length);
      }
      userInfo['friend'] = data[x1];
      userInfo['enemy'] = data[x2];
    }
  });
}

// internal, please don't call.
function getBirthday(id) {
  FB.api('/' + id, function(response) {
    if (response && !response.error) {
      console.debug(response.birthday);

        return response.birthday;
    }
  });
}

// returns String name
function getFriendName() {
  return userInfo['friend'].name;
}

// returns String MM/YY/DD
function getFriendBirthday() {
  return getBirthday(userInfo['friend'].id);
}

// returns map: ["artist1": name, "artist2": name]
function getTwoArtists() {
  return userInfo['music'];
}

// returns map: ["book1": name, "book2": name]
function getTwoBooks() {
  return userInfo['books'];
}

// returns String name
function getSignificantOther() {
  return userInfo['significant_other'];
}

// returns String name
function getEnemyName() {
  return userInfo['enemy'].name;
}
