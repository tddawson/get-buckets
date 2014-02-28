// Called when page is loaded.
function initGame() {

	// Set the name of the page.
	$("h2#stage").html("Game Time!");
	
	// Initialize various elements of the page.
	displayTeam();
	initButtons();
	hideButtons();
	initClock();
	initScoreboard();
	
	// Don't let them accidentally exit without saving.
	window.onbeforeunload = confirmExit;
}


function displayTeam() {
	$('#players').html("<h4>Select player:</h4>");
	
	for (var i = 0; i < _team.players.length; i++) {
		$('#players').append(_team.players[i].elem);
	}
}

function initClock() {
	_clockRunning = false;
	_period = 1;
	_time = _minsPerPeriod * 60;
	$("#time-card").on("touchstart click", function(e) { e.stopPropagation(); e.preventDefault(); toggleClockRunning(); });
	displayTime();
}

function initScoreboard() {
	_teamPoints = 0;
	_otherTeamPoints = 0;
	$("#home > p.name").html(_team.name);
	$("#plus1").on("touchstart click", function(e) {  e.stopPropagation(); e.preventDefault(); addOtherPoints(1); });	
	$("#plus2").on("touchstart click", function(e) {  e.stopPropagation(); e.preventDefault(); addOtherPoints(2); });	
	$("#plus3").on("touchstart click", function(e) {  e.stopPropagation(); e.preventDefault(); addOtherPoints(3); });	
}

function addOtherPoints(points) {
	_otherTeamPoints += points;
	$("#away .score").html(_otherTeamPoints);
}

function addTeamPoints(points) {
	_teamPoints += points;
	$("#home .score").html(_teamPoints);
}

function updateTime() {
	_time--;
	if (_time == 0) {
		advancePeriod();
	}
	displayTime();
}

function displayTime() {
	var seconds = _time % 60;
	seconds = seconds >= 10 ? seconds : ("0" + seconds);
	$("#seconds").html(seconds);
	$("#minutes").html(parseInt(_time / 60));
}

function advancePeriod() {
	console.log("Next half/quarter");
	_period++;
	if (_period > _numPeriods) {
		save(true);
		loadReport();
	}
	else {
		toggleClockRunning();
		_time = _minsPerPeriod * 60;
	}
}

function toggleClockRunning() {
	$("#time-card").toggleClass("active");
	if (_clockRunning) {
		_clockRunning = false;
		clearInterval(_clockInterval);
	}
	else {
		_clockRunning = true;
		_clockInterval = setInterval(updateTime, 1000);
	}
}


function initButtons() {
	var buttonDiv = document.createElement("div");
	buttonDiv.id = "player-buttons";
	
	buttons = ["Made 2pt", "Missed 2pt", "Made 3pt", "Missed 3pt", "Made FT", "Missed FT", "Rebound", "Assist", "Steal", "TO", "Foul"];
	
	// Header
	var label = document.createElement("h4");
	label.innerHTML = "Record stat:";
	label.id = "stat-label";
	buttonDiv.appendChild(label);
	
	
	for (var i = 0; i < buttons.length; i++) {
		var button = document.createElement("a");
		button.innerHTML = buttons[i];
		$(button).on("touchstart click", function(e) {  e.stopPropagation(); e.preventDefault(); addStat(this.innerHTML); });
		buttonDiv.appendChild(button);
	}

	// Close Button
	var closeButton = document.createElement("a");
	closeButton.innerHTML = "Cancel";
	closeButton.className = "cancel";
	$(closeButton).on("touchstart click", function(e) { e.stopPropagation(); e.preventDefault(); addStat("Cancel"); });
	buttonDiv.appendChild(closeButton);
	
	$('div#menu').append(buttonDiv);
}

function hideButtons() {
	$("div#player-buttons").hide();
}

function showButtons() {
	$("div#player-buttons").show();
}

function showSubs() {
	var buttonDiv = document.createElement("div");
	buttonDiv.id = "subs-buttons";
	
	var label = document.createElement("h4");
	label.innerHTML = "Sub " + _team.players[_selected].name + " for:";
	buttonDiv.appendChild(label);
	
	for (var i = 0; i < _team.players.length; i++) {
		if (!_team.players[i].playing)
			continue;
			
		var button = document.createElement("a");
		button.innerHTML = _team.players[i].name;
		button.id = "sub-" + i;
		$(button).on("touchstart click", function(e) {  e.stopPropagation(); e.preventDefault(); sub(_selected, this.id); });
		buttonDiv.appendChild(button);
	}

	var closeButton = document.createElement("a");
	closeButton.innerHTML = "Cancel";
	closeButton.className = "cancel";
	$(closeButton).on("touchstart click", function(e) {  e.stopPropagation(); e.preventDefault(); sub(_selected, "sub-" + _selected); });
	buttonDiv.appendChild(closeButton);
	
	$('div#menu').append(buttonDiv);
}

function hideSubs() {
	$("div#subs-buttons").remove();
}

function sub(subIn, subOut) {
	subOut = subOut.split("-")[1];
	_team.players[subIn].setPlaying(true);
	_team.players[subOut].setPlaying(false);
	hideSubs();
	$("#players").show();
}

function addStat(stat) {
	var player = _team.players[_selected];
	switch (stat) {
		case "Made 2pt":
			player.fgMade++;
			addTeamPoints(2);
			break;
		case "Missed 2pt":
			player.fgMissed++;
			break;
		case "Made 3pt":
			player.tpMade++;
			addTeamPoints(3);
			break;
		case "Missed 3pt":
			player.tpMissed++;
			break;
		case "Made FT":
			player.ftMade++;
			addTeamPoints(1);
			break;
		case "Missed FT":
			player.ftMissed++;
			break;
		case "Rebound":
			player.rebounds++;
			break;
		case "Assist":
			player.assists++;
			break;
		case "Steal":
			player.steals++;
			break;
		case "TO":
			player.tos++;
			break;
		case "Foul":
			player.fouls++;
			break;
		case "Cancel":
			break;
		default:
			console.log("No stat corresponding to: " + stat);
	}
	
	hideButtons();
	deselectAll();
	$("#players").show();
}

function toggle(elem) {
	// Remove previous substitution menu, if any.
	$("#players").hide();
	$("#subs-buttons").remove();
	
	// Mark as selected
	deselectAll();
	id = elem.id;
	_selected = parseInt(id.split("-")[1]);
	
	var playing = elem.className.substr(0, 8) == "on-court";
	if (playing) {
		showButtons();
		$("#stat-label").html("Record stat for " + _team.players[_selected].name);
	}
	else {
		hideButtons();
		showSubs();
	}
}

function deselectAll() {
	_selected = -1;
	
	var allPlayers = _team.players;
	for (var i = 0; i < allPlayers.length; i++) {
		var player = allPlayers[i];
		player.setPlaying(player.playing);
	}
}

function save(done) {
	var data = JSON.stringify(_team.players, censor);
	console.log(data);

    $.ajax({
        url: 'php/save.php',
		type: 'post',
        data: {complete: done, game: "Game 2", myData: data},
        success: function (data) {
			console.log("Saved!");
        }
    });
}

function censor(key, value) {
	if (key == "elem") {
		return undefined;
	}
	return value;
}

function confirmExit() {
	save(false);
	return "Please save before leaving the page.";
}
