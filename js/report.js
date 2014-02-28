// Called when page is loaded.
function initReport() {

	// Set the name of the page.
	$("h2#stage").html("Post-Game Report");
	
	// Initialize various elements of the page.
	initBoxScore();
	
	for (var i in _team.players) {
		updateStats(_team.players[i]);
	}
}


function initBoxScore() {
	var colHeaders = ["Player", "Mins", "FT", "2pt", "3pt", "FG %", "Rebounds", "Assists", "Steals", "TOs", "Fouls", "+/-"];
	
	var table = $("#box-score");
	
	var tr = document.createElement("tr");
	for (var i = 0; i < colHeaders.length; i++) {
		
		var td = document.createElement("td");
		td.innerHTML = colHeaders[i];
		tr.appendChild(td);
	}
	table.append(tr);
	
	// Add player stats, last one for team stats
	for (var i = 0; i <= _team.players.length; i++) {
		
		var tr = document.createElement("tr");
		tr.id = (i == _team.players.length) ? "team-stats" : "player-" + i + "-stats";
		
		for (var j = 0; j < colHeaders.length; j++) {
			var td = document.createElement("td");
			
			switch (j) {
				case 0:
					td.innerHTML = (i == _team.players.length) ? "Team" :_team.players[i].name;
					break;
				case 2:
				case 3:
				case 4:
					td.innerHTML = "0/0";
					break;
				case 5:
					td.innerHTML = "-";
					break;
				default:
					td.innerHTML = 0;
			}
			
			tr.appendChild(td);		
		}
		
		table.append(tr);
	}
	

}

function updateStats(player) {

	var colHeaders = ["Player", "Mins", "FT", "2pt", "3pt", "FG %", "Rebounds", "Assists", "Steals", "TOs", "Fouls", "+/-"];

	for (var i = 0; i < colHeaders.length; i++) {
		var td = $("#player-" + player.id + "-stats td:nth-child(" + (i + 1) +")")[0];
		switch (i) {
			case 0:
				break;
			case 1:
				td.innerHTML = player.mins;
				break;
			case 2:
				td.innerHTML = player.ftMade + "/" + (player.ftMade + player.ftMissed);
				break;
			case 3:
				td.innerHTML = player.fgMade + "/" + (player.fgMade + player.fgMissed);
				break;
			case 4:
				td.innerHTML = player.tpMade + "/" + (player.tpMade + player.tpMissed);
				break;
			case 5:
				var shotsMade = player.fgMade + player.tpMade;
				var totalShots = shotsMade + player.tpMissed + player.fgMissed;
				td.innerHTML = (totalShots == 0 ? "-" : parseInt(shotsMade * 100 / totalShots) + "%");
				break;
			case 6:
				td.innerHTML = player.rebounds;
				break;
			case 7:
				td.innerHTML = player.assists;
				break;
			case 8:
				td.innerHTML = player.steals;
				break;
			case 9:
				td.innerHTML = player.tos;
				break;
			case 10:
				td.innerHTML = player.fouls;
				break
			case 11:
				td.innerHTML = player.pm;
				break;
			default:
				td.innerHTML = 0;
		}	
	}
}
