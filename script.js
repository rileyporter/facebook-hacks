var gameState
var currentState
var userInfo = [];

var possessions = []
var defaultActions = ["help", "possessions", "grab"]

$(document).ready(function() {
	console.log("script file running...");
    loadGame();
    console.log("game state loaded?");
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          // the user is logged in and has authenticated
          $("#enter").removeClass("hidden");
        }
     });
    $("#enter").click(function () {
    	//$("#game").removeClass("hidden");
    	//$("#welcome").addClass("hidden");
    	//startGame();
    	//console.log("started game");
      $("#enter").addClass("hidden");
    	postLogin();
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


function parseBody(body){
	console.log("attempting to integrate facebook data");
	console.log(userInfo)
	content = body.split(" ");
	result = "";
	$.each(content, function(index, word){
		if(word.charAt(0) == "#"){
			console.log("found hashtag on " + word);
			result += parseKeyword(word) + " ";
		} else {
			result += word + " ";
		}
	});
	return result;
}


function parseKeyword(keyword){
	switch(keyword){
		case "#friend":
			return getFriendName();
			break;
		case "#friendBirthDay":
			return getFriendBirthday();
			break;
		case "#firstArtist":
			return getTwoArtists()["artist1"];
			break;
		case "#secondArtist":
			return getTwoArtists()["artist2"];
			break;
		case "#firstBook":
			return getTwoBooks["book1"];
			break;
		case "#secondBook":
			return getTwoBooks()["book2"];
			break;
		case "#significantOther":
			return getSignificantOther();
			break;
		case "#enemy":
			return getEnemyName();
			break;
	}
	// if not matched just return keyword
	return keyword;
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
	$("#prompt").html("What will you do?")
	$("#story_box").html(parseBody(state['body']));
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
  // chained to call all facebook load data
  setSignificantOther();
}

function setSignificantOther() {
  FB.api('/me?field=significant_other', function(response) {
    if (response && !response.error) {
      // set up significant other
      if (response.significant_other === undefined) {
        userInfo['significant_other'] = "George Clooney";
      } else {
        userInfo['significant_other'] = response.significant_other.name;
      }
    } else {
        userInfo['significant_other'] = "George Clooney Error";
    }

    // on function return seek out next information element
    setMusic();

  });
}

function setMusic() {
  FB.api('/me/music', function(response) {
    if (response && !response.error) {
      var data = response.data;
      var x1 = Math.floor(Math.random()*data.length);
      while (data[x1].category !== "Musician/band") {
        console.log("choosing new music 1");
        x1 = Math.floor(Math.random()*data.length);
      }
      var x2 = Math.floor(Math.random()*data.length);
      while (x1 === x2 || data[x2].category !== "Musician/band") {
        console.log("choosing new music 2");
        x2 = Math.floor(Math.random()*data.length);
      }
      if (data[x1] === undefined || data[x2] === undefined) {
        var object = [];
        object['artist1'] = "Earth Wind and Fire";
        object['artist2'] = "Macklemore";
        userInfo['music'] = object;
      }
      var object = [];
      object['artist1'] = data[x1].name;
      object['artist2'] = data[x2].name;
      console.log("music: ");
      console.debug(object);
      userInfo['music'] = object;
    } else {
      var object = [];
      object['artist1'] = "Earth Wind and Fire Error";
      object['artist2'] = "Macklemore Error";
      userInfo['music'] = object;
    }

    // next look for books
    setBooks()
  });
}

function setBooks() {
  FB.api('/me/books', function(response) {
    if (response && !response.error) {
      var data = response.data;
      var x1 = Math.floor(Math.random()*data.length);
      var x2 = Math.floor(Math.random()*data.length);
      while (x1 === x2) {
        console.log("choosing a new book");
        x2 = Math.floor(Math.random()*data.length);
      }
      if (data[x1] === undefined || data[x2] === undefined) {
        var object = [];
        object['book1'] = "Watership Down";
        object['book2'] = "Men are from Mars, Women are from Venus";
        userInfo['books'] = object;
      }
      var object = [];
      object['book1'] = data[x1].name;
      object['book2'] = data[x2].name;
      console.log("books: ");
      console.debug(object);
      userInfo['books'] = object;
    } else {
      var object = [];
      object['book1'] = "Watership Down Error";
      object['book2'] = "Men are from Mars, Women are from Venus Error";
      userInfo['books'] = object;
    }

    // chain all the network calls
    setFriends();
  });
}

function setFriend() {
  FB.api('me/friends?fields=birthday,name', function(response) {
    if (response && !response.error) {
      var data = response.data;
      var x1 = Math.floor(Math.random()*data.length);
      while (data[x1].birthday === undefined || data[x1].birthday.length < 7) {
        console.log("choosing a new friend");
        x1 = Math.floor(Math.random()*data.length);
      }
      var x2 = Math.floor(Math.random()*data.length);
      while (x1 === x2) { // don't choose the same person
        console.log("choosing a new enemy");
        x2 = Math.floor(Math.random()*data.length);
      }
      if (data[x1] === undefined) {
        userInfo['friend'] = "Carl Sagan";
      } else {
        userInfo['friend'] = data[x1];
      }
      if (data[x2] === undefined) {
        userInfo['enemy'] = "Stephen Hawking";
      } else {
        userInfo['enemy'] = data[x2];
      }
    } else {
      userInfo['enemy'] = "Stephen Hawking Error";
      userInfo['friend'] = "Carl Sagan Error";
    }

    parseGameState();
    loadGamePage();
  });
}

function parseGameState(){
  gameStateString = JSON.stringify(gameState);
  console.log(gameStateString);
  gameStateString.replace("#friend", getFriendName());
  gameStateString.replace("#friendBirthday", getFriendBirthday());
  gameStateString.replace("#artist1", getTwoArtists()["artist1"]);
  gameStateString.replace("#artist2", getTwoArtists()["artist2"]);
  gameStateString.replace("#significantOther", getSignificantOther());
  gameStateString.replace("#book1", getTwoBooks["book1"]);
  gameStateString.replace("#book2", getTwoBooks["book2"]);
  gameStateString.replace("#enemy", getEnemyName());
  gameState = $.parseJSON(gameStateString);
  console.log(gameState);
}

function loadGamePage(){
  $("#welcome").addClass("hidden");
  $("#game").removeClass("hidden");
  console.debug(userInfo);
  startGame();
}


// returns String name
function getFriendName() {
  return userInfo['friend'].name;
}

// returns String MM/YY/DD
function getFriendBirthday() {
  return userInfo['friend'].birthday;
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
