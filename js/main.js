// Global variables
var _team;
var _playerNames = [];

var _time;
var _minsPerPeriod = 20;
var _clockInterval;
var _clockRunning;
var _period;
var _numPeriods;


var _teamPoints;
var _otherTeamPoints;

var _selected = -1;


// Init
$( function() {
	loadPregame();
});

function loadPregame() {
	console.log("Loading Pre-Game.");
	$("#main-content").load("init.html", function() {
		initPregame();
	});
}

function loadGame() {
	console.log("Loading Game.");
	$("#main-content").load("game.html", function() {
		initGame();
	});
}

function loadReport() {
	console.log("Loading Post-Game Report.");
	$("#main-content").load("report.html", function() {
		initReport();
	});
}

/* TEAM CLASS */
function Team(name, playerNames) {
	this.name = name;
	this.players = [];
	
	for (var i in playerNames) {
		this.players.push(new Player(playerNames[i], i));
		this.players[i].setPlaying(i < 5);	
	}
}


/* PLAYER CLASS */
function Player(name, id) {
	this.name = name;
	this.id = id;
	
	this.playing = false;
	this.fgMade = 0;
	this.fgMissed = 0;
	this.ftMade = 0;
	this.ftMissed = 0;
	this.tpMade = 0;
	this.tpMissed = 0;
	this.rebounds = 0;
	this.assists = 0;
	this.steals = 0;
	this.tos = 0;
	this.fouls = 0;
	this.pm = 0;
	this.mins = 0;
	
	this.elem = document.createElement("a");
	this.elem.id = "player-" + id;
    this.elem.innerHTML = this.name;
	$(this.elem).on("touchstart click", function(e) {  e.stopPropagation(); e.preventDefault(); toggle(this) });
	
	this.setPlaying = function(playing) {
		this.playing = playing;
		if (playing) {
			this.elem.className = "on-court";
		}
		else {
			this.elem.className = "on-bench";
		}
	}
}
