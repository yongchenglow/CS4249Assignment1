'use strict';

// Location of data files
const trialsFile = "./data/experiments.csv"
const menuL2File = "./data/menu_depth_2.csv"
const menuL3File = "./data/menu_depth_3.csv"

// Global variables
var menu;
var trialsData = [];
var numTrials = 0;
var currentTrial = 1;
var markingMenuL2 = [];
var markingMenuL3 = [];
var radialMenuTree = null;
var radialMenuL2 = [];
var radialMenuL3 = [];
var tracker = new ExperimentTracker();
var markingMenuSubscription = null;
var radialMenuSvg = null;





// Load CSV files from data and return text
function getData(relativePath) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", relativePath, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}


// Loads the CSV data files on page load and store it to global variables
function initExperiment() {

	// Get Trails
	var data = getData(trialsFile);

	var records = data.split("\n");
	numTrials = records.length - 1;
	for (var i = 1; i <= numTrials; i++) {
		var cells = records[i].split(",");
		var menuType = cells[0].trim();
		var menuDepth = cells[1].trim();
		var targetItem = cells[2].trim();
		trialsData[i] = {
			'Menu Type': menuType,
			'Menu Depth': menuDepth,
			'Target Item': targetItem
		};
	}

	// Get Menus
	var menuL2Data = getData(menuL2File);
	var menuL3Data = getData(menuL3File);
	
	// Format CSV Menu to respective Menu structures
	markingMenuL2 = formatMarkingMenuData(menuL2Data);
	markingMenuL3 = formatMarkingMenuData(menuL3Data);
	radialMenuL2 = formatRadialMenuData(menuL2Data);
	radialMenuL3 = formatRadialMenuData(menuL3Data);
	
	//Start the first trial
	nextTrial();
}


// Move to next trai and record events
function nextTrial() {

	var interactionContainer = document.getElementById('interaction-container');
	
	if (currentTrial <= numTrials) {

		var menuType = trialsData[currentTrial]['Menu Type'];
		var menuDepth = trialsData[currentTrial]['Menu Depth'];
		var targetItem = trialsData[currentTrial]['Target Item'];

		document.getElementById("trialNumber").innerHTML = String(currentTrial) + "/" + String(numTrials);
		document.getElementById("menuType").innerHTML = menuType;
		document.getElementById("menuDepth").innerHTML = menuDepth;
		document.getElementById("targetItem").innerHTML = targetItem;
		document.getElementById("selectedItem").innerHTML = "&nbsp;";
		// Set IV3 state over here

		tracker.newTrial();
		tracker.trial = currentTrial;
		tracker.menuType = menuType;
		tracker.menuDepth = menuDepth;
		tracker.targetItem = targetItem;

		if (menuType === "Marking") {
			
			//Unload Radial Menu
			var radialMenuContainer = document.getElementById('radial-menu-container');
			if(radialMenuContainer != null){
				radialMenuContainer.parentNode.removeChild(radialMenuContainer);
			}
			
			// Load Marking Menu
			interactionContainer.innerHTML += "<div id=\"marking-menu-container\" style=\"height:100%;width:100%\" onmousedown=\"markingMenuOnMouseDown()\"></div>";
			
			
			if(menuDepth == 2){
				menu = MarkingMenu(markingMenuL2, document.getElementById('marking-menu-container'));
			}else if(menuDepth == 3){
				menu = MarkingMenu(markingMenuL3, document.getElementById('marking-menu-container'));
			}

			markingMenuSubscription = menu.subscribe((selection) => markingMenuOnSelect(selection));

		} else if (menuType === "Radial") {

			// Unload Marking Menu
			if (markingMenuSubscription != null) {
				markingMenuSubscription.unsubscribe();
			}
			var markingMenuContainer = document.getElementById('marking-menu-container');
			if(markingMenuContainer!=null){
				markingMenuContainer.parentNode.removeChild(markingMenuContainer);
			}
			
			

			// Load Radial Menu
			interactionContainer.innerHTML += "<div id=\"radial-menu-container\" style=\"height:100%;width:100%\" oncontextmenu=\"toggleRadialMenu(event)\"></div>";
			if(menuDepth == 2){
				menu = createRadialMenu(radialMenuL2);
			}else if(menuDepth == 3){
				menu = createRadialMenu(radialMenuL3);
			}


		}

		currentTrial++;
	} else {
		tracker.toCsv();
	}
}










/*Functions related to MarkingMenu*/


//Formats csv menu data in the structure accepted by radial menu
// Assumes menu csv is sorted by Id and Parent both Ascending
function formatMarkingMenuData(data) {
	var records = data.split("\n");
	var numRecords = records.length;
	var menuItems = {}

	// Parse through the records and create individual menu items
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

// Function to start tracking timer on mouse down
function markingMenuOnMouseDown(){
	console.log('In start timer');
	tracker.startTimer();
}

//Function to start tracking timer on mouse down
function markingMenuOnSelect(selectedItem){
	console.log('In selected item');
	tracker.recordSelectedItem(selectedItem.name);
	document.getElementById("selectedItem").innerHTML = selectedItem.name;
}

/*Functions related to RadialMenu*/

// Create radial menu svg element
function createRadialMenu(radialMenuL){
	var w = window.innerWidth;
	var h = window.innerHeight;
	radialMenuSvg = d3.select("#radial-menu-container").append("svg").attr("width", w).attr("height", h);
	radialMenuTree = radialMenuL;
	return radialMenuSvg;
}

// Toggle radial menu on right click
function toggleRadialMenu(e) {
	
	if(radialMenuTree != null){

		var radialMenu = document.getElementById('radialmenu');
	
		if (radialMenu === null) {
	
			menu = module.exports(radialMenuTree, {
				x: e.clientX,
				y: e.clientY
			}, radialMenuSvg);
	
		} else {
	
			menu = module.exports(radialMenuTree, {
				x: e.clientX,
				y: e.clientY
			}, radialMenuSvg);
	
		}
		
		// Start timing once menu appears
		console.log('In selected item');
		tracker.startTimer();
	}
	e.preventDefault();
}

//Callback for radialmenu when a leaf node is selected
function radialMenuOnSelect() {
	console.log('In selected item');
	tracker.recordSelectedItem(this.id);
	var radialmenu = document.getElementById('radialmenu');
	radialmenu.parentNode.removeChild(radialmenu);
	
	document.getElementById("selectedItem").innerHTML = this.id;
}

//Formats csv menu data in the structure accepted by radial menu
// Assumes menu csv is sorted by Id and Parent both Ascending
function formatRadialMenuData(data) {

	var records = data.split("\n");
	var numRecords = records.length;
	var menuItems = {}



	// Parse through the records and create individual menu items
	for (var i = 1; i < numRecords; i++) {
		var items = records[i].split(',');
		var id = items[0].trim();
		var label = items[2].trim();
		menuItems[id] = {
			'id': label,
			'fill': "#39d",
			'name': label,
			'_children': []
		};
	}

	for (var i = numRecords - 1; i >= 1; i--) {
		var items = records[i].split(',');
		var id = items[0].trim();
		var parent = items[1].trim();
		if (parent === '0') {
			continue;
		} else {
			var _children = menuItems[parent]['_children'];
			menuItems[id]['callback'] = radialMenuOnSelect;
			_children.push(menuItems[id]);
			delete menuItems[id];
			menuItems[parent]['_children'] = _children;
		}
	}


	var menuItemsList = [];
	for (var key in menuItems) {
		menuItemsList.push(menuItems[key]);
	}

	return {
		'_children': menuItemsList
	};

}
