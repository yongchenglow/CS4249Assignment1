'use strict';

const trialsFile = "./data/experiments.csv"
const menuL2File = "./data/menu_l2.csv"
const menuL3File = "./data/menu_l3.csv"

	
class ExperimentTracker{

	
	constructor(){
		this.trials = [];
		this.attempt = 0;
		this.trial = null;
		this.attempt = null;
		this.menuType=null;
		this.menuDepth=null;
		this.targetItem=null;
		this.selectedItem=null;
		this.startTime = null;
		this.endTime = null;		
	}
	
	startTimer(){
		this.startTime = Date.now();
		document.getElementById("selectedItem").innerHTML = "&nbsp;";
	}
	
	recordSelectedItem(selectedItem){
		this.stopTimer();
		this.selectedItem = selectedItem.name;
		document.getElementById("selectedItem").innerHTML = selectedItem.name;
	}
	
	stopTimer(){
		this.attempt++;
		this.endTime = Date.now();
		this.trials.push([this.trial,this.attempt,this.menuType,this.menuDepth,this.targetItem,this.selectedItem,this.startTime,this.endTime])
	}
	
	newTrial(){
		this.attempt = 0;
	}
	
	toCsv(){
		var csvFile = "Trial,Attempt,Menu Type,Menu Depth,Target Item,Selected Item,Start Time, End Time\n";
		for(var i=0;i<this.trials.length;i++){
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

var trialsData = [];
var numTrials = 0;
var currentTrial = 1;
var markingMenuL2 = [];
var markingMenuL3 = [];
var contextMenuL2 = [];
var contextMenuL3 = [];
var menu = null;
var eventLogger;
var tracker = new ExperimentTracker();





function getData(relativePath){
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", relativePath, false ); 
	xmlHttp.send( null );
	return xmlHttp.responseText;
}
	
function initExperiment(){
	
	// Get Trails
	var data = getData(trialsFile);
	
	var records = data.split("\n");
	numTrials = records.length - 1;
	for(var i = 1;i<=numTrials;i++){
		var cells = records[i].split(",");
		var menuType = cells[0].trim();
		var menuDepth = cells[1].trim();
		var targetItem = cells[2].trim();
		trialsData[i] = {'Menu Type':menuType,'Menu Depth':menuDepth,'Target Item':targetItem};
	}
	
	// Load Menus
	var menuL2Data = getData(menuL2File);
	var menuL3Data = getData(menuL3File);
	markingMenuL2 = formatMarkingMenuData(menuL2Data);
	markingMenuL3 = formatMarkingMenuData(menuL3Data);
	contextMenuL2 = formatContextMenuData(menuL2Data);
	contextMenuL3 = formatContextMenuData(menuL3Data);
	nextTrial();
	
}


function nextTrial(){
	
	console.log(currentTrial,numTrials);
	if (currentTrial <= numTrials){
	
		var menuType = trialsData[currentTrial]['Menu Type'];
		var menuDepth = trialsData[currentTrial]['Menu Depth'];
		var targetItem = trialsData[currentTrial]['Target Item'];
		
		document.getElementById("trialNumber").innerHTML = String(currentTrial)+"/"+String(numTrials);
		document.getElementById("menuType").innerHTML = menuType;
		document.getElementById("menuDepth").innerHTML = menuDepth;
		document.getElementById("targetItem").innerHTML = targetItem;
		//Set IV3 here
		
		tracker.newTrial();
		tracker.trial = currentTrial;
		tracker.menuType = menuType;
		tracker.menuDepth = menuDepth;
		tracker.targetItem = targetItem;
		
		if(menuType==="Marking"){
			
			menu = MarkingMenu(markingMenuL2, document.getElementById('marking-menu-container'));
			var subscription = menu.subscribe((selection) => tracker.recordSelectedItem(selection));
	
		}else if(technique==="Context"){
			subscription.unsubscribe();
			
		}
	
		currentTrial++;
	}
	else{
		tracker.toCsv();
	}
}
//To be implemented
function formatContextMenuData(records){
	return []
}

function formatMarkingMenuData(data){
	var records = data.split("\n");
	var numRecords = records.length;
    var menuItems = {}

    // Assumes menu csv is sorted by
    // Id and Parent both Ascending

    // Parse through the records and create
    // individual menu items
    for (var i = 1; i < numRecords; i++) {
        var items = records[i].split(',');
        var id = items[0].trim();
        var label = items[2].trim();
        menuItems[id] = {
            'name': label,
            'children': []
        };
    }

    for (var i = numRecords - 1; i >= 1; i--) {
        var items = records[i].split(',');
        var id = items[0].trim();
        var parent = items[1].trim();
        if (parent === '0') {
            continue;
        } else {
            var children = menuItems[parent]['children'];
            children.push(menuItems[id]);
            delete menuItems[id]
            menuItems[parent]['children'] = children;
        }
    }


    var menuItemsList = [];
    for (var key in menuItems) {
        menuItemsList.push(menuItems[key]);
    }

    return menuItemsList;
	
}

