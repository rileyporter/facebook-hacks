window.onload=function(){

};

function postLogin() {
  console.log("In my javascript file");
  console.log(FB.getLoginStatus);
  FB.api('/me', function(response) {
    console.log('Good to see you, ' + response.name + '.');
  });
  $("welcome").addClassName(".hidden");
  $("game").removeClassName(".hidden");
}

// process response from text box
function processResponse() {
  var target = $("#response");
  console.log(target.value);
  var story = $("#story_box").lastChild;
  story.innerHTML = target.value;
  target.value = "";
}
