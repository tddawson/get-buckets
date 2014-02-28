// Called when page is loaded
function initPregame() {
	// Set the name of the page
	$("h2#stage").html("Pre-Game");
	
	// Create listener for player name field
	$("#player-name").on("keyup", function(e) {
		if (e.keyCode == 13) {
			addPlayerName($("#player-name").val());
			$("#player-name").val("");
		}
	});
	
	// Create listener for Start Game button
	$("#start-game").on("click", function() {
		handleStartGame();
	});
}

function addPlayerName(name) {
	$("#player-names").append("<li>" + name + "</li>");
	_playerNames.push(name);
}

function handleStartGame() {
	// Grab information from form and use them to set global variables
	_team = new Team($("#team-name").val(), _playerNames);
	_minsPerPeriod = parseInt($("#period-length").val());
	_numPeriods = parseInt($("input:radio[name=period-type]:checked").val());
	
	// Move on to Game stage
	loadGame();
}