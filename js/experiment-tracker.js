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
	}

	startTimer() {
		this.startTime = Date.now();
	}

	recordSelectedItem(selectedItem) {
		this.stopTimer();
		this.selectedItem = selectedItem;
	}

	stopTimer() {
		this.attempt++;
		this.endTime = Date.now();
		this.trials.push([this.trial, this.attempt, this.menuType, this.menuDepth, this.targetItem, this.selectedItem, this.startTime, this.endTime])

	}

	newTrial() {
		this.attempt = 0;
	}

	toCsv() {
		var csvFile = "Trial,Attempt,Menu Type,Menu Depth,Target Item,Selected Item,Start Time, End Time\n";
		for (var i = 0; i < this.trials.length; i++) {
			csvFile += this.trials[i].join(',');
			csvFile += "\n";
		}

		var hiddenElement = document.createElement('a');
		hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvFile);
		hiddenElement.target = '_blank';
		hiddenElement.download = 'experiment.csv';
		hiddenElement.click();
	}


}