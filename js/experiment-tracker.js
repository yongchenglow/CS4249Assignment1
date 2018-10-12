// Class used to track experiment
class ExperimentTracker {


	constructor() {
		this.trials = [];
		this.attempt = 0;
		this.trial = null;
		this.attempt = null;
		this.menuType = null;
		this.menuDepth = null;
		this.targetItem = null;
		this.selectedItem = null;
		this.startTime = null;
		this.endTime = null;
		this.totalDistance = 0;
	}

	resetMouseTrack(){
		this.totalDistance = 0;
		mouseMoveDistance = 0;
		lastSeenAtX = 0;
		lastSeenAtY = 0;
	}

	// Function to track the distance that the most moved during the selection process
	// Orginal Source: https://stackoverflow.com/questions/8686619/how-can-i-detect-the-distance-that-the-users-mouse-has-moved
	startMouseTrack(){
		$(document).mousemove(function(event) {
		    if(lastSeenAtX) {
				mouseMoveDistance += Math.sqrt(Math.pow(lastSeenAtY - event.clientY, 2) + Math.pow(lastSeenAtX - event.clientX, 2));
		    }
		    lastSeenAtX = event.clientX;
		    lastSeenAtY = event.clientY;
		});
	}

	stopTrackMouseTrack(){
		$(document).off("mousemove");
		this.totalDistance = mouseMoveDistance;

		// For Debugging purposes
		// console.log('Your mouse ran this many pixels:   ' + Math.round(this.totalDistance));
	}

	resetTimers(){
		this.startTime = null;
		this.endTime = null;
	}

	startTimer() {
		this.startTime = Date.now();
	}

	recordSelectedItem(selectedItem) {
		this.selectedItem = selectedItem;
		this.stopTimer();
	}

	stopTimer() {
		this.endTime = Date.now();
		this.stopTrackMouseTrack();
		this.trials.push([participantID,this.trial, this.attempt, this.menuType, this.menuDepth, this.targetItem, this.selectedItem, this.startTime, this.endTime, this.totalDistance])
		this.resetTimers();
		this.resetMouseTrack();
		this.attempt++;

	}

	newTrial() {
		this.attempt = 1;
	}

	toCsv() {
		var csvFile = "Participant,Trial,Attempt,Menu Type,Menu Depth,Target Item,Selected Item,Start Time, End Time,Distance\n";
		for (var i = 0; i < this.trials.length; i++) {
			csvFile += this.trials[i].join(',');
			csvFile += "\n";
		}

		var hiddenLink = document.createElement('a');
		hiddenLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvFile);
		hiddenLink.target = '_blank';
		hiddenLink.download = 'experiment.csv';
		document.body.appendChild(hiddenLink);
		hiddenLink.click();
	}


}
