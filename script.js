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
  console.log("login: " + FB.getLoginStatus());
  console.log("auth: " + FB.getAuthResponse());
  FB.api('/me', function(response) {
    if (response && !response.error) {
      console.log('Good to see you, ' + response.name + '.');
      console.debug(response);
      console.log('ID: ' + response.id);
      var teams = response.favorite_teams;
      for (var i = 0; i < teams.length; i++) {
        console.log(teams[i].name);
      }
    }
  });
  FB.api('/me/books', function(response) {
    console.log("got back a response");
    if (response && !response.error) {
      console.log("response was good");
      var books = response;
      for (var book in books) {
        console.log(book);
      }
    }
  });
  FB.abi('/me/friends', function(response) {
    if (response && !response.error) {
      var friends = response;
      for (var i = 0; i < 5; i++) {
        console.log(friends[i].name);
      }
    }
  }
  }
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
