var canvas0 = document.getElementById("canvas0"),
	ctx = canvas0.getContext("2d"),
	canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"),
	canvas2 = document.getElementById("canvas2"),
	ctx2 = canvas2.getContext("2d"),
    canvas3 = document.getElementById("canvas3"),
	ctx3 = canvas3.getContext("2d");

var canvasLeft = parseInt(canvas0.style.left);
var canvasHeight = parseInt(canvas0.style.height);

var canvasOffset = $("#canvas").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var startX;
var startY;
var isDown = false;
var mostRect = false;

var widthUnit = 40;		// initial size of smallest rectangle
var heightUnit = 33;
var widthUnitSet = 40;  // size of smallest rectangle after clicking set button
var heightUnitSet = 33;
var uniMouseX = 0;		// save the mouse x, y position
var uniMouseY = 0;		
var widthNum = 0;
var heightNum = 0;

$("#canvas2").css({
    left: -2000,
    top: 0
});

var rectArray = new Array();  // save all the rectangles that have been drawn by user
var blockArray = new Array(); // save all the chairs, bags, backpacks and baskets
var doorArray = new Array();
var deleteArray = new Array();
var classicRobot = {		 // save the robot
	rowNum: 0,
	colNum: 0,
	relColNum: 0,
	isDelete: false
};
var classicBlock = {		  // save the block in classic state
	rowNum: 0,
	colNum: 0,
	relColNum: 0,
	shape: "basket",
	color: "Red",
	isDelete: false
};
var classicLeftRect = {}; // save three colorful rectangles in classic state
var classicRightRect = {};
var classicBottomRect = {};
var classicLeftDoor = {};
var classicRightDoor = {};
var blockIndex = 0;
var isConnect = false;

//Resize the rectangles
var boxes2 = [];
var selectionHandles = [];
var WIDTH;
var HEIGHT;
var INTERVAL = 20;

var isDrag = false;
var isResizeDrag = false;
var expectResize = -1;
var mx, my;

var canvasValid = false;
var mySel = null;
var mySelColor = '#ffff99';
var mySelWidth = 5;
var mySelBoxColor = '#ffff99';
var mySelBoxSize = 9;

var ghostcanvas;
var gctx;
var offsetx, offsety;
var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

var deleteObj = {};
var setIndex = 2;

var selectOrder = [];
var commandOrder = [];
var changeSelectOrder = [];
var changeCommandOrder = [];
var showImgArray = [];
var popSignal = true;

$(document).ready(
	function(){
		if(sessionStorage.getItem("design_gui")){
			if(document.getElementById("tutorial")){
				document.getElementById("tutorial").style.display = "none";
				document.getElementById("mainDiv").style.display = "block";
				document.getElementById("selectedTitle").style.display = "block";
				document.getElementById("recordDiv").style.display = "block";
				document.getElementById("goalDiv").style.display = "block";
				document.getElementById("selectDiv").style.display = "block";
				document.getElementById("finishDesignDiv").style.display = "block";
				if(document.getElementById("selectBtn")){
					document.getElementById("selectBtn").addEventListener("click", curriculumDesign, false);
				}
				
				if(sessionStorage.getItem("select_order_list")){
					selectOrder = JSON.parse(sessionStorage.getItem("select_order_list"));
					commandOrder = JSON.parse(sessionStorage.getItem("command_index_list"));
					var selectedImgLen = selectOrder.length;
					if (selectedImgLen >= 1) {
						// enable the submit button
						var finishBtn = document.getElementById("finishBtn");
						finishBtn.className = "button pink serif round glass";
					}
				}
				
			}
		}else{
			drawTutorialLayout();
		}
});

function curriculumDesign(){
	if(!document.getElementsByClassName("grid-current-image")[0]){
		alert("Please select an assignment before submitting!");
	}else{
		var imgId = parseInt(document.getElementsByClassName("grid-current-image")[0].parentElement.getAttribute("id"));
		var commandIdx = document.getElementById("commandSelect").selectedIndex;
		var commands = getCommands(imgId);
		var command = commands[commandIdx];

		if(commandIdx == 0){
			alert("Please select a command for current assignment before submitting!");
		}else{
			if(sessionStorage.getItem("select_order_list")){
				selectOrder = JSON.parse(sessionStorage.getItem("select_order_list"));
				commandOrder = JSON.parse(sessionStorage.getItem("command_index_list"));
			}

			selectOrder.push(imgId);
			commandOrder.push(commandIdx);
			changeSelectOrder.push(selectOrder);
			changeCommandOrder.push(commandOrder);
			if(sessionStorage.getItem("design_gui")){
				sessionStorage.setItem("select_order_list", JSON.stringify(selectOrder));
				sessionStorage.setItem("command_index_list", JSON.stringify(commandOrder));
				sessionStorage.setItem("change_select_order_list", JSON.stringify(changeSelectOrder));
				sessionStorage.setItem("change_command_index_list", JSON.stringify(changeCommandOrder));
			}

			// show the selected room layout and the up, down, delete button on the left side
			addRoomLayout(imgId, command);

			// change the value of the button on right side
			var selectedImgLen = selectOrder.length;
			//if(sessionStorage.getItem("design_gui")){
				if (selectedImgLen >= 1) {
					// enable the submit button
					var finishBtn = document.getElementById("finishBtn");
					finishBtn.className = "button pink serif round glass";
				}
			//}

			// change the select button's value
			var buttonVal = selectedImgLen + 1;
			document.getElementById("selectBtn").innerHTML = "Add Assignment " + buttonVal;

			if(!sessionStorage.getItem("design_gui")){
				if(popSignal == true && selectedImgLen == 1){
					window.setTimeout(function(){window.popup("popUpDiv2");}, 1000);
					popSignal = false;
				}
			}
		}
	}
}

function addRoomLayout(imgId, command){
	var recordElm = document.getElementById("recordDiv");
	var imgElm = document.createElement("img");
	var upArrow = document.createElement("img");
	var downArrow = document.createElement("img");
	var deleteArrow = document.createElement("img");
	var pElm = document.createElement("p");
	var aElm = document.createElement("a");

	imgElm.style.border = "5px solid white";
	imgElm.src = "images/small/layout_" + imgId + ".png";

	upArrow.src = "images/up_arrow.png";
	upArrow.style.position = "relative";
	upArrow.style.left = "30px";
	upArrow.style.margin = "0 0 30px 0";
	downArrow.src = "images/down_arrow.png";
	downArrow.style.position = "relative";
	downArrow.style.left = "65px";
	downArrow.style.margin = "0 0 30px 0";
	deleteArrow.src = "images/delete_button.png";
	deleteArrow.style.position = "relative";
	deleteArrow.style.left = "100px";
	deleteArrow.style.margin = "0 0 30px 0";

	pElm.innerHTML = command;
	pElm.style.textAlign = "center";
	aElm.href = "#";

	if(recordElm){
		recordElm.appendChild(imgElm);
		recordElm.appendChild(pElm);
		recordElm.appendChild(aElm);
		aElm.appendChild(upArrow);
		aElm.appendChild(downArrow);
		aElm.appendChild(deleteArrow);
	}
	
	//var idx = Array.prototype.indexOf.call(deleteArrow.parentNode.childNodes, deleteArrow);
	upArrow.addEventListener("click", moveRoomLayoutUp, false);
	downArrow.addEventListener("click", moveRoomLayoutDown, false);
	deleteArrow.addEventListener("click", deleteRoomLayout, false);
}

function moveRoomLayoutUp(e){
	var recordElm = document.getElementById("recordDiv");
	var idx = Array.prototype.indexOf.call(this.parentNode.parentNode.childNodes, this.parentNode);

	if(sessionStorage.getItem("select_order_list")){
		selectOrder = JSON.parse(sessionStorage.getItem("select_order_list"));
		commandOrder = JSON.parse(sessionStorage.getItem("command_index_list"));
	}
	var moveIdx = (idx/3) - 1;
	if(moveIdx >= 1){
		var a = selectOrder[moveIdx-1];
		selectOrder[moveIdx-1] = selectOrder[moveIdx];
		selectOrder[moveIdx] = a;
		var b = commandOrder[moveIdx-1];
		commandOrder[moveIdx-1] = commandOrder[moveIdx];
		commandOrder[moveIdx] = b;
		changeSelectOrder.push(selectOrder);
		changeCommandOrder.push(commandOrder);
		if(sessionStorage.getItem("design_gui")){
			sessionStorage.setItem("select_order_list", JSON.stringify(selectOrder));
			sessionStorage.setItem("command_index_list", JSON.stringify(commandOrder));
			sessionStorage.setItem("change_select_order_list", JSON.stringify(changeSelectOrder));
			sessionStorage.setItem("change_command_index_list", JSON.stringify(changeCommandOrder));
		}
		var tmpPath = recordElm.childNodes[idx-5].src;
		recordElm.childNodes[idx-5].src = recordElm.childNodes[idx-2].src;
		recordElm.childNodes[idx-2].src = tmpPath;
		var tmpText = recordElm.childNodes[idx-4].innerHTML;
		recordElm.childNodes[idx-4].innerHTML = recordElm.childNodes[idx-1].innerHTML;
		recordElm.childNodes[idx-1].innerHTML = tmpText;
	}
}

function moveRoomLayoutDown(e){
	var recordElm = document.getElementById("recordDiv");
	var idx = Array.prototype.indexOf.call(this.parentNode.parentNode.childNodes, this.parentNode);

	if(sessionStorage.getItem("select_order_list")){
		selectOrder = JSON.parse(sessionStorage.getItem("select_order_list"));
		commandOrder = JSON.parse(sessionStorage.getItem("command_index_list"));
	}
	var moveIdx = (idx/3) - 1;
	var currentImgs = (recordElm.childNodes.length - 1)/3;
	if(moveIdx < currentImgs - 1){
		var a = selectOrder[moveIdx + 1];
		selectOrder[moveIdx + 1] = selectOrder[moveIdx];
		selectOrder[moveIdx] = a;
		var b = commandOrder[moveIdx + 1];
		commandOrder[moveIdx + 1] = commandOrder[moveIdx];
		commandOrder[moveIdx] = b;
		changeSelectOrder.push(selectOrder);
		changeCommandOrder.push(commandOrder);
		if(sessionStorage.getItem("design_gui")) {
			sessionStorage.setItem("select_order_list", JSON.stringify(selectOrder));
			sessionStorage.setItem("command_index_list", JSON.stringify(commandOrder));
			sessionStorage.setItem("change_select_order_list", JSON.stringify(changeSelectOrder));
			sessionStorage.setItem("change_command_index_list", JSON.stringify(changeCommandOrder));
		}
		var tmpPath = recordElm.childNodes[idx+1].src;
		recordElm.childNodes[idx+1].src = recordElm.childNodes[idx-2].src;
		recordElm.childNodes[idx-2].src = tmpPath;
		var tmpText = recordElm.childNodes[idx+2].innerHTML;
		recordElm.childNodes[idx+2].innerHTML = recordElm.childNodes[idx-1].innerHTML;
		recordElm.childNodes[idx-1].innerHTML = tmpText;
	}

}

function deleteRoomLayout(e){
	var recordElm = document.getElementById("recordDiv");
	var idx = Array.prototype.indexOf.call(this.parentNode.parentNode.childNodes, this.parentNode);
	var a = recordElm.childNodes[idx];
	var b = recordElm.childNodes[idx-1];
	var c = recordElm.childNodes[idx-2];

	recordElm.removeChild(a);
	recordElm.removeChild(b);
	recordElm.removeChild(c);

	if(sessionStorage.getItem("select_order_list")){
		selectOrder = JSON.parse(sessionStorage.getItem("select_order_list"));
		commandOrder = JSON.parse(sessionStorage.getItem("command_index_list"));
	}

	var deleteIdx = (idx / 3) - 1;
	selectOrder.splice(deleteIdx, 1);
	commandOrder.splice(deleteIdx, 1);
	changeSelectOrder.push(selectOrder);
	changeCommandOrder.push(commandOrder);
	if(sessionStorage.getItem("design_gui")) {
		sessionStorage.setItem("select_order_list", JSON.stringify(selectOrder));
		sessionStorage.setItem("command_index_list", JSON.stringify(commandOrder));
		sessionStorage.setItem("change_select_order_list", JSON.stringify(changeSelectOrder));
		sessionStorage.setItem("change_command_index_list", JSON.stringify(changeCommandOrder));
	}
	var selectedImgLen = selectOrder.length;
	if (selectedImgLen < 1) {
		// disable the submit button
		var finishBtn = document.getElementById("finishBtn");
		finishBtn.className = "button pink serif round glass disabled";
	}
	var buttonVal = selectedImgLen + 1;
	document.getElementById("selectBtn").innerHTML = "Add Assignment " + buttonVal;
}


function undoDesign(){
	var selectedImgLen = selectOrder.length;
	if(selectedImgLen >= 1){
		if(sessionStorage.getItem("select_order_list")){
			selectOrder = JSON.parse(sessionStorage.getItem("select_order_list"));
			commandOrder = JSON.parse(sessionStorage.getItem("command_index_list"));
		}
		selectOrder.pop();
		commandOrder.pop();
		sessionStorage.setItem("select_order_list", JSON.stringify(selectOrder));
		sessionStorage.setItem("command_index_list", JSON.stringify(commandOrder));

		var len = document.getElementById("recordDiv").childNodes.length;
		var a = document.getElementById("recordDiv").childNodes[len-1];
		var b = document.getElementById("recordDiv").childNodes[len-2];
		document.getElementById("recordDiv").removeChild(a);
		document.getElementById("recordDiv").removeChild(b);

		document.getElementById("selectBtn").innerHTML = "Add Assignment " + selectedImgLen;

		if(!document.getElementById("recordDiv").getElementsByTagName("img").length){
			var undoBtn = document.getElementById("undoBtn");
			undoBtn.className = "button blue serif round glass disabled";
		}
		if(document.getElementById("recordDiv").getElementsByTagName("img").length < 1){
			var finishBtn = document.getElementById("finishBtn");
			finishBtn.className = "button pink serif round glass disabled";
		}
	}else{
		var undoBtn = document.getElementById("undoBtn");
		undoBtn.className = "button blue serif round glass disabled";
	}
}

function getCommands(id){
	var command;
	switch(id){
		case 1:
			command = ["Select command from here", "Move to the yellow room"];
			break;
		case 2:
			command = ["Select command from here", "Move to the yellow room", "Move to the purple room"];
			break;
		case 3:
			command = ["Select command from here", "Move to the red room", "Move to the green room", "Move to the yellow room"];
			break;
		case 4:
			command = ["Select command from here", "Move to the purple room", "Move to the yellow room", "Move to the green room", "Move to the blue room"];
			break;
		case 5:
			command = ["Select command from here", "Move to the red room", "Move the bag to the red room"];
			break;
		case 6:
			command = ["Select command from here", "Move to the red room", "Move to the yellow room", "Move the backpack to the blue room", "Move the backpack to the yellow room"];
			break;
		case 7:
			command = ["Select command from here", "Move to the red room", "Move to the yellow room", "Move to the purple room", "Move the basket to the red room", "Move the basket to the yellow room", "Move the basket to the purple room"];
			break;
		case 8:
			command = ["Select command from here", "Move to the purple room", "Move to the green room", "Move to the yellow room", "Move to the red room", "Move the chair to the purple room", "Move the chair to the green room", "Move the chair to the yellow room", "Move the chair to the red room"];
			break;
		case 9:
			command = ["Select command from here", "Move to the purple room", "Move the chair to the purple room", "Move the bag to the purple room"];
			break;
		case 10:
			command = ["Select command from here", "Move to the blue room", "Move to the yellow room", "Move the backpack to the blue room", "Move the backpack to the yellow room", "Move the bag to the red room"];
			break;
		case 11:
			command = ["Select command from here", "Move to the yellow room", "Move to the green room", "Move to the purple room", "Move the chair to the yellow room", "Move the chair to the blue room", "Move the chair to the green room", "Move the bag to the blue room", "Move the bag to the green room"];
			break;
		case 12:
			command = ["Select command from here", "Move to the green room", "Move to the red room", "Move to the purple room", "Move to the yellow room", "Move the bag to the red room", "Move the bag to the blue room", "Move the bag to the purple room", "Move the backpack to the red room", "Move the backpack to the blue room", "Move the backpack to the purple room", "Move the backpack to the yellow room"];
			break;
		case 13:
			command = ["Select command from here", "Move to the green room", "Move the chair to the green room", "Move the bag to the green room", "Move the backpack to the green room"];
			break;
		case 14:
			command = ["Select command from here", "Move to the green room", "Move to the yellow room", "Move the bag to the green room", "Move the chair to the yellow room", "Move the chair to the purple room", "Move the backpack to the yellow room", "Move the backpack to the purple room"];
			break;
		case 15:
			command = ["Select command from here", "Move to the green room", "Move to the yellow room", "Move to the blue room", "Move the basket to the green room", "Move the basket to the yellow room", "Move the basket to the blue room", "Move the backpack to the yellow room", "Move the backpack to the blue room", "Move the backpack to the red room", "Move the bag to the blue room", "Move the bag to the red room"];
			break;
		case 16:
			command = ["Select command from here", "Move to the red room", "Move to the green room", "Move to the blue room", "Move to the yellow room", "Move the chair to the purple room", "Move the chair to the green room", "Move the chair to the blue room", "Move the chair to the yellow room", "Move the backpack to the green room", "Move the backpack to the red room", "Move the backpack to the blue room", "Move the backpack to the yellow room", "Move the bag to the purple room", "Move the bag to the red room", "Move the bag to the green room"];
			break;
		case 17:
			command = ["Move the bag to the yellow room"];
			break;
	}
	return command;
}


function clearWorld(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
	$("#robotImage").remove();
	$("#houseImage").remove();
	$("#basketImage").remove();
	for(i = 0; i < blockArray.length; i++){
		var name = "#blockImage" + blockArray[i].id;
		$(name).remove();
	}
	rectArray.length = 0;
	blockArray.length = 0;
	classicRobot.isDelete = true;
	classicBlock.isDelete = true;
	classicLeftRect.isDelete = true;
	classicRightRect.isDelete = true;
	classicBottomRect.isDelete = true;

	boxes2.length = 0;
	doorArray.length = 0;
}

function drawTutorialLayout(){
	clearWorld();

	// draw robot
	classicRobot = new robot(5, 7);
	drawRobot(widthUnitSet, heightUnitSet);

	// draw rooms
	var roomParam = [[0, 11, 4, 11, "Blue"], [3, 11, 6, 11, "Blue"], [8, 11, 4, 11, "Blue"]];
	for(var i = 0; i < roomParam.length; i++){
		var roomObj = new room(roomParam[i][0], roomParam[i][1], roomParam[i][2], roomParam[i][3], roomParam[i][4]);
		rectArray.push(roomObj);
		addRect(roomObj.rowNum * widthUnitSet, roomObj.collumNum * heightUnitSet, roomObj.xNum * widthUnitSet, roomObj.yNum * heightUnitSet, changeStyle(roomObj.color));
	}
	for(var j = 0; j < boxes2.length; j++){
		boxes2[j].draw(ctx);
	}

	// draw objects
	var blockIndex = 0;
	var blockObj = new block(4, 3, "backpack", "Yellow");
	$('<img id="blockImage" src="images/robotImages/backpack/backpackYellow.png" />').insertAfter($("#canvas"));
	var blockElm = document.getElementById("blockImage");
	$("#blockImage").addClass("basket");
	blockIndex = blockIndex + 1;
	blockElm.style.width = widthUnitSet + 'px';
	blockElm.style.height = heightUnitSet + 'px';
	blockElm.style.left = canvasLeft + 4 * widthUnitSet + 'px';
	blockElm.style.top = (canvasHeight/heightUnitSet - 3) * heightUnitSet + 'px';
	blockElm.id = "blockImage" +  blockIndex;
	blockObj.id = blockIndex;
	blockArray.push(blockObj);

	var blockObj = new block(7, 9, "backpack", "Red");
	$('<img id="blockImage" src="images/robotImages/backpack/backpackRed.png" />').insertAfter($("#canvas"));
	var blockElm = document.getElementById("blockImage");
	$("#blockImage").addClass("basket");
	blockIndex = blockIndex + 1;
	blockElm.style.width = widthUnitSet + 'px';
	blockElm.style.height = heightUnitSet + 'px';
	blockElm.style.left = canvasLeft + 7 * widthUnitSet + 'px';
	blockElm.style.top = (canvasHeight/heightUnitSet - 9) * heightUnitSet + 'px';
	blockElm.id = "blockImage" +  blockIndex;
	blockObj.id = blockIndex;
	blockArray.push(blockObj);

	// draw doors
	var doorParam = [[3, 6, 1, 1], [8, 6, 1, 1]];
	for(var m = 0; m < doorParam.length; m++){
		var doorObj = new door(doorParam[m][0], doorParam[m][1], doorParam[m][2], doorParam[m][3]);
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(doorObj.rowNum * widthUnitSet, doorObj.relColNum * heightUnitSet, doorObj.xNum * widthUnitSet, doorObj.yNum * heightUnitSet);
		doorArray.push(doorObj);
	}
}

function clickSetTask(){
	var name = document.getElementById("submitButton").value;
	if(name == "Submit Environment 3"){
		loadComment();
	}else{
		name = "Submit Environment " + setIndex;
		document.getElementById("submitButton").value = name;
		setIndex++;
	}
}

function loadComment() {
	window.onload = popup('commentDiv');
	document.getElementById('iframeComment').src += '';
	document.getElementById('commentDiv').style.left = '430px';
	document.getElementById('commentDiv').style.top = '180px';
}

function drawFirstTest(){
	$("#robotImage").remove();
	$("#basketImage").remove();
	for(i = 0; i < blockArray.length; i++){
		var name = "#blockImage" + blockArray[i].id;
		$(name).remove();
	}
	rectArray.length = 0;
	blockArray.length = 0;
	classicRobot.isDelete = true;
	classicBlock.isDelete = true;
	classicLeftRect.isDelete = true;
	classicRightRect.isDelete = true;
	classicBottomRect.isDelete = true;
	boxes2.length = 0;
	doorArray.length = 0;
	blockIndex = 0;

	// draw robot
	classicRobot.rowNum = 2;
	classicRobot.colNum = parseInt((canvasHeight - heightUnit * 7) / heightUnit);
	classicRobot.relColNum = 7;
	classicRobot.isDelete = false;
	classicRobot.iniRowNum = 2;
	classicRobot.iniColNum = parseInt((canvasHeight - heightUnit * 7) / heightUnit);
	classicRobot.iniRelColNum = 7;
	drawRobot(widthUnit, heightUnit);

	// draw rectangles
	var rectObj = {};
	var left = 6 * widthUnitSet;
	var top = parseInt( (canvasHeight - 9 * heightUnitSet) / heightUnitSet ) * heightUnitSet;
	var width = 7 * widthUnitSet;
	var height = 9 * heightUnitSet;
	var color = "Yellow";
	addRect(left, top, width, height, changeStyle(color));
	rectObj.rowNum = 6;
	rectObj.collumNum = parseInt((canvasHeight - 9 * heightUnitSet) / heightUnitSet);
	rectObj.relColNum = 9;
	rectObj.xNum = 7;
	rectObj.yNum =9;
	rectObj.red = true;
	rectObj.color = color;
	rectArray.push(rectObj);

	var rectObj_2 = {};
	var left_2 = 0 * widthUnitSet;
	var top_2 = parseInt( (canvasHeight - 9 * heightUnitSet) / heightUnitSet ) * heightUnitSet;
	var width_2 = 6 * widthUnitSet;
	var height_2 = 9 * heightUnitSet;
	var color_2 = "Red";
	addRect(left_2, top_2, width_2, height_2, changeStyle(color_2));
	rectObj_2.rowNum = 0;
	rectObj_2.collumNum = parseInt((canvasHeight - 9 * heightUnitSet) / heightUnitSet);
	rectObj_2.relColNum = 9;
	rectObj_2.xNum = 6;
	rectObj_2.yNum =9;
	rectObj_2.red = true;
	rectObj_2.color = color_2;
	rectArray.push(rectObj_2);

	for(var i = 0; i < boxes2.length; i++){
		boxes2[i].draw(ctx);
	}

	// draw blocks
	$('<img id="blockImage" src="images/robotImages/chair/chairRed.png" />').insertAfter($("#canvas"));
	var blockElm = document.getElementById("blockImage");
	var blockObj = {};
	$("#blockImage").addClass("chair");
	blockIndex = blockIndex + 1;
	blockElm.style.width = widthUnitSet + 'px';
	blockElm.style.height = heightUnitSet + 'px';
	blockElm.style.left = canvasLeft + 2 * widthUnitSet + 'px';
	blockElm.style.top = 15 * heightUnitSet + 'px';
	blockElm.id = "blockImage" +  blockIndex;
	blockObj.rowNum = 2;
	blockObj.colNum = 15;
	blockObj.id = blockIndex;
	blockObj.relColNum = parseInt((canvasHeight - 15 * heightUnitSet) / heightUnitSet);
	blockObj.shape = "chair";
	blockObj.color = "Red";
	blockObj.isDelete = false;
	blockObj.iniRowNum = 2;
	blockObj.iniColNum = 15;
	blockObj.iniRelColNum = parseInt((canvasHeight - 15 * heightUnitSet) / heightUnitSet);
	blockArray.push(blockObj);

	// draw doors
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(5 * widthUnitSet, 12 * heightUnitSet, 2 * widthUnitSet, 2 * heightUnitSet);
	var doorObj = {};
	doorObj.rowNum = 5;
	doorObj.colNum = 12;
	doorObj.xNum = 2;
	doorObj.yNum = 2;
	doorObj.relColNum = parseInt((canvasHeight - 12 * heightUnitSet) / heightUnitSet);
	doorArray.push(doorObj);
}

function drawSecondTest(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

	drawFirstTest();

	if(document.getElementById("houseImage")){
		$("#houseImage").remove();
	}

	// add one green room
	var rectObj = {};
	var left = 0 * widthUnitSet;
	var top = parseInt( (canvasHeight - 14 * heightUnitSet) / heightUnitSet ) * heightUnitSet;
	var width = 13 * widthUnitSet;
	var height = 5 * heightUnitSet;
	var color = "Green";
	addRect(left, top, width, height, changeStyle(color));
	rectObj.rowNum = 0;
	rectObj.collumNum = parseInt((canvasHeight - 14 * heightUnitSet) / heightUnitSet);
	rectObj.relColNum = 14;
	rectObj.xNum = 13;
	rectObj.yNum =5;
	rectObj.red = true;
	rectObj.color = color;
	rectArray.push(rectObj);

	for(var i = 0; i < boxes2.length; i++){
		boxes2[i].draw(ctx);
	}

	// add one block
	$('<img id="blockImage" src="images/robotImages/bag/bagGreen.png" />').insertAfter($("#canvas"));
	var blockElm = document.getElementById("blockImage");
	var blockObj = {};
	$("#blockImage").addClass("chair");
	blockIndex = blockIndex + 1;
	blockElm.style.width = widthUnitSet + 'px';
	blockElm.style.height = heightUnitSet + 'px';
	blockElm.style.left = canvasLeft + 9 * widthUnitSet + 'px';
	blockElm.style.top = 15 * heightUnitSet + 'px';
	blockElm.id = "blockImage" +  blockIndex;

	blockObj.rowNum = 9;
	blockObj.colNum = 15;
	blockObj.id = blockIndex;
	blockObj.relColNum = parseInt((canvasHeight - 15 * heightUnitSet) / heightUnitSet);
	blockObj.shape = "bag";
	blockObj.color = "Green";
	blockObj.isDelete = false;
	blockObj.iniRowNum = 9;
	blockObj.iniColNum = 15;
	blockObj.iniRelColNum = parseInt((canvasHeight - 15 * heightUnitSet) / heightUnitSet);

	blockArray.push(blockObj);

	// add two doors
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(2 * widthUnitSet, 8 * heightUnitSet, 1 * widthUnitSet, 2 * heightUnitSet);
	var doorObj = {};
	doorObj.rowNum = 2;
	doorObj.colNum = 8;
	doorObj.xNum = 1;
	doorObj.yNum = 2;
	doorObj.relColNum = parseInt((canvasHeight - 8 * heightUnitSet) / heightUnitSet);
	doorArray.push(doorObj);

	ctx.fillStyle = "#ffffff";
	ctx.fillRect(9 * widthUnitSet, 8 * heightUnitSet, 1 * widthUnitSet, 2 * heightUnitSet);
	var doorObj2 = {};
	doorObj2.rowNum = 9;
	doorObj2.colNum = 8;
	doorObj2.xNum = 1;
	doorObj2.yNum = 2;
	doorObj2.relColNum = parseInt((canvasHeight - 8 * heightUnitSet) / heightUnitSet);
	doorArray.push(doorObj2);

	// draw first door
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(5 * widthUnitSet, 12 * heightUnitSet, 2 * widthUnitSet, 2 * heightUnitSet);
	var doorObj = {};
	doorObj.rowNum = 5;
	doorObj.colNum = 12;
	doorObj.xNum = 2;
	doorObj.yNum = 2;
	doorObj.relColNum = parseInt((canvasHeight - 12 * heightUnitSet) / heightUnitSet);
	doorArray.push(doorObj);
}

function drawThirdTest(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

	drawFirstTest();
	if(document.getElementById("houseImage")){
		$("#houseImage").remove();
	}

	// add two rooms
	var rectObj = {};
	var left = 0 * widthUnitSet;
	var top = parseInt( (canvasHeight - 14 * heightUnitSet) / heightUnitSet ) * heightUnitSet;
	var width = 5 * widthUnitSet;
	var height = 5 * heightUnitSet;
	var color = "Green";
	addRect(left, top, width, height, changeStyle(color));
	rectObj.rowNum = 0;
	rectObj.collumNum = parseInt((canvasHeight - 14 * heightUnitSet) / heightUnitSet);
	rectObj.relColNum = 14;
	rectObj.xNum = 5;
	rectObj.yNum =5;
	rectObj.red = true;
	rectObj.color = color;
	rectArray.push(rectObj);

	var rectObj2 = {};
	var left2 = 5 * widthUnitSet;
	var top2 = parseInt( (canvasHeight - 14 * heightUnitSet) / heightUnitSet ) * heightUnitSet;
	var width2 = 8 * widthUnitSet;
	var height2 = 5 * heightUnitSet;
	var color2 = "Magenta";
	addRect(left2, top2, width2, height2, changeStyle(color2));
	rectObj2.rowNum = 5;
	rectObj2.collumNum = parseInt((canvasHeight - 14 * heightUnitSet) / heightUnitSet);
	rectObj2.relColNum = 14;
	rectObj2.xNum = 8;
	rectObj2.yNum =5;
	rectObj2.red = true;
	rectObj2.color = color2;
	rectArray.push(rectObj2);

	for(var i = 0; i < boxes2.length; i++){
		boxes2[i].draw(ctx);
	}

	// add two blocks
	$('<img id="blockImage" src="images/robotImages/bag/bagGreen.png" />').insertAfter($("#canvas"));
	var blockElm = document.getElementById("blockImage");
	var blockObj = {};
	$("#blockImage").addClass("chair");
	blockIndex = blockIndex + 1;
	blockElm.style.width = widthUnitSet + 'px';
	blockElm.style.height = heightUnitSet + 'px';
	blockElm.style.left = canvasLeft + 9 * widthUnitSet + 'px';
	blockElm.style.top = 15 * heightUnitSet + 'px';
	blockElm.id = "blockImage" +  blockIndex;

	blockObj.rowNum = 9;
	blockObj.colNum = 15;
	blockObj.id = blockIndex;
	blockObj.relColNum = parseInt((canvasHeight - 15 * heightUnitSet) / heightUnitSet);
	blockObj.shape = "bag";
	blockObj.color = "Green";
	blockObj.isDelete = false;
	blockObj.iniRowNum = 9;
	blockObj.iniColNum = 15;
	blockObj.iniRelColNum = parseInt((canvasHeight - 15 * heightUnitSet) / heightUnitSet);
	blockArray.push(blockObj);

	$('<img id="blockImage" src="images/robotImages/chair/chairBlue.png" />').insertAfter($("#canvas"));
	var blockElm2 = document.getElementById("blockImage");
	var blockObj2 = {};
	$("#blockImage").addClass("chair");
	blockIndex = blockIndex + 1;
	blockElm2.style.width = widthUnitSet + 'px';
	blockElm2.style.height = heightUnitSet + 'px';
	blockElm2.style.left = canvasLeft + 3 * widthUnitSet + 'px';
	blockElm2.style.top = 15 * heightUnitSet + 'px';
	blockElm2.id = "blockImage" +  blockIndex;

	blockObj2.rowNum = 3;
	blockObj2.colNum = 15;
	blockObj2.id = blockIndex;
	blockObj2.relColNum = parseInt((canvasHeight - 15 * heightUnitSet) / heightUnitSet);
	blockObj2.shape = "chair";
	blockObj2.color = "Blue";
	blockObj2.isDelete = false;
	blockObj2.iniRowNum = 3;
	blockObj2.iniColNum = 15;
	blockObj2.iniRelColNum = parseInt((canvasHeight - 15 * heightUnitSet) / heightUnitSet);
	blockArray.push(blockObj2);

	// add three doors
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(2 * widthUnitSet, 8 * heightUnitSet, 1 * widthUnitSet, 2 * heightUnitSet);
	var doorObj = {};
	doorObj.rowNum = 2;
	doorObj.colNum = 8;
	doorObj.xNum = 1;
	doorObj.yNum = 2;
	doorObj.relColNum = parseInt((canvasHeight - 8 * heightUnitSet) / heightUnitSet);
	doorArray.push(doorObj);

	ctx.fillStyle = "#ffffff";
	ctx.fillRect(9 * widthUnitSet, 8 * heightUnitSet, 1 * widthUnitSet, 2 * heightUnitSet);
	var doorObj2 = {};
	doorObj2.rowNum = 9;
	doorObj2.colNum = 8;
	doorObj2.xNum = 1;
	doorObj2.yNum = 2;
	doorObj2.relColNum = parseInt((canvasHeight - 8 * heightUnitSet) / heightUnitSet);
	doorArray.push(doorObj2);

	ctx.fillStyle = "#ffffff";
	ctx.fillRect(4 * widthUnitSet, 6 * heightUnitSet, 2 * widthUnitSet, 1 * heightUnitSet);
	var doorObj3 = {};
	doorObj3.rowNum = 4;
	doorObj3.colNum = 6;
	doorObj3.xNum = 2;
	doorObj3.yNum = 1;
	doorObj3.relColNum = parseInt((canvasHeight - 6 * heightUnitSet) / heightUnitSet);
	doorArray.push(doorObj3);

	// draw first door
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(5 * widthUnitSet, 12 * heightUnitSet, 2 * widthUnitSet, 2 * heightUnitSet);
	var doorObj = {};
	doorObj.rowNum = 5;
	doorObj.colNum = 12;
	doorObj.xNum = 2;
	doorObj.yNum = 2;
	doorObj.relColNum = parseInt((canvasHeight - 12 * heightUnitSet) / heightUnitSet);
	doorArray.push(doorObj);

}

function mouseDownFunct(e){
	handleMouseDown(e);
	myDown(e);
};

function mouseMoveFunct(e){
	handleMouseMove(e);
	myMove(e);
};

function mouseUpFunct(e){
	handleMouseUp(e);
	myUp(e);
};

function mouseOutFunct(e){
	handleMouseOut(e);
};

function removeEvents(){
	canvas3.removeEventListener('mousedown', mouseDownFunct, false);
	canvas3.removeEventListener('mousemove', mouseMoveFunct, false);
	canvas3.removeEventListener('mouseup', mouseUpFunct, false);
	canvas3.removeEventListener('mouseout', mouseOutFunct, false);
	document.getElementById('newState').removeEventListener('click', newState, false);
	document.getElementById('classicState').removeEventListener('click', classicState, false);
	//document.getElementById('setBtn').removeEventListener('click', setBtn, false);
	canvas3.removeEventListener('keydown',  keyDownFunct, false);

	$('#newState').prop('disabled', true);
	$('#classicState').prop('disabled', true);
	//$('#setBtn').prop('disabled', true);
	//$('#cellWidth').prop('disabled', true);
	//$('#cellHeight').prop('disabled', true);

}

function designTaskGUI_1(){
	$('#giveCommand').prop('disabled', true);
	$('#commandText').prop('disabled', true);
	$('#changeUndo').prop('disabled', true);
}

function designTaskGUI_2(){
	$('#giveCommand').prop('disabled', false);
	$('#commandText').prop('disabled', false);
}

function init(widthUnit, heightUnit, color1, color2, color3){
	var rectOffsetX = 0;
	var rectOffsetY = parseInt( (canvasHeight - heightUnit * 9 ) / heightUnit) * heightUnit;

	ctx.fillStyle = "#000000";
	ctx.fillRect(rectOffsetX, rectOffsetY, widthUnit * 9, heightUnit * 9);   // draw the black rectangle
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(rectOffsetX + widthUnit * 2 , rectOffsetY + heightUnit * 4, widthUnit, heightUnit); 	// draw the white door
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(rectOffsetX + widthUnit * 6, rectOffsetY + heightUnit * 4, widthUnit, heightUnit);		// draw the white door

	var rectObj = {
		rowNum: 0,
		collumNum: 9,
		relColNum: 9,
		xNum: 5,
		yNum: 5,
		red: true,
		color: "Green"
    };
    rectArray.push(rectObj);
	addRect(0 * widthUnitSet, 9 * heightUnitSet, 5 * widthUnitSet, 5 * heightUnitSet, changeStyle("Green"));

	var rectObj2 = {
		rowNum: 4,
		collumNum: 9,
		relColNum: 9,
		xNum: 5,
		yNum: 5,
		red: true,
		color: "Blue"
    };
    rectArray.push(rectObj2);
	addRect(4 * widthUnitSet, 9 * heightUnitSet, 5 * widthUnitSet, 5 * heightUnitSet, changeStyle("Blue"));

	var rectObj3 = {
		rowNum: 0,
		collumNum: 13,
		relColNum: 5,
		xNum: 9,
		yNum: 5,
		red: true,
		color: "Red"
    };
    rectArray.push(rectObj3);
	addRect(0 * widthUnitSet, 13 * heightUnitSet, 9 * widthUnitSet, 5 * heightUnitSet, changeStyle("Red"));

	classicLeftDoor.rowNum = 2;
	classicLeftDoor.colNum = parseInt((canvasHeight - heightUnit * 5) / heightUnit);
	classicLeftDoor.relColNum = 5;
	classicLeftDoor.xNum = 1;
	classicLeftDoor.yNum = 1;
	classicLeftDoor.isDelete = false;

	classicRightDoor.rowNum = 6;
	classicRightDoor.colNum = parseInt((canvasHeight - heightUnit * 5) / heightUnit);
	classicRightDoor.relColNum = 5;
	classicRightDoor.xNum = 1;
	classicRightDoor.yNum = 1;
	classicRightDoor.isDelete = false;

	doorArray.push(classicLeftDoor);
	doorArray.push(classicRightDoor);

	classicRobot.rowNum = 6;
	classicRobot.colNum = parseInt((canvasHeight - heightUnit * 7) / heightUnit);
	classicRobot.relColNum = 7;
	classicRobot.isDelete = false;
	drawRobot(widthUnit, heightUnit);

	classicBlock.rowNum = 2;
	classicBlock.colNum = parseInt((canvasHeight - heightUnit * 3) / heightUnit);
	classicBlock.relColNum = 3;
	classicBlock.shape = "basket";
	classicBlock.color = "Red";
	classicBlock.isDelete = false;
	var path = getPath(classicBlock.shape, classicBlock.color);
	drawBasket(widthUnit, heightUnit, path);
	drawn = true;
}

function drawRobot(widthUnit, heightUnit){
	$('<img id="robotImage" src="images/robotImages/robotSouth.png" />').insertAfter($("#canvas"));		// add robot image element
	var robotElm = document.getElementById("robotImage");

	$("#robotImage").addClass("robot");
	robotElm.style.width = widthUnit + 'px';
	robotElm.style.height = heightUnit + 'px';
	robotElm.style.left = canvasLeft + classicRobot.rowNum * widthUnit + 'px';
 	robotElm.style.top = (canvasHeight - classicRobot.relColNum * heightUnit)+ 'px';

 	classicRobot.rowNum = classicRobot.rowNum;
	classicRobot.colNum = parseInt((canvasHeight - classicRobot.relColNum* heightUnit) / heightUnit);
	classicRobot.isDelete = false;
	classicRobot.iniRowNum = classicRobot.rowNum;
	classicRobot.iniColNum = classicRobot.colNum;
	classicRobot.iniRelColNum = classicRobot.relColNum;
}

function drawBasket(widthUnit, heightUnit, path){
	$('<img id="basketImage" src="" />').insertAfter($("#canvas"));	// add basket image element
	var basketElm = document.getElementById("basketImage");
	basketElm.src = path;
	$("#basketImage").addClass("basket");
	basketElm.style.width = widthUnit + 'px';
	basketElm.style.height = heightUnit + 'px';
	basketElm.style.left = canvasLeft + classicBlock.rowNum * widthUnit+ 'px';
	basketElm.style.top = parseInt((canvasHeight - (classicBlock.relColNum) * heightUnit) / heightUnit) * heightUnit+ 'px';

	classicBlock.rowNum = classicBlock.rowNum;
	classicBlock.colNum = parseInt((canvasHeight - (classicBlock.relColNum) * heightUnit) / heightUnit);
	classicBlock.isDelete = false;
}

function drawLeftRect(rectOffsetX, rectOffsetY, widthUnit, heightUnit, color1){
	ctx.fillStyle = changeStyle(color1);
	ctx.fillRect(rectOffsetX + widthUnit, rectOffsetY + heightUnit, widthUnit * 3, heightUnit * 3);    // draw the green rectangle

	classicLeftRect.rowNum = 1;
	classicLeftRect.colNum = parseInt((rectOffsetY + heightUnit) / heightUnit );
	classicLeftRect.relColNum = parseInt( (canvasHeight - classicLeftRect.colNum * heightUnit) / heightUnit );
	classicLeftRect.xNum = 3;
	classicLeftRect.yNum = 3;
	classicLeftRect.color = color1;
	classicLeftRect.isDelete = false;

}

function drawRightRect(rectOffsetX, rectOffsetY, widthUnit, heightUnit, color2){
	ctx.fillStyle = changeStyle(color2);
	ctx.fillRect(rectOffsetX + widthUnit * 5, rectOffsetY + heightUnit, widthUnit * 3, heightUnit * 3);    // draw the blue rectangle

	classicRightRect.rowNum = 5;
	classicRightRect.colNum =  parseInt((rectOffsetY + heightUnit) / heightUnit );
	classicRightRect.relColNum = parseInt( (canvasHeight - classicRightRect.colNum * heightUnit) / heightUnit );
	classicRightRect.xNum = 3;
	classicRightRect.yNum = 3;
	classicRightRect.color = color2;
	classicRightRect.isDelete = false;
}

function drawBottomRect(rectOffsetX, rectOffsetY, widthUnit, heightUnit, color3){
	ctx.fillStyle = changeStyle(color3);
	ctx.fillRect(rectOffsetX + widthUnit, rectOffsetY + heightUnit * 5, widthUnit * 7, heightUnit * 3);    // draw the red rectangle

	classicBottomRect.rowNum = 1;
	classicBottomRect.colNum =  parseInt( (rectOffsetY + heightUnit * 5) / heightUnit );
	classicBottomRect.relColNum = parseInt( (canvasHeight - classicBottomRect.colNum * heightUnit) / heightUnit );
	classicBottomRect.xNum = 7;
	classicBottomRect.yNum = 3;
	classicBottomRect.color = color3;
	classicBottomRect.isDelete = false;

}

function handleMouseDown(e) {
    mouseX = e.pageX - offsetX;
    mouseY = e.pageY - offsetY;

    // Put your mousedown stuff here
    startX = mouseX;
    startY = mouseY;
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    $("#canvas2").css({		// let canvas2 to be the temp canvas to draw
        left: canvasLeft,
        top: 0
    });

    $("#canvas3").css({		// let canvas3 to be the temp canvas to draw
        left: canvasLeft,
        top: 0
    });

    isDown = true;

    if(rectArray.length){
		for(i = 0; i < rectArray.length; i++){
			if(( startX >= rectArray[i].rowNum * widthUnitSet && startX <= (rectArray[i].rowNum + rectArray[i].xNum ) * widthUnitSet )
				&& (startY >= rectArray[i].collumNum * heightUnitSet && startY <= (rectArray[i].collumNum + rectArray[i].yNum ) * heightUnitSet)){
				isDown = false;
			}
		}
	}

}

function handleMouseMove(e) {
	var mousePos = getMousePos(canvas, e);
	uniMouseX = mousePos.x;
	uniMouseY = mousePos.y;

	if(isDown && !isDrag && !isResizeDrag){
    	mouseX = e.pageX - offsetX;
    	mouseY = e.pageY - offsetY;

    	// Put your mousemove stuff here
    	ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    	drawRect(mouseX, mouseY, ctx2, widthUnitSet, heightUnitSet);  // draw the rectangle on temp canvas

    	// showing a rectangle at the left top, right top, left bottom, right bottom of the image!
    	ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
    	var rowNum = parseInt( startX / widthUnitSet );
    	var collumNum = parseInt( startY / heightUnitSet );
    	var xNum = parseInt( (mouseX - startX) / widthUnitSet );
    	var yNum = parseInt ((mouseY - startY) / heightUnitSet);

    	ctx3.beginPath();

    	ctx3.setLineDash([5,5]);
    	if(xNum >= 0 && yNum >= 0){
    		ctx3.rect((rowNum + xNum - 1) * widthUnitSet, (collumNum + yNum - 1) * heightUnitSet, widthUnitSet, heightUnitSet);
    		ctx3.stroke();
    	}else if(xNum >= 0 && yNum <= 0){
    		yNum = Math.abs(yNum);
    		ctx3.rect((rowNum + xNum - 1) * widthUnitSet, (collumNum - yNum + 1) * heightUnitSet, widthUnitSet, heightUnitSet);
    		ctx3.stroke();
    	}else if(xNum <= 0 && yNum >= 0){
    		xNum = Math.abs(xNum);
    		ctx3.rect((rowNum - xNum + 1) * widthUnitSet, (collumNum + yNum - 1) * heightUnitSet, widthUnitSet, heightUnitSet);
    		ctx3.stroke();
    	}else{
    		xNum = Math.abs(xNum);
    		yNum = Math.abs(yNum);
    		ctx3.rect((rowNum - xNum + 1) * widthUnitSet, (collumNum - yNum + 1) * heightUnitSet, widthUnitSet, heightUnitSet);
    		ctx3.stroke();
    	}
    }
    else{
    	// let the canvas to get the focus to listen to keydown event
    	canvas3.setAttribute('tabindex','0');
		canvas3.focus();
		canvas3.style.outline = "none";

		widthNum = parseInt (uniMouseX / widthUnitSet);
		heightNum = parseInt ( uniMouseY / heightUnitSet );
    	ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
    	ctx3.lineWidth = 2;
    	ctx3.beginPath();
    	ctx3.setLineDash([6,6]);
    	ctx3.strokeStyle = "rgba(152,152,152,0.9)";

    	ctx3.rect(widthNum * widthUnitSet, heightNum * heightUnitSet, widthUnitSet, heightUnitSet);
    	ctx3.stroke();
    }
}

function handleMouseUp(e) {
    mouseX = e.pageX - offsetX;
    mouseY = e.pageY - offsetY;

    // Put your mouseup stuff here
    $("#canvas2").css({
        left: -2000,
        top: 0
    });

    if(isDown && !isResizeDrag && !isDrag){
    	if(mouseX != startX && mouseY != startY){
			var rectObj = drawRect(mouseX, mouseY, ctx, widthUnitSet, heightUnitSet);	// draw the rectangle on main canvas
			if(rectObj.xNum > 0 && rectObj.yNum > 0){
				if(rectObj.xNum < 3 || rectObj.yNum < 3){
					addRect(rectObj.rowNum * widthUnitSet, rectObj.collumNum * heightUnitSet, rectObj.xNum * widthUnitSet, rectObj.yNum * heightUnitSet, '#000000');
				}else{
					addRect(rectObj.rowNum * widthUnitSet, rectObj.collumNum * heightUnitSet, rectObj.xNum * widthUnitSet, rectObj.yNum * heightUnitSet, changeStyle(rectObj.color));
				}
			}
			rectArray.push(rectObj);
    	}
    }

    isDown = false;
}

function handleMouseOut(e) {
    mouseX = parseInt(e.pageX - offsetX);
    mouseY = parseInt(e.pageY - offsetY);

    // Put your mouseup stuff here
    $("#canvas2").css({
        left: -2000,
        top: 0
    });  
    
    if(isDown && !isResizeDrag && !isDrag){
    	 var rectObj = drawRect(mouseX, mouseY, ctx, widthUnitSet, heightUnitSet);	// draw the rectangle on main canvas  
    	 if(rectObj.xNum > 0 && rectObj.yNum > 0){
			  if(rectObj.xNum < 3 || rectObj.yNum < 3){
    	 	 	addRect(rectObj.rowNum * widthUnitSet, rectObj.collumNum * heightUnitSet, rectObj.xNum * widthUnitSet, rectObj.yNum * heightUnitSet, '#000000');
    	 	 }else{
			 	addRect(rectObj.rowNum * widthUnitSet, rectObj.collumNum * heightUnitSet, rectObj.xNum * widthUnitSet, rectObj.yNum * heightUnitSet, changeStyle(rectObj.color));
			 }
		}
    	 rectArray.push(rectObj);  
    }
    
    isDown = false;
}

// Box object to hold data
function Box2() {
  this.x = 0;
  this.y = 0;
  this.w = 1; // default width and height?
  this.h = 1;
  this.fill = '#444444';
}

// New methods on the Box class
Box2.prototype = {
  draw: function(context, optionalColor) {
      // We can skip the drawing of elements that have moved off the screen:
      if (this.x > WIDTH || this.y > HEIGHT) return; 
      if (this.x + this.w < 0 || this.y + this.h < 0) return;
      
      context.fillStyle = '#000000';
      context.fillRect(this.x,this.y,this.w,this.h);
      
      if(parseInt(Math.abs(this.w) / widthUnitSet) < 3 || parseInt (Math.abs(this.h) / heightUnitSet) < 3){
 			//console.log("no red rect");
 	  }else{
		  context.fillStyle = this.fill;
		  if(this.w > 0 && this.h > 0){
		  		context.fillRect(this.x + widthUnitSet, this.y + heightUnitSet, this.w - widthUnitSet * 2, this.h - heightUnitSet * 2);
		  		
		  }else if(this.w > 0 && this.h < 0){
		  		context.fillRect(this.x + widthUnitSet, this.y - heightUnitSet, this.w - widthUnitSet * 2, this.h + heightUnitSet * 2);
		  		
		  }else if(this.w < 0 && this.h > 0){
		  		context.fillRect(this.x - widthUnitSet, this.y + heightUnitSet, this.w + widthUnitSet * 2, this.h - heightUnitSet * 2);
		  		
		  }else{
		  		context.fillRect(this.x - widthUnitSet, this.y - heightUnitSet, this.w + widthUnitSet * 2, this.h + heightUnitSet * 2);
		  		
		  }
	}
	
    // draw selection
    // this is a stroke along the box and also 8 new selection handles
    if (mySel === this) {
      context.strokeStyle = mySelColor;
      context.lineWidth = mySelWidth;
      context.strokeRect(this.x,this.y,this.w,this.h);
      
      var half = mySelBoxSize / 2;
      
      // 0  1  2
      // 3     4
      // 5  6  7
      // top left, middle, right
      selectionHandles[0].x = this.x-half;
      selectionHandles[0].y = this.y-half;
      
      selectionHandles[1].x = this.x+this.w/2-half;
      selectionHandles[1].y = this.y-half;
      
      selectionHandles[2].x = this.x+this.w-half;
      selectionHandles[2].y = this.y-half;
      
      //middle left
      selectionHandles[3].x = this.x-half;
      selectionHandles[3].y = this.y+this.h/2-half;
      
      //middle right
      selectionHandles[4].x = this.x+this.w-half;
      selectionHandles[4].y = this.y+this.h/2-half;
      
      //bottom left, middle, right
      selectionHandles[6].x = this.x+this.w/2-half;
      selectionHandles[6].y = this.y+this.h-half;
      
      selectionHandles[5].x = this.x-half;
      selectionHandles[5].y = this.y+this.h-half;
      
      selectionHandles[7].x = this.x+this.w-half;
      selectionHandles[7].y = this.y+this.h-half;

      context.fillStyle = mySelBoxColor;
      for (var i = 0; i < 8; i ++) {
        var cur = selectionHandles[i];
        context.fillRect(cur.x, cur.y, mySelBoxSize, mySelBoxSize);
      }
    }
  } // end draw

}

function addRect(x, y, w, h, fill) {
	var rect = new Box2;
	rect.x = x;
	rect.y = y;
	rect.w = w
	rect.h = h;
	rect.fill = fill;
	boxes2.push(rect);
  	invalidate();
}

function init2() {
  HEIGHT = canvas.height;
  WIDTH = canvas.width;
  ctx = canvas.getContext('2d');
  ghostcanvas = document.createElement('canvas');
  ghostcanvas.height = canvasHeight;
  if(sessionStorage.getItem("design_gui")){
  	ghostcanvas.width = 1040;
  }else{
  	ghostcanvas.width = 640;
  }
  gctx = ghostcanvas.getContext('2d');
  
  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.onselectstart = function () { return false; }
  
  // fixes mouse co-ordinate problems when there's a border or padding
  // see getMouse for more detail
  if (document.defaultView && document.defaultView.getComputedStyle) {
    stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)     || 0;
    stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)      || 0;
    styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
    styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)  || 0;
  }
  
  setInterval(mainDraw, INTERVAL);
  
  // set up the selection handle boxes
  for (var i = 0; i < 8; i ++) {
    var rect = new Box2;
    selectionHandles.push(rect);
  }
}

function clear(c) {
  c.clearRect(0, 0, WIDTH, HEIGHT);
}

function mainDraw() {
  if (canvasValid == false) {
    clear(ctx);
    
    // repaint all user's blocks
	for(i = 0; i < blockArray.length; i++){
		var name = "blockImage" + blockArray[i].id;
		var blockElm = document.getElementById(name);
		
		blockElm.style.left =  canvasLeft + blockArray[i].rowNum * widthUnitSet + 'px';
		blockElm.style.top = parseInt((canvasHeight - (blockArray[i].relColNum) * heightUnitSet) / heightUnitSet) * heightUnitSet+ 'px';
		blockElm.style.width = widthUnitSet + 'px';
		blockElm.style.height = heightUnitSet + 'px';
		blockArray[i].colNum = parseInt((canvasHeight - (blockArray[i].relColNum) * heightUnitSet) / heightUnitSet);
	}
    
    // repaint all rectangles
    var l = boxes2.length;
    //var l = rectArray.length;
    for (var i = 0; i < l; i++) {
      //ctx.clearRect(boxes2[i].x, boxes2[i].y, boxes2[i].w, boxes2[i].h);
      boxes2[i].draw(ctx); // we used to call drawshape, but now each box draws itself
      rectArray[i].rowNum = parseInt (boxes2[i].x / widthUnitSet);
      rectArray[i].collumNum = parseInt (boxes2[i].y / heightUnitSet);
      rectArray[i].relColNum = parseInt ((canvasHeight - rectArray[i].collumNum * heightUnitSet) / heightUnitSet);
      rectArray[i].xNum = boxes2[i].w / widthUnitSet;
      rectArray[i].yNum = boxes2[i].h / heightUnitSet; 
    }
   
   	// repaint all doors (including classic doors) 
   	repaintDoor();
    canvasValid = true;
  }
}

// Happens when the mouse is moving inside the canvas
function myMove(e){
  if (isDrag) {
    getMouse(e);

    // something is changing position so we better invalidate the canvas!
    invalidate();
  } else if (isResizeDrag) {
    // time ro resize!
    var oldx = mySel.x;
    var oldy = mySel.y;
    
    // 0  1  2
    // 3     4
    // 5  6  7
    switch (expectResize) {      
      case 0:
        mySel.x = parseInt(mx / widthUnitSet ) * widthUnitSet;
        mySel.y = parseInt(my / heightUnitSet) * heightUnitSet;
        mySel.w += oldx - mySel.x;
        mySel.h += oldy - mySel.y;
        break;
      case 1:
        mySel.y = parseInt(my / heightUnitSet) * heightUnitSet;
        mySel.h += oldy - mySel.y;
        break;
      case 2:
        mySel.y = parseInt(my / heightUnitSet) * heightUnitSet;
        mySel.w = parseInt(mx / widthUnitSet ) * widthUnitSet - oldx;
        if(mySel.w > 0){
        	mySel.w = mySel.w + widthUnitSet;
        }else{
        	mySel.w = mySel.w - widthUnitSet;
        }
        mySel.h += oldy - mySel.y;
        break;
      case 3:
        mySel.x = parseInt(mx / widthUnitSet) * widthUnitSet;
        mySel.w += oldx - mySel.x;
        break;
      case 4:
        mySel.w = parseInt(mx / widthUnitSet ) * widthUnitSet - oldx;
        if(mySel.w > 0){
        	mySel.w = mySel.w + widthUnitSet;
        }else{
        	mySel.w = mySel.w - widthUnitSet;
        }
        break;
      case 5:
        mySel.x = parseInt(mx / widthUnitSet ) * widthUnitSet;
        mySel.w += oldx - mySel.x;
        mySel.h = parseInt(my / heightUnitSet) * heightUnitSet - oldy;
        if(mySel.h > 0){
        	mySel.h = mySel.h + heightUnitSet;
        }else{
        	mySel.h = mySel.h - heightUnitSet;
        }
        break;
      case 6:
        mySel.h = parseInt(my / heightUnitSet) * heightUnitSet - oldy;
        if(mySel.h > 0){
        	mySel.h = mySel.h + heightUnitSet;
        }else{
        	mySel.h = mySel.h - heightUnitSet;
        }
        break;
      case 7:
        mySel.w = parseInt(mx / widthUnitSet ) * widthUnitSet - oldx;
        mySel.h = parseInt(my / heightUnitSet) * heightUnitSet - oldy;
        if(mySel.w > 0){
        	mySel.w = mySel.w + widthUnitSet;
        }else{
        	mySel.w = mySel.w - widthUnitSet;
        }
        if(mySel.h > 0){
        	mySel.h = mySel.h + heightUnitSet;
        }else{
        	mySel.h = mySel.h - heightUnitSet;
        }
        break;
    }
    
    if(parseInt(mySel.w / widthUnitSet) > 2 && parseInt(mySel.h / heightUnitSet) > 2){
    	var l = boxes2.length;
    	for(var i = 0; i < l; i++){
    		if(boxes2[i].x == mySel.x && boxes2[i].y == mySel.y && boxes2[i].fill == '#000000'){
    			boxes2[i].fill = changeStyle("Red");
    			rectArray[i].red = true;
    			rectArray[i].color = "Red";
    		}
    	}
    }
    invalidate();
  }
  
  getMouse(e);
  // if there's a selection see if we grabbed one of the selection handles
  if (mySel !== null && !isResizeDrag) {
    for (var i = 0; i < 8; i++) {
      // 0  1  2
      // 3     4
      // 5  6  7
      
      var cur = selectionHandles[i];
      
      // we dont need to use the ghost context because
      // selection handles will always be rectangles
      if (mx >= cur.x && mx <= cur.x + mySelBoxSize &&
          my >= cur.y && my <= cur.y + mySelBoxSize) {
        // we found one!
        expectResize = i;
        invalidate();
        return;
      }
      
    }
    // not over a selection box, return to normal
    isResizeDrag = false;
    expectResize = -1;
//    this.style.cursor='auto';
  }
  
}

// Happens when the mouse is clicked in the canvas
function myDown(e){
  getMouse(e);
  
  //we are over a selection box
  if (expectResize !== -1) {
    isResizeDrag = true;
    return;
  }
  
  clear(gctx);
  var l = boxes2.length;
  for (var i = l-1; i >= 0; i--) {
    // draw shape onto ghost context
    boxes2[i].draw(gctx, 'black');
    
    // get image data at the mouse x,y pixel
    var imageData = gctx.getImageData(mx, my, 1, 1);
    var index = (mx + my * imageData.width) * 4;
    
    // if the mouse pixel exists, select and break
    if (imageData.data[3] > 0) {
      mySel = boxes2[i];
      offsetx = mx - mySel.x;
      offsety = my - mySel.y;
      mySel.x = mx - offsetx;
      mySel.y = my - offsety;
      isDrag = true;
      
      invalidate();
      clear(gctx);
      return;
    }
    
  }
  // havent returned means we have selected nothing
  mySel = null;
  // clear the ghost canvas for next time
  clear(gctx);
  // invalidate because we might need the selection border to disappear
  invalidate();
}

function myUp(){
  isDrag = false;
  isResizeDrag = false;
  expectResize = -1;
}

function invalidate() {
  canvasValid = false;
}

function getMouse(e) {
      var element = canvas, offsetX = 0, offsetY = 0;

      if (element.offsetParent) {
        do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
      }

      // Add padding and border style widths to offset
      offsetX += stylePaddingLeft;
      offsetY += stylePaddingTop;

      offsetX += styleBorderLeft;
      offsetY += styleBorderTop;

      mx = e.pageX - offsetX;
      my = e.pageY - offsetY
}


function drawRect(toX, toY, context, widthUnitSet, heightUnitSet) {  
    var xNum = parseInt( (toX - startX) / widthUnitSet );	// the number of width cell
    var yNum = parseInt ((toY - startY) / heightUnitSet);   // the number of height cell
    var rowNum = parseInt( startX / widthUnitSet );			// the number of left cell
    var collumNum = parseInt( startY / heightUnitSet );		// the number of top cell 
    var left = 0;
    var top = 0;
    var width = 0;
    var height = 0;
    var rectObj = {
		rowNum: 0,
		collumNum: 0,
		relColNum: 0,
		xNum: 0,
		yNum: 0,
		red: false,
		color: " "
    };
    
    context.fillStyle = "#000000";
	if(xNum > 0 && yNum > 0){
		left = rowNum * widthUnitSet;
		top = collumNum * heightUnitSet;	
	}else if(xNum > 0 && yNum < 0){
		yNum = Math.abs(yNum);
		left = rowNum * widthUnitSet;
		top = collumNum * heightUnitSet - (yNum - 1) * heightUnitSet;
	}else if(xNum < 0 && yNum > 0){
		xNum = Math.abs(xNum);
		left = rowNum * widthUnitSet- (xNum - 1) * widthUnitSet;
		top = collumNum * heightUnitSet;	
	}else{
		xNum = Math.abs(xNum);
		yNum = Math.abs(yNum);
		left = rowNum * widthUnitSet- (xNum - 1) * widthUnitSet;
		top = collumNum * heightUnitSet - (yNum - 1) * heightUnitSet;	
		
	}
	rowNum = parseInt( left / widthUnitSet );			// the number of left cell
    collumNum = parseInt( top / heightUnitSet );		// the number of top cell  
	width = xNum * widthUnitSet;
	height = yNum * heightUnitSet;
	context.fillRect(left, top, width, height);
	if(xNum < 3 || yNum < 3){
		rectObj.red = false;
	}else{
		context.fillStyle = "#ff9999";
		context.fillRect(left + widthUnitSet, top + heightUnitSet, width - widthUnitSet * 2, height - heightUnitSet * 2);
		rectObj.red = true;
		rectObj.color = "Red";
	}
	//isDrawn = true;	
	rectObj.rowNum = rowNum;
	rectObj.collumNum = collumNum;
	rectObj.relColNum = parseInt((canvasHeight - collumNum * heightUnitSet) / heightUnitSet);
	rectObj.xNum = xNum;
	rectObj.yNum = yNum;
	
	return rectObj;	
}

function newState(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
	$("#robotImage").remove();
	$("#basketImage").remove();
	for(i = 0; i < blockArray.length; i++){
		var name = "#blockImage" + blockArray[i].id;
		$(name).remove();
	}
	rectArray.length = 0;
	blockArray.length = 0;
	classicRobot.isDelete = true;
	classicBlock.isDelete = true;
	classicLeftRect.isDelete = true;
	classicRightRect.isDelete = true;
	classicBottomRect.isDelete = true;
	
	boxes2.length = 0;
	doorArray.length = 0;
}

function classicState(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
	$("#robotImage").remove();
	$("#basketImage").remove();
	for(i = 0; i < blockArray.length; i++){
		var name = "#blockImage" + blockArray[i].id;
		$(name).remove();
	}
	
	rectArray.length = 0;
	blockArray.length = 0;
	classicRobot.isDelete = false;
	classicBlock.isDelete = false;
	classicLeftRect.isDelete = false;
	classicRightRect.isDelete = false;
	classicBottomRect.isDelete = false;
	
	boxes2.length = 0;
	doorArray.length = 0;
	init(widthUnitSet, heightUnitSet, "Green", "Blue", "Red");
	
}
      
function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

function keyDownFunct(e){
	//if(isDrawn){ // if the canvas is drawn, we can execute the cheat sheet	
		// press 'd': place the dog   
		if (e.keyCode == 68 || e.keyCode == 100){	
			if(document.getElementById("robotImage")){				
				var robotElm = document.getElementById("robotImage");
				robotElm.style.left = canvasLeft + widthNum * widthUnitSet + 'px';
				robotElm.style.top = heightNum * heightUnitSet + 'px';	
			}else{
				$('<img id="robotImage" src="images/robotImages/robotSouth.png" />').insertAfter($("#canvas"));
				var robotElm = document.getElementById("robotImage");	
				$("#robotImage").addClass("robot");	
				robotElm.style.width = widthUnitSet + 'px';
				robotElm.style.height = heightUnitSet + 'px';
				robotElm.style.left = canvasLeft + widthNum * widthUnitSet + 'px';
				robotElm.style.top = heightNum * heightUnitSet + 'px';		
			}	
			classicRobot.rowNum = widthNum;
			classicRobot.colNum = heightNum;
			classicRobot.relColNum = parseInt((canvasHeight - heightNum * heightUnitSet) / heightUnitSet);		
			classicRobot.isDelete = false;	
		}
			
		// press 'o': add an object		
		if (e.keyCode == 79 || e.keyCode == 111){	
			isSameBlock = false;
			
			//if((classicBlock.isDelete == true && blockArray.length >= 3) || (classicBlock.isDelete == false && blockArray.length >= 2)){
			//	alert("You have 3 objects in the world now, you can't add new object!");
			//}else{
				for(i = 0; i < blockArray.length; i++){
					if(blockArray[i].rowNum == widthNum && blockArray[i].colNum == heightNum){
						isSameBlock = true;
					}
				}
				
				if(!classicBlock.isDelete){
					if(classicBlock.rowNum == widthNum && classicBlock.colNum == heightNum){
						isSameBlock = true;
					}
				}
				
				if(!isSameBlock){
					$('<img id="blockImage" src="images/robotImages/chair/chairBlue.png" />').insertAfter($("#canvas"));
					var blockElm = document.getElementById("blockImage");	
					var blockObj = {
						rowNum: 0,
						colNum: 0,
						id: 0,
						relColNum: 0,
						shape: "chair", 
						color: "Blue",
						isDelete: false
					};
					$("#blockImage").addClass("chair");	
					blockIndex = blockIndex + 1;
					blockElm.style.width = widthUnitSet + 'px';
					blockElm.style.height = heightUnitSet + 'px';
					blockElm.style.left = canvasLeft + widthNum * widthUnitSet + 'px';
					blockElm.style.top = heightNum * heightUnitSet + 'px';	
					blockElm.id = "blockImage" +  blockIndex;
			
					blockObj.rowNum = widthNum;
					blockObj.colNum = heightNum;
					blockObj.id = blockIndex;
					blockObj.relColNum = parseInt((canvasHeight - heightNum * heightUnitSet) / heightUnitSet);
					
					blockObj.iniRowNum = widthNum;
					blockObj.iniColNum = heightNum;
					blockObj.iniRelColNum = parseInt((canvasHeight - heightNum * heightUnitSet) / heightUnitSet);
					blockArray.push(blockObj);
				}
				
			//}
				
		}		
			
		// press 'c': change color		
		if (e.keyCode == 67 || e.keyCode == 99){
			// change the color of classic block	
			if(!classicBlock.isDelete){
				if(classicBlock.rowNum == widthNum && classicBlock.colNum == heightNum){			
					var shape = classicBlock.shape,
						newColor = changeColor(classicBlock.color),
						path = getPath(shape, newColor);

						document.getElementById("basketImage").src = path;
						classicBlock.color = newColor;
						return;
				}		
			}
			
			// change the color of user's block			
			if(blockArray.length){
				for(i = 0; i < blockArray.length; i++){
					if(blockArray[i].rowNum == widthNum && blockArray[i].colNum == heightNum){	
						var shape = blockArray[i].shape,
							newColor = changeColor(blockArray[i].color),
							path = getPath(shape, newColor),
							id = blockArray[i].id,
							name = "blockImage" + id;
						
						document.getElementById(name).src = path;
						blockArray[i].color = newColor;
						return;
					}		
				}
			}			
			
			// change the color of user's rectangles	
			if(rectArray.length){
				for(i = 0; i < rectArray.length; i++){
					resetRectArray(boxes2[i], rectArray[i]);
					if((widthNum >= rectArray[i].rowNum && widthNum <= rectArray[i].rowNum + rectArray[i].xNum - 1) 
					&& (heightNum >= rectArray[i].collumNum && heightNum <= rectArray[i].collumNum + rectArray[i].yNum - 1)){	
						var left = rectArray[i].rowNum * widthUnitSet + widthUnitSet,
							top = rectArray[i].collumNum * heightUnitSet + heightUnitSet,
							width = rectArray[i].xNum * widthUnitSet - widthUnitSet * 2,
							height = rectArray[i].yNum * heightUnitSet - heightUnitSet * 2,
							newColor = changeColor(rectArray[i].color);
						
						ctx.clearRect(left, top, width, height);								
						ctx.fillStyle = changeStyle(newColor);	
						ctx.fillRect(left, top, width, height);
						rectArray[i].color = newColor;

						if(boxes2[i]){
							boxes2[i].fill = changeStyle(newColor);	
							boxes2[i].draw(ctx); 
						}
						
						break;					
					}		
				}
				
				repaintRect();
			   	repaintDoor();	
				return;
			}		
		}	
			
			// press 'h': add a hallway
			if (e.keyCode == 72 || e.keyCode == 104){
				widthNum = parseInt(uniMouseX / widthUnitSet);
				heightNum = parseInt(uniMouseY / heightUnitSet);
				
				var imgData = ctx.getImageData(widthNum * widthUnitSet + mySelWidth, heightNum * heightUnitSet + mySelWidth, widthUnitSet - mySelWidth*2, heightUnitSet - mySelWidth * 2);
				if(imgData.data[0] == 0 && imgData.data[1] == 0 && imgData.data[2] == 0 && imgData.data[3] == 255){
					for(var index = 0; index < doorArray.length; index++){
						var x = doorArray[index].rowNum;
						var y = doorArray[index].colNum;
						var w = doorArray[index].xNum;
						var h = doorArray[index].yNum;
						
						if(widthNum >= x && widthNum <= (x + w - 1) && heightNum == y - 1){
							doorArray[index].rowNum = x;
							doorArray[index].colNum = y - 1;
							doorArray[index].xNum = w;
							doorArray[index].yNum = h + 1;
							doorArray[index].relColNum = parseInt((canvasHeight - (doorArray[index].colNum) * heightUnitSet) / heightUnitSet);
							isConnect = true;
							//break;	
							ctx.fillStyle = "#ffffff";
							ctx.fillRect(doorArray[index].rowNum * widthUnitSet, doorArray[index].colNum * heightUnitSet, doorArray[index].xNum * widthUnitSet, doorArray[index].yNum * heightUnitSet);
						}else if(widthNum >= x && widthNum <= (x + w - 1) && heightNum == y + h){
							doorArray[index].rowNum = x;
							doorArray[index].colNum = y;
							doorArray[index].xNum = w;
							doorArray[index].yNum = h + 1;	
							doorArray[index].relColNum = parseInt((canvasHeight - (doorArray[index].colNum) * heightUnitSet) / heightUnitSet);
							isConnect = true;
							//break;
							ctx.fillStyle = "#ffffff";
							ctx.fillRect(doorArray[index].rowNum * widthUnitSet, doorArray[index].colNum * heightUnitSet, doorArray[index].xNum * widthUnitSet, doorArray[index].yNum * heightUnitSet);
						}else if(widthNum == x - 1 && heightNum >= y && heightNum <= (y + h - 1)){
							doorArray[index].rowNum = x - 1;
							doorArray[index].colNum = y;
							doorArray[index].xNum = w + 1;
							doorArray[index].yNum = h;
							doorArray[index].relColNum = parseInt((canvasHeight - (doorArray[index].colNum) * heightUnitSet) / heightUnitSet);
							isConnect = true;
							//break;
							ctx.fillStyle = "#ffffff";
							ctx.fillRect(doorArray[index].rowNum * widthUnitSet, doorArray[index].colNum * heightUnitSet, doorArray[index].xNum * widthUnitSet, doorArray[index].yNum * heightUnitSet);
						}else if(widthNum == x + w && heightNum >= y && heightNum <= (y + h - 1)){
							doorArray[index].rowNum = x;
							doorArray[index].colNum = y;
							doorArray[index].xNum = w + 1;
							doorArray[index].yNum = h;
							doorArray[index].relColNum = parseInt((canvasHeight - (doorArray[index].colNum) * heightUnitSet) / heightUnitSet);
							isConnect = true;
							//break;
							ctx.fillStyle = "#ffffff";
							ctx.fillRect(doorArray[index].rowNum * widthUnitSet, doorArray[index].colNum * heightUnitSet, doorArray[index].xNum * widthUnitSet, doorArray[index].yNum * heightUnitSet);
						}
					}
					
					if(isConnect){
						isConnect = false;
					}else{
						ctx.fillStyle = "#ffffff";
						ctx.fillRect(widthNum * widthUnitSet, heightNum * heightUnitSet, widthUnitSet, heightUnitSet);
						var doorObj = {};
						doorObj.rowNum = widthNum;
						doorObj.colNum = heightNum;
						doorObj.xNum = 1;
						doorObj.yNum = 1;
						doorObj.relColNum = parseInt((canvasHeight - (doorObj.colNum) * heightUnitSet) / heightUnitSet);
						doorArray.push(doorObj);
					}
				}
			}
			
			// press 's': change the shape of image, chair -> bag -> backpack -> basket (the same color)   
			if (e.keyCode == 83 || e.keyCode == 115){
				// shape the user's block		OK
				if(blockArray.length){
					for(i = 0; i < blockArray.length; i++){
						if(blockArray[i].rowNum == widthNum && blockArray[i].colNum == heightNum){	
							var color = blockArray[i].color,
								newShape = changeShape(blockArray[i].shape),
								path = getPath(newShape, color),
								id = blockArray[i].id,
								name = "blockImage" + id;
							
							document.getElementById(name).src = path;
							blockArray[i].shape = newShape;
							return;
						}		
					}
				}
				
				// shape the initial block	
				if(!classicBlock.isDelete){
					if(classicBlock.rowNum== widthNum && classicBlock.colNum == heightNum){			
						var color = classicBlock.color,
							newShape = changeShape(classicBlock.shape),
							path = getPath(newShape, color);
							
							document.getElementById("basketImage").src = path;
							classicBlock.shape = newShape;
							return;
						}	
				}
			}
			
			// press 'x': delete the selected image
			if (e.keyCode == 88 || e.keyCode == 125){
				// delete the block in classic state	
				if(!classicBlock.isDelete){			
					if(classicBlock.rowNum == widthNum && classicBlock.colNum == heightNum){
						deleteObj = {};
						deleteObj.rowNum = classicBlock.rowNum;
						deleteObj.colNum = classicBlock.colNum;
						deleteObj.relColNum = classicBlock.relColNum;
						deleteObj.shape = classicBlock.shape;
						deleteObj.color = classicBlock.color;
						deleteObj.name = "classicBlock";
						deleteArray.push(deleteObj);

						$("#basketImage").remove();
						classicBlock.isDelete = true;

						return;
					}
				}
				
				// delete the user's block
				if(blockArray.length){
					for(i = 0; i < blockArray.length; i++){
						if(blockArray[i].rowNum == widthNum && blockArray[i].colNum == heightNum){	
							var id = blockArray[i].id,
								name = "#blockImage" + id;
							
							deleteObj = {};
							deleteObj.rowNum = blockArray[i].rowNum;
							deleteObj.colNum = blockArray[i].colNum;
							deleteObj.relColNum = blockArray[i].relColNum;
							deleteObj.shape = blockArray[i].shape;
							deleteObj.color = blockArray[i].color;
							deleteObj.id = blockArray[i].id;
							deleteObj.isDelete = false;
							deleteObj.iniRowNum = blockArray[i].rowNum;
							deleteObj.iniColNum = blockArray[i].colNum;
							deleteObj.iniRelColNum = blockArray[i].relColNum;
							deleteObj.name = "userBlock";
							deleteArray.push(deleteObj);

							$(name).remove();
							blockArray.splice(i, 1);
							
							return;
						}		
					}
				}		
				
				// delete the user's doors
				if(doorArray.length){
					for(i = 0; i < doorArray.length; i++){
						if((widthNum >= doorArray[i].rowNum && widthNum <= doorArray[i].rowNum + doorArray[i].xNum - 1) 
						&& (heightNum >= doorArray[i].colNum && heightNum <= doorArray[i].colNum + doorArray[i].yNum - 1)){	
							deleteObj = {};
							deleteObj.rowNum = doorArray[i].rowNum;
							deleteObj.colNum = doorArray[i].colNum;
							deleteObj.relColNum = doorArray[i].relColNum;
							deleteObj.xNum = doorArray[i].xNum;
							deleteObj.yNum = doorArray[i].yNum;
							deleteObj.name = "door";
							deleteArray.push(deleteObj);

							ctx.fillStyle = "#c8c8c8";
							ctx.fillRect(doorArray[i].rowNum * widthUnitSet, doorArray[i].colNum * heightUnitSet, doorArray[i].xNum * widthUnitSet, doorArray[i].yNum * heightUnitSet);
							doorArray.splice(i, 1);
							repaintRect();
							repaintDoor();
							return;
							
						}
					}					
				}
				
				// delete the user's rectangles
				if(rectArray.length){
					for(i = 0; i < rectArray.length; i++){
					    resetRectArray(boxes2[i], rectArray[i]);
						if((widthNum >= rectArray[i].rowNum && widthNum <= rectArray[i].rowNum + rectArray[i].xNum - 1) 
						&& (heightNum >= rectArray[i].collumNum && heightNum <= rectArray[i].collumNum + rectArray[i].yNum - 1)){	
							var left = rectArray[i].rowNum * widthUnitSet,
								top = rectArray[i].collumNum * heightUnitSet,
								width = rectArray[i].xNum * widthUnitSet,
								height = rectArray[i].yNum * heightUnitSet;

							ctx.clearRect(left, top, width, height);

							deleteObj = {};
							deleteObj.rowNum = rectArray[i].rowNum;
							deleteObj.collumNum = rectArray[i].collumNum;
							deleteObj.xNum = rectArray[i].xNum;
							deleteObj.yNum = rectArray[i].yNum;
							deleteObj.color = rectArray[i].color;
							deleteObj.name = "rectangle";
							deleteArray.push(deleteObj);

							rectArray.splice(i, 1);
							boxes2.splice(i, 1);
							ctx.clearRect(left - mySelWidth, top - mySelWidth, width + mySelWidth*2, height + mySelWidth*2);
							for (var j = 0; j < 8; j ++) {
								var cur = selectionHandles[j];
								ctx.clearRect(cur.x, cur.y, mySelBoxSize, mySelBoxSize);
							}
							break;
						}		
					}
					repaintRect();
					repaintDoor();
	
					return;
				}	
		}		

		// press 'R', reward the agent
		if (e.keyCode == 82 || e.keyCode == 114){
			if(document.getElementById("reward").disabled == false){
				msg = '{"msgType":"feedback_msg","feedback":1.0}';
				ws.send(msg);
			}	
		}	
		
		// press 'P', punish the agent
		if (e.keyCode == 80 || e.keyCode == 112){
			if(document.getElementById("reward").disabled == false){
				msg = '{"msgType":"feedback_msg","feedback":-1.0}';
				ws.send(msg);
			}
		}	
}

function changeUndo(){
	if(deleteArray.length){
		deleteObj = deleteArray[deleteArray.length-1];
		switch(deleteObj.name){
			case "classicBlock":
				classicBlock.rowNum = deleteObj.rowNum;
				classicBlock.colNum = deleteObj.colNum;
				classicBlock.relColNum = deleteObj.relColNum;
				classicBlock.shape = deleteObj.shape;
				classicBlock.color = deleteObj.color;
				classicBlock.isDelete = deleteObj.isDelete;
				var path = getPath(classicBlock.shape, classicBlock.color);
				drawBasket(widthUnit, heightUnit, path);
				break;
			case "userBlock":
				blockArray.push(deleteObj);
				$('<img id="blockImage" src="images/robotImages/chair/chairBlue.png" />').insertAfter($("#canvas"));
				var blockElm = document.getElementById("blockImage");
				$("#blockImage").addClass("chair");
				var path = getPath(deleteObj.shape, deleteObj.color);
				blockElm.src = path;
				blockElm.style.width = widthUnitSet + 'px';
				blockElm.style.height = heightUnitSet + 'px';
				blockElm.style.left = canvasLeft + deleteObj.rowNum * widthUnitSet + 'px';
				blockElm.style.top = deleteObj.colNum * heightUnitSet + 'px';
				blockElm.id = "blockImage" +  deleteObj.id;
				break;
			case "door":
				doorArray.push(deleteObj);
				repaintRect();
				repaintDoor();
				deleteObj = {};
				break;
			case "rectangle":
				rectArray.push(deleteObj);
				var left = deleteObj.rowNum * widthUnitSet;
				var top = deleteObj.collumNum * heightUnitSet;
				var width = deleteObj.xNum * widthUnitSet;
				var height = deleteObj.yNum * heightUnitSet;
				var color = deleteObj.color;
				addRect(left, top, width, height, changeStyle(color));

				for(var i = 0; i < boxes2.length; i++){
					boxes2[i].draw(ctx);
				}
				deleteObj = {};
				break;
		}
		deleteArray.pop();
	}
}

function repaintRect(){
	var l = boxes2.length;
    for (var j = 0; j < l; j++) {
      boxes2[j].draw(ctx); // we used to call drawshape, but now each box draws itself
	  resetRectArray(boxes2[j], rectArray[j]);
    }
}

function repaintDoor(){
	for(var i = 0; i < doorArray.length; i++){
   		ctx.fillStyle = "#ffffff";
   		ctx.fillRect(doorArray[i].rowNum * widthUnitSet, doorArray[i].colNum * heightUnitSet, doorArray[i].xNum * widthUnitSet, doorArray[i].yNum * heightUnitSet);
   }
}

function resetRectArray(boxes2, rectArray){
	  if(boxes2){
		  var x = boxes2.x;
		  var y = boxes2.y;
		  var w = boxes2.w;
		  var h = boxes2.h;
		  if(w > 0 && h > 0){
			  rectArray.rowNum = parseInt (x / widthUnitSet);
			  rectArray.collumNum = parseInt (y / heightUnitSet);
			  rectArray.xNum = w / widthUnitSet;
			  rectArray.yNum = h / heightUnitSet;
		  }else if(w > 0 && h < 0){
			  rectArray.rowNum = parseInt (x / widthUnitSet);
			  rectArray.collumNum = parseInt ((y - Math.abs(h)) / heightUnitSet);
			  rectArray.xNum = w / widthUnitSet;
			  rectArray.yNum = parseInt (Math.abs(h) / heightUnitSet);
		  }else if(w < 0 && h > 0){
			  rectArray.rowNum = parseInt ((x - Math.abs(w)) / widthUnitSet);
			  rectArray.collumNum = parseInt (y / heightUnitSet);
			  rectArray.xNum = parseInt (Math.abs(w) / widthUnitSet);
			  rectArray.yNum = h / heightUnitSet;
		  }else{
			  rectArray.rowNum = parseInt ((x - Math.abs(w)) / widthUnitSet);
			  rectArray.collumNum = parseInt ((y - Math.abs(h)) / heightUnitSet);
			  rectArray.xNum = parseInt (Math.abs(w) / widthUnitSet);
			  rectArray.yNum = parseInt (Math.abs(h) / heightUnitSet);
		  }
		  rectArray.relColNum = parseInt ((canvasHeight - rectArray.collumNum * heightUnitSet) / heightUnitSet);
      }
}

function drawImageOnCanvas(left, top, widthUnit, heightUnit, shape, color, path){
	var image = new Image();
    var blockObj = {
		rowNum: 0,
		collumNum: 0,
		relColNum: 0,
		shape: "chair",
		color: "Blue",
		path: ""
    };
    
	image.src = path;
	image.onload = function(){
		ctx.drawImage(image, left, top, widthUnit, heightUnit);
	};	
	blockObj.rowNum = parseInt(left / widthUnitSet);
	blockObj.collumNum = parseInt(top / heightUnitSet);
	blockObj.relColNum = parseInt((canvasHeight - heightNum * heightUnitSet) / heightUnitSet);	
	blockObj.shape = shape;
	blockObj.color = color;	
	blockObj.path = path;
	
	return blockObj;
}

function changeClassicRect(rectObj){
	var newColor = changeColor(rectObj.color);
						
	ctx.clearRect(rectObj.rowNum * widthUnitSet, rectObj.colNum * heightUnitSet, rectObj.xNum * widthUnitSet, rectObj.yNum * heightUnitSet);								
	ctx.fillStyle = changeStyle(newColor);
	ctx.fillRect(rectObj.rowNum * widthUnitSet, rectObj.colNum * heightUnitSet, rectObj.xNum * widthUnitSet, rectObj.yNum * heightUnitSet);							
	rectObj.color = newColor;	
}

function changeStyle(color){
	var style = "";
	switch(color){
		case "Red":
			style = "#ff9999";
			break;
		case "Yellow":
			style = "#ffff99";
			break;
		case "Blue":
			style = "#9999ff";
			break;
		case "Green":
			style = "#99ff99";
			break;
		case "Magenta":
			style = "#ff99ff";
			break;
	}
	
	return style;
}

function changeShape(tag){
	var newShape;
		
	switch(tag){
    	case "chair":
    		newShape = "bag";
    		break;
    	case "bag":
    		newShape = "backpack";
    		break;
    	case "backpack":
    		newShape = "basket";
    		break;
    	case "basket":
    		newShape = "chair";
    		break;
    }
    
    return newShape;
}

function changeColor(color){
	var newColor;
	
	switch(color){
    	case "Blue":
    		newColor = "Green";
    		break;
    	case "Green":
    		newColor = "Magenta";
    		break;
    	case "Magenta":
    		newColor = "Red";
    		break;
    	case "Red":
    		newColor = "Yellow";
    		break;
    	case "Yellow":
    		newColor = "Blue";
    		break;
    }
    
    return newColor;
}

function getPath(shape, color){
	var path = "images/robotImages/" + shape +"/" + shape + color + ".png";
	return path;
}