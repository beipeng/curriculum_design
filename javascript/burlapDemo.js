var ws;
var userID = sessionStorage.getItem("userID");
var isCommandGiven = false;
var isRecall = false;
var testNum = 0;
var taskOrder = 0;
var speed = 1000;	// 500: fast/few,   1000: fast/many or slow/few,   2000:slow/many

var canvas0 = document.getElementById("canvas0");
var canvasLeft = parseInt(canvas0.style.left);
var canvasHeight = parseInt(canvas0.style.height);
var selectOrder = JSON.parse(sessionStorage.getItem("select_order_list"));
var commandOrder = JSON.parse(sessionStorage.getItem("command_index_list"));
var glbImgIdx = 0;

var finalFeeScore = 0;
var curFeeScore = 0;
var finalStepScore = 0;
var curStepScore = 0;


$( document ).ready(
	function(){
		console.log( "document loaded" );
		if(sessionStorage.getItem("train_gui")){

			ws = new WebSocket("ws://robosadie.cs.brown.edu:80/");
			ws.onopen = function() {
				console.log("Opened socket!");
				exCommand();
			};

			ws.onmessage = function (evt) {
				console.log("receive message!");
				console.log("Message: " + evt.data);
				receiveMessage(evt.data);
			};

			ws.onclose = function() {
				console.log("Closed socket!");
			};

			ws.onerror = function(err) {
				console.log("Error: " + err);
			};

			selectOrder = JSON.parse(sessionStorage.getItem("select_order_list"));
			commandOrder = JSON.parse(sessionStorage.getItem("command_index_list"));
			drawRoomLayout(selectOrder[glbImgIdx]);
			showCommand(selectOrder[glbImgIdx], commandOrder[glbImgIdx]);
			showCurOrder(glbImgIdx);
			sessionStorage.setItem("redesign_gui", true);
		}

		if(sessionStorage.getItem("redesign_gui")){
			drawPreCur();
		}
});

function receiveMessage(msg){
	var obj = JSON.parse(msg);
	var stateLen = obj.state.length;

	// reward or punish the dog based on the feedback value
	var feedback = obj.feedback;
	if(feedback == 1.0){
		// reward the dog
		
		moveDog(obj, stateLen);
		moveBlock(obj, stateLen);

		//show reward after .25 duration
		window.setTimeout(function () {
			document.getElementById("showFeedback").style.background = "#00e600";
			document.getElementById("showFeedback").style.display = "block";
		}, speed/4);

		window.setTimeout(function () {
			document.getElementById("showFeedback").style.background = "#dddddd";
			document.getElementById("showFeedback").style.display = "none";
		}, 3*speed/4);
	}else if(feedback == -1.0){
		// punish the dog
		moveDog(obj, stateLen);
		moveBlock(obj, stateLen);

		window.setTimeout(function () {
			document.getElementById("showFeedback").style.background = "#ff3333";
			document.getElementById("showFeedback").style.display = "block";
		}, speed/4);

		window.setTimeout(function () {
			document.getElementById("showFeedback").style.background = "#dddddd";
			document.getElementById("showFeedback").style.display = "none";
		}, 3*speed/4);
	}else{
		moveDog(obj, stateLen);
		moveBlock(obj, stateLen);
	}

	// check if the dog needs to move to the next assignment
	var isTerminated = obj.terminated;
	if(isTerminated){
		window.setTimeout(function(){
			glbImgIdx++;
			if(glbImgIdx < selectOrder.length){
				drawRoomLayout(selectOrder[glbImgIdx]);
				showCommand(selectOrder[glbImgIdx], commandOrder[glbImgIdx]);
				exCommand();
				showCurOrder(glbImgIdx);
			}else if(glbImgIdx == selectOrder.length){
				curFeeScore += obj.score;
				curStepScore += obj.score2;
				drawRoomLayout(17);
				showCommand(17, 0);
				exCommand();
				showCurOrder(-1);
			}else{
				finalFeeScore = obj.score;
				finalStepScore = obj.score2;
				document.getElementById("redesignDiv").style.display = "block";
				if(sessionStorage.getItem("is_redesign"))
					document.getElementById("submitDiv").style.display = "block";
				else
					document.getElementById("submitDiv").style.display = "none";
			}
			
		}, speed*2);
	}
}

function moveDog(obj, stateLen){
	var action = obj.action;
	var robotX = obj.state[stateLen - 1].x;
	var robotY = obj.state[stateLen - 1].y;
	if(action != "noop"){
		switch(action){
			case "south":
				action = "South";
				break;
			case "west":
				action = "West";
				break;
			case "east":
				action = "East";
				break;
			case "north":
				action = "North";
				break;
			case "pull":
				action = "South";
				break;
		}
	}else{
		action = "Sit2";
	}
	var path = "images/robotImages/robot" + action + ".png";
	var robotObj = document.getElementById("robotImage");
	robotObj.src = path;
	robotObj.style.width = widthUnitSet + 'px';
	robotObj.style.height = heightUnitSet + 'px';
	robotObj.style.left = canvasLeft + robotX * widthUnitSet + 'px';
	robotObj.style.top = (canvasHeight - (robotY + 1) * heightUnitSet) + 'px';
	classicRobot.rowNum = robotX;
	classicRobot.relColNum = robotY + 1;
	classicRobot.colNum = parseInt((canvasHeight - classicRobot.relColNum * heightUnitSet) / heightUnitSet);

}

function moveBlock(obj, stateLen){
	var index = 0;
	for(var i = 0; i < stateLen; i++){
		if(obj.state[i].class == "block"){
			var blockX = obj.state[i].x;
			var blockY = obj.state[i].y;
			var name;
			var block;
			name = "blockImage" + blockArray[index].id;
			if(document.getElementById(name)){
				block = document.getElementById(name);
				block.style.left = canvasLeft + blockX * widthUnitSet + 'px';
				block.style.top = (canvasHeight - (blockY + 1) * heightUnitSet) + 'px';
				blockArray[index].rowNum = blockX;
				blockArray[index].relColNum = blockY + 1;
				blockArray[index].colNum = parseInt((canvasHeight - blockArray[index].relColNum * heightUnitSet) / heightUnitSet);
			}
			index ++;
		}
	}
}

function exCommand(){
	// set the message needed to send to the server
	if(document.getElementById("commandText"))
		var command = document.getElementById("commandText").innerHTML;

	// set the rooms' state
	var roomState = new Array();
	var roomIndex = 0;
	for(var i = 0; i < rectArray.length; i++){
		var rectObj = {};
		rectObj.color = getColorNum(rectArray[i].color);
		rectObj.name = "room" + roomIndex;
		rectObj.bottom = rectArray[i].relColNum - rectArray[i].yNum;
		rectObj.class = "room";
		rectObj.left = rectArray[i].rowNum;
		rectObj.right = rectArray[i].rowNum + rectArray[i].xNum - 1;
		rectObj.top = rectArray[i].relColNum - 1;
		roomState.push(rectObj);
		roomIndex++;
	}

	// set the doors' state
	var doorState = new Array();
	var doorIndex = 0;
	for(var i = 0; i < doorArray.length; i++){
		var doorObj = {};
		doorObj.name = "door" + doorIndex;
		doorObj.bottom = doorArray[i].colNum - doorArray[i].yNum;
		doorObj.class = "door";
		doorObj.left = doorArray[i].rowNum;
		doorObj.right = doorArray[i].rowNum + doorArray[i].xNum - 1;
		doorObj.top = doorArray[i].colNum - 1;
		doorState.push(doorObj);
		doorIndex++;
	}

	// set the blocks' state
	var blockState = new Array();
	var blockIndex = 0;
	if(!classicBlock.isDelete){
		var classicBlockObj = {};
		classicBlockObj.color = getColorNum(classicBlock.color);
		classicBlockObj.name = "block0";
		classicBlockObj.class = "block";
		classicBlockObj.shape = getShapeNum(classicBlock.shape);
		classicBlockObj.y = classicBlock.colNum - 1;
		classicBlockObj.x = classicBlock.rowNum;
		blockState.push(classicBlockObj);
		blockIndex++;
	}
	for(var i = 0; i < blockArray.length; i++){
		var blockObj = {};
		blockObj.color = getColorNum(blockArray[i].color);
		blockObj.name = "block" + blockIndex;
		blockObj.class = "block";
		blockObj.shape = getShapeNum(blockArray[i].shape);
		blockObj.y = blockArray[i].colNum - 1;
		blockObj.x = blockArray[i].rowNum;
		blockState.push(blockObj);
		blockIndex++;
	}

	// set the dog's state
	var robotState = {};
	robotState.direction = 1;
	robotState.name = "agent0";
	robotState.class = "agent";
	robotState.y = classicRobot.relColNum - 1;
	robotState.x = classicRobot.rowNum;

	// new field goal
	var goal = getGoalText(command, roomState, blockState);

	// send message
	var commandText = '"command":' + '"'+command+'"';
	var roomText = JSON.stringify(roomState);
	var doorText = JSON.stringify(doorState);
	var blockText = JSON.stringify(blockState);
	var robotText = JSON.stringify(robotState);
	var goalText = JSON.stringify(goal);
	roomText = roomText.slice(1, -1);
	doorText = doorText.slice(1, -1);
	blockText = blockText.slice(1, -1);
	if(roomText == ""){
		//console.log("no room");
	}else{
		roomText = roomText + ',';
	}
	if(doorText == ""){
		//console.log("no door");
	}else{
		doorText = doorText + ',';
	}
	if(blockText == ""){
		//console.log("no block");
	}else{
		blockText = blockText + ',';
	}

	var msg = '{"msgType":"giveCommand_msg",' + commandText + ',"state":[' + roomText
		+ doorText  + blockText  + robotText + '], "delay": ' + speed + ', "goal": ' + goalText + '}';
		
	ws.send(msg);
}

function getGoalText(command, roomState, blockState){
	var roomColor = -1;
	var blockShape = -1;
	var roomName = "";
	var blockName = "";
	var goal = "";

	if(command.indexOf("blue") > -1){
		roomColor = 0;
	}else if(command.indexOf("green") > -1){
		roomColor = 1;
	}else if(command.indexOf("purple") > -1){
		roomColor = 2;
	}else if(command.indexOf("red") > -1){
		roomColor = 3;
	}else if(command.indexOf("yellow") > -1){
		roomColor = 4;
	}
	for(var i = 0; i < roomState.length; i++){
		if(roomState[i].color == roomColor){
			roomName = roomState[i].name;
			break;
		}
	}

	if(command.indexOf("chair") > -1){
		blockShape = 0;
	}else if(command.indexOf("bag") > -1){
		blockShape = 1;
	}else if(command.indexOf("backpack") > -1){
		blockShape = 2;
	}else if(command.indexOf("basket") > -1){
		blockShape = 3;
	}
	for(var i = 0; i < blockState.length; i++){
		if(blockState[i].shape == blockShape){
			blockName = blockState[i].name;
			break;
		}
	}

	if (blockShape > -1){
		goal = "blockInRoom " + blockName + " " + roomName;
	}else{
		goal = "agentInRoom agent0 " + roomName;
	}

	return goal;
}

function drawRoomLayout(imgId){
	clearWorld();

	var allParams = setObjParam(imgId);

	// draw robot
	classicRobot = new robot(allParams.robot[0], allParams.robot[1]);
	drawRobot(widthUnit, heightUnit);

	// draw rooms
	for(var i = 0; i < allParams.room.length; i++){
		var roomObj = new room(allParams.room[i][0], allParams.room[i][1], allParams.room[i][2], allParams.room[i][3], allParams.room[i][4]);
		rectArray.push(roomObj);
		addRect(roomObj.rowNum * widthUnitSet, roomObj.collumNum * heightUnitSet, roomObj.xNum * widthUnitSet, roomObj.yNum * heightUnitSet, changeStyle(roomObj.color));
	}
	for(var j = 0; j < boxes2.length; j++){
		boxes2[j].draw(ctx);
	}

	// draw objects
	var blockIndex = 0;
	for(var k = 0; k < allParams.block.length; k++){
		var blockObj = new block(allParams.block[k][0], allParams.block[k][1], allParams.block[k][2], allParams.block[k][3]);
		$('<img id="blockImage" src="images/robotImages/chair/chairRed.png" ></img>').insertAfter($("#canvas"));
		var blockElm = document.getElementById("blockImage");
		blockElm.src = getPath(blockObj.shape, blockObj.color);
		$("#blockImage").addClass("chair");
		blockIndex = blockIndex + 1;
		blockElm.style.width = widthUnitSet + 'px';
		blockElm.style.height = heightUnitSet + 'px';
		blockElm.style.left = canvasLeft + allParams.block[k][0] * widthUnitSet + 'px';
		blockElm.style.top = (15 - allParams.block[k][1] + 1) * heightUnitSet + 'px';
		blockElm.id = "blockImage" +  blockIndex;
		blockObj.id = blockIndex;
		blockArray.push(blockObj);
	}

	// draw doors
	for(var m = 0; m < allParams.door.length; m++){
		var doorObj = new door(allParams.door[m][0], allParams.door[m][1], allParams.door[m][2], allParams.door[m][3]);
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(doorObj.rowNum * widthUnitSet, doorObj.relColNum * heightUnitSet, doorObj.xNum * widthUnitSet, doorObj.yNum * heightUnitSet);
		doorArray.push(doorObj);
	}
}

function showCommand(imgId, comId){
	var commands = getCommands(imgId);
	var command = commands[comId];
	if(document.getElementById("commandDiv")){
		document.getElementById("commandText").innerHTML = command;
		document.getElementById("commandDiv").style.display = "block";
	}
}

function showCurOrder(id){
	if(id >= 0){
		id = id + 1;
		if(document.getElementById("curOrderDiv")){
			document.getElementById("curOrderText").innerHTML = "Curriculum Assignment #" + id;
			document.getElementById("curOrderDiv").style.display = "block";
		}
	}else{
		if(document.getElementById("curOrderDiv")){
			document.getElementById("curOrderText").innerHTML = "Target Assignment";
			document.getElementById("curOrderDiv").style.display = "block";
		}
	}
}

function robot(left, top){
	this.rowNum = left;
	this.colNum = parseInt((canvasHeight - heightUnitSet * top) / heightUnit);
	this.relColNum = top;
	this.iniRowNum = left;
	this.iniColNum = parseInt((canvasHeight - heightUnitSet * top) / heightUnit);
	this.iniRelColNum = top;
	this.isDelete = false;

}

function room(left, top, width, height, color){
	this.rowNum = left;
	this.collumNum = parseInt((canvasHeight - top * heightUnitSet) / heightUnitSet);
	this.relColNum = top;
	this.xNum = width;
	this.yNum =height;
	this.red = true;
	this.color = color;
}

function block(left, top, shape, color){
	this.rowNum = left;
	this.colNum = top;
	this.relColNum = parseInt((canvasHeight - top * heightUnitSet) / heightUnitSet);
	this.iniRowNum = left;
	this.iniColNum = top;
	this.iniRelColNum = parseInt((canvasHeight - top * heightUnitSet) / heightUnitSet);
	this.shape = shape;
	this.color = color;
	this.isDelete = false;
}

function door(left, top, width, height){
	this.rowNum = left;
	this.colNum = top;
	this.relColNum = parseInt((canvasHeight - top * heightUnitSet) / heightUnitSet);
	this.xNum = width;
	this.yNum = height;
}

function setObjParam(imgId){
	var robotParam = [];
	var roomParam = [];
	var blockParam = [];
	var doorParam = [];

	switch(imgId){
		case 1:
			robotParam = [3, 7];
			roomParam = [[0, 12, 7, 12, "Red"],[6, 12, 7, 12, "Yellow"]];
			blockParam = [];
			doorParam = [[6, 8, 1, 3]];
			break;
		case 2:
			robotParam = [6, 10];
			roomParam = [[0, 7, 7, 7, "Yellow"], [6, 7, 7, 7, "Magenta"], [0, 12, 13, 6, "Green"]];
			blockParam = [];
			doorParam = [[3, 7, 1, 1], [9, 7, 1, 1]];
			break;
		case 3:
			robotParam = [10, 7];
			roomParam = [[0, 7, 5, 7, "Green"],[4, 7, 5, 7, "Yellow"], [0, 12, 9, 6, "Red"], [8, 12, 5, 12, "Blue"]];
			blockParam = [];
			doorParam = [[2, 7, 1, 1], [6, 7, 1, 1], [8, 10, 1, 2]];
			break;
		case 4:
			robotParam = [2, 4];
			roomParam = [[0, 7, 5, 7, "Red"],[4, 7, 5, 7, "Green"], [0, 12, 9, 6, "Magenta"], [8, 7, 5, 7, "Blue"], [8, 12, 5, 6, "Yellow"]];
			blockParam = [];
			doorParam = [[4, 4, 1, 1], [8, 4, 1, 1], [2, 7, 1, 1], [6, 7, 1, 1], [10, 7, 1, 1], [8, 10, 1, 2]];
			break;
		case 5:
			robotParam = [9, 7];
			roomParam = [[0, 12, 7, 12, "Red"],[6, 12, 7, 12, "Blue"]];
			blockParam = [[8, 4, "bag", "Red"]];
			doorParam = [[6, 8, 1, 3]];
			break;
		case 6:
			robotParam = [2, 7];
			roomParam = [[0, 12, 5, 12, "Blue"],[4, 12, 5, 12, "Red"], [8, 12, 5, 12, "Yellow"]];
			blockParam = [[6, 5, "backpack", "Red"]];
			doorParam = [[4, 8, 1, 3], [8, 8, 1, 3]];
			break;
		case 7:
			robotParam = [9, 10];
			roomParam = [[0, 12, 7, 6, "Red"],[6, 12, 7, 6, "Blue"],[0, 7, 7, 7, "Yellow"],[6, 7, 7, 7, "Magenta"]];
			blockParam = [[11, 11, "basket", "Red"]];
			doorParam = [[3, 7, 1, 1],[9, 7, 1, 1], [6, 10, 1, 2]];
			break;
		case 8:
			robotParam = [6, 2];
			roomParam = [[0, 4, 13, 4, "Blue"],[0, 8, 7, 5, "Magenta"],[6, 8, 7, 5, "Green"], [0, 12, 7, 5, "Yellow"], [6, 12, 7, 5, "Red"]];
			blockParam = [[6, 3, "chair", "Red"]];
			doorParam = [[3, 4, 1, 1],[9, 4, 1, 1],[3, 8, 1, 1], [9, 8, 1, 1]];
			break;
		case 9:
			robotParam = [6, 3];
			roomParam = [[0, 12, 13, 7, "Magenta"],[0, 6, 13, 6, "Yellow"]];
			blockParam = [[4, 4, "chair", "Red"], [9, 5, "bag", "Red"]];
			doorParam = [[5, 6, 3, 1]];
			break;
		case 10:
			robotParam = [9, 4];
			roomParam = [[0, 12, 6, 12, "Blue"],[6, 12, 7, 6, "Yellow"], [6, 7, 7, 7, "Red"]];
			blockParam = [[2, 6, "bag", "Red"], [7, 3, "backpack", "Red"]];
			doorParam = [[5, 4, 2, 1], [5, 9, 2, 1]];
			break;
		case 11:
			robotParam = [6, 9];
			roomParam = [[0, 12, 5, 7, "Yellow"],[4, 12, 5, 7, "Blue"], [8, 12, 5, 7, "Green"], [0, 6, 13, 6, "Magenta"]];
			blockParam = [[3, 3, "chair", "Red"], [8, 3, "bag", "Red"]];
			doorParam = [[2, 6, 1, 1], [6, 6, 1, 1], [10, 6, 1, 1]];
			break;
		case 12:
			robotParam = [6, 7];
			roomParam = [[0, 12, 13, 4, "Green"],[0, 9, 5, 5, "Red"], [4, 9, 5, 5, "Blue"], [8, 9, 5, 5, "Magenta"], [0, 5, 13, 5, "Yellow"]];
			blockParam = [[3, 11, "bag", "Red"], [9, 11, "backpack", "Red"]];
			doorParam = [[2, 5, 1, 1], [10, 5, 1, 1], [2, 9, 1, 1], [6, 9, 1, 1], [10, 9, 1, 1]];
			break;
		case 13:
			robotParam = [6, 9];
			roomParam = [[0, 12, 13, 7, "Magenta"],[0, 6, 13, 6, "Green"]];
			blockParam = [[3, 8, "backpack", "Red"], [9, 7, "chair", "Red"], [8, 11, "bag", "Red"]];
			doorParam = [[5, 6, 3, 1]];
			break;
		case 14:
			robotParam = [2, 3];
			roomParam = [[0, 12, 6, 6, "Yellow"],[0, 6, 6, 6, "Magenta"], [6, 12, 7, 12, "Green"]];
			blockParam = [[3, 4, "bag", "Red"], [9, 4, "chair", "Red"], [8, 10, "backpack", "Red"]];
			doorParam = [[5, 4, 2, 2], [5, 10, 2, 2]];
			break;
		case 15:
			robotParam = [8, 10];
			roomParam = [[0, 12, 6, 12, "Green"],[5, 12, 8, 5, "Red"], [5, 8, 8, 5, "Yellow"], [5, 4, 8, 4, "Blue"]];
			blockParam = [[3, 3, "bag", "Red"], [2, 8, "backpack", "Red"], [9, 9, "basket", "Red"]];
			doorParam = [[5, 3, 1, 2], [5, 6, 1, 1], [5, 10, 1, 1]];
			break;
		case 16:
			robotParam = [3, 3];
			roomParam = [[0, 12, 7, 5, "Red"], [0, 8, 7, 4, "Green"], [0, 5, 7, 5, "Magenta"], [6, 12, 7, 6, "Yellow"], [6, 6, 7, 6, "Blue"]];
			blockParam = [[2, 10, "chair", "Red"], [11, 4, "bag", "Red"], [3, 4, "backpack", "Red"]];
			doorParam = [[3, 5, 1, 1], [3, 8, 1, 1], [6, 3, 1, 1], [6, 10, 1, 1], [9, 7, 1, 2]];
			break;
		case 17:
			robotParam = [8, 3];
			roomParam = [[0, 12, 9, 5, "Red"],[8, 12, 5, 8, "Magenta"], [0, 8, 5, 8, "Green"], [4, 5, 9, 5, "Blue"], [4, 8, 5, 4, "Yellow"]];
			blockParam = [[2, 5, "chair", "Red"], [4, 9, "bag", "Red"], [10, 8, "backpack", "Red"]];
			doorParam = [[4, 3, 1, 1], [10, 5, 1, 1], [2, 8, 1, 1], [6, 8, 1, 1], [8, 10, 1, 1]];
			break;		
	}

	return {
		robot: robotParam,
		room: roomParam,
		block: blockParam,
		door: doorParam
	}
}

function drawPreCur(){
	var imgId;
	var commands;
	var commandIdx;
	var command;

	if(sessionStorage.getItem("select_order_list")){
		selectOrder = JSON.parse(sessionStorage.getItem("select_order_list"));
		commandOrder = JSON.parse(sessionStorage.getItem("command_index_list"));
	}
	for(var idx = 0; idx < selectOrder.length; idx++){
		imgId = selectOrder[idx];
		commands = getCommands(imgId);
		commandIdx = commandOrder[idx];
		command = commands[commandIdx];
		addRoomLayout(imgId, command);
	}

	var selectedImgLen = selectOrder.length;
	if (selectedImgLen >= 4) {
		// enable the submit button
		var finishBtn = document.getElementById("finishBtn");
		finishBtn.className = "button pink serif round glass";
	}
	var buttonVal = selectedImgLen + 1;
	if(document.getElementById("selectBtn")){
		document.getElementById("selectBtn").innerHTML = "Add Assignment " + buttonVal;
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
			command = ["Select command from here", "Move to the blue room", "Move to the yellow room", "Move the backpack to the blue room", "Move the backpack to the yellow room", "Move the bag to the red room", "Move the bag to the yellow room"];
			break;
		case 11:
			command = ["Select command from here", "Move to the yellow room", "Move to the green room", "Move to the purple room", "Move the chair to the yellow room", "Move the chair to the blue room", "Move the chair to the green room", "Move the bag to the yellow room", "Move the bag to the blue room", "Move the bag to the green room"];
			break;
		case 12:
			command = ["Select command from here", "Move to the green room", "Move to the red room", "Move to the purple room", "Move to the yellow room", "Move the bag to the red room", "Move the bag to the blue room", "Move the bag to the purple room", "Move the bag to the yellow room", "Move the backpack to the red room", "Move the backpack to the blue room", "Move the backpack to the purple room", "Move the backpack to the yellow room"];
			break;
		case 13:
			command = ["Select command from here", "Move to the green room", "Move the chair to the green room", "Move the bag to the green room", "Move the backpack to the green room"];
			break;
		case 14:
			command = ["Select command from here", "Move to the green room", "Move to the yellow room", "Move the bag to the green room", "Move the bag to the yellow room", "Move the chair to the yellow room", "Move the chair to the purple room", "Move the backpack to the yellow room", "Move the backpack to the purple room"];
			break;
		case 15:
			command = ["Select command from here", "Move to the green room", "Move to the yellow room", "Move to the blue room", "Move the basket to the green room", "Move the basket to the yellow room", "Move the basket to the blue room", "Move the backpack to the yellow room", "Move the backpack to the blue room", "Move the backpack to the red room", "Move the bag to the yellow room", "Move the bag to the blue room", "Move the bag to the red room"];
			break;
		case 16:
			command = ["Select command from here", "Move to the green room", "Move to the purple room", "Move to the red room", "Move to the yellow room", "Move the chair to the red room", "Move the chair to the purple room", "Move the chair to the yellow room", "Move the chair to the blue room", "Move the bag to the yellow room", "Move the bag to the purple room", "Move the bag to the green room", "Move the bag to the blue room", "Move the backpack to the red room", "Move the backpack to the yellow room", "Move the backpack to the blue room", "Move the backpack to the green room"];
			break;
		case 17:
			command = ["Move the bag to the yellow room"];
			break;
	}
	return command;
}

function keyGiveCommand(e){
	if (e.keyCode == 67 || e.keyCode == 99){	// press 'c', give command to the dog
		exCommand();	
	}else if (e.keyCode == 82 || e.keyCode == 114){		// press 'r', give reward to the dog
		reward();
	}else if (e.keyCode == 80 || e.keyCode == 112){		// press 'p', give punishment to the dog
		punish();
	}else if (e.keyCode == 32){		// press 'space', recall the training with learning
		terminateWithLearn(e);
	}
}

function reward(){
	//show the green flashed circle
	var circleElm = document.getElementById("circle");
	circleElm.style.display = "block";
	circleElm.style.background = "#00ff00";
	window.setTimeout(function(){
		circleElm.style.display = "none";
	}, 1000);

	msg = '{"msgType":"feedback_msg","feedback":1.0}';
	ws.send(msg);
}

function keyReward(e){
	// press 'R', reward the agent
	if (e.keyCode == 82 || e.keyCode == 114){
		reward();	
	}
}

function punish(){
	//show the red flashed circle
	var circleElm = document.getElementById("circle");
	circleElm.style.display = "block";
	circleElm.style.background = "#ff0000";
	window.setTimeout(function(){
			circleElm.style.display = "none";
	}, 1000);

	msg = '{"msgType":"feedback_msg","feedback":-1.0}';
	ws.send(msg);
}

function keyPunish(e){
	// press 'P', punish the agent
	if (e.keyCode == 80 || e.keyCode == 112){
		punish();
	}
}

//"Restart" Button: send finish without learning message to the server
function terminate(e){
	e.preventDefault();
	
	document.getElementById("giveCommand").addEventListener("click", exCommand, false);
	window.addEventListener("keydown", keyGiveCommand, false);
	document.getElementById("reward").removeEventListener("click", reward, false);
	document.getElementById("punish").removeEventListener("click", punish, false);
	window.removeEventListener("keydown", keyReward, false);
	window.removeEventListener("keydown", keyPunish, false);

	designGUIState();
	// move robot to the position before training
	if(!classicRobot.isDelete){
		var robotObj = document.getElementById("robotImage");
		robotObj.src = "images/robotImages/robotSouth.png";	
		robotObj.style.left = canvasLeft + classicRobot.iniRowNum * widthUnitSet + 'px';
		robotObj.style.top = classicRobot.iniColNum * heightUnitSet + 'px';
		classicRobot.rowNum = classicRobot.iniRowNum;
		classicRobot.colNum = classicRobot.iniColNum;
		classicRobot.relColNum = parseInt((canvasHeight - classicRobot.colNum * heightUnitSet) / heightUnitSet);	
	}
	// move classic block to the position before training
	if(!classicBlock.isDelete){
		// move basket to the position before training 
		var blockObj = document.getElementById("basketImage");
		classicBlock.rowNum = 2;
		classicBlock.colNum = 15;
		classicBlock.relColNum = parseInt((canvasHeight - classicBlock.colNum * heightUnitSet) / heightUnitSet);	
		blockObj.style.left = canvasLeft + classicBlock.rowNum * widthUnitSet + 'px';
		blockObj.style.top = classicBlock.colNum * heightUnitSet + 'px';
	}
	// move user's block to the position before training
	var index = 1;
	for(i = 0; i < blockArray.length; i++){
		var name = "blockImage" + index;
		var blockObj = document.getElementById(name);
		blockArray[i].rowNum = blockArray[i].iniRowNum;
		blockArray[i].colNum = blockArray[i].iniColNum;
		blockArray[i].relColNum = blockArray[i].iniRelColNum;
		blockObj.style.left = canvasLeft + blockArray[i].iniRowNum * widthUnitSet + 'px';
		blockObj.style.top = blockArray[i].iniColNum * heightUnitSet + 'px';
		index ++;
	}

	// set the signal sent to the server
	msg = '{"msgType":"terminateWithoutLearning_msg"}';
	ws.send(msg);	
	
	isRecall = true;
}

function terminateWithLearn(e){
	e.preventDefault();

	designGUIState();
	// move robot to the position before training
	if(!classicRobot.isDelete){
		var robotObj = document.getElementById("robotImage");
		robotObj.src = "images/robotImages/robotSouth.png";	
		robotObj.style.left = canvasLeft + classicRobot.iniRowNum * widthUnitSet + 'px';
		robotObj.style.top = classicRobot.iniColNum * heightUnitSet + 'px';
		classicRobot.rowNum = classicRobot.iniRowNum;
		classicRobot.colNum = classicRobot.iniColNum;
		classicRobot.relColNum = parseInt((canvasHeight - classicRobot.colNum * heightUnitSet) / heightUnitSet);	
	}
	// move classic block to the position before training
	if(!classicBlock.isDelete){
		// move basket to the position before training 
		var blockObj = document.getElementById("basketImage");
		classicBlock.rowNum = 2;
		classicBlock.colNum = 15;
		classicBlock.relColNum = parseInt((canvasHeight - classicBlock.colNum * heightUnitSet) / heightUnitSet);	
		blockObj.style.left = canvasLeft + classicBlock.rowNum * widthUnitSet + 'px';
		blockObj.style.top = classicBlock.colNum * heightUnitSet + 'px';
	}
	// move user's block to the position before training
	var index = 1;
	for(i = 0; i < blockArray.length; i++){
		var name = "blockImage" + index;
		var blockObj = document.getElementById(name);
		blockArray[i].rowNum = blockArray[i].iniRowNum;
		blockArray[i].colNum = blockArray[i].iniColNum;
		blockArray[i].relColNum = blockArray[i].iniRelColNum;
		blockObj.style.left = canvasLeft + blockArray[i].iniRowNum * widthUnitSet + 'px';
		blockObj.style.top = blockArray[i].iniRelColNum * heightUnitSet + 'px';
		index ++;
	}

	// set the signal sent to the server
	msg = '{"msgType":"terminateAndLearn_msg"}';
	ws.send(msg);

	isRecall = true;
}

function keyRecall(e){
	// press 'space', recall the training
	if (e.keyCode == 32){
		terminate(e);	
	}
}

function terminateUp(e){
	e.preventDefault();
	// move robot to the position before training
	if(!classicRobot.isDelete){
		var robotObj = document.getElementById("robotImage");
		robotObj.src = "images/robotImages/robotSouth.png";
		robotObj.style.left = canvasLeft + classicRobot.iniRowNum * widthUnitSet + 'px';
		robotObj.style.top = classicRobot.iniColNum * heightUnitSet + 'px';
		classicRobot.rowNum = classicRobot.iniRowNum;
		classicRobot.colNum = classicRobot.iniColNum;
		classicRobot.relColNum = parseInt((canvasHeight - classicRobot.colNum * heightUnitSet) / heightUnitSet);	
	}
	// move classic block to the position before training
	if(!classicBlock.isDelete){
		var blockObj = document.getElementById("basketImage");
		classicBlock.rowNum = 2;
		classicBlock.colNum = 15;
		classicBlock.relColNum = parseInt((canvasHeight - classicBlock.colNum * heightUnitSet) / heightUnitSet);	
		blockObj.style.left = canvasLeft + classicBlock.rowNum * widthUnitSet + 'px';
		blockObj.style.top = classicBlock.colNum * heightUnitSet + 'px';
	}
	// move user's block to the position before training
	var index = 1;
	for(i = 0; i < blockArray.length; i++){
		var name = "blockImage" + index;
		var blockObj = document.getElementById(name);
		blockArray[i].rowNum = blockArray[i].iniRowNum;
		blockArray[i].colNum = blockArray[i].iniColNum;
		blockArray[i].relColNum = blockArray[i].iniRelColNum;
		blockObj.style.left = canvasLeft + blockArray[i].iniRowNum * widthUnitSet + 'px';
		blockObj.style.top = blockArray[i].iniColNum * heightUnitSet + 'px';
		index ++;
	}
}

function keyRecallUp(e){
	e.preventDefault();
	
	if (e.keyCode == 32){
		// move robot to the position before training
		if(!classicRobot.isDelete){
			var robotObj = document.getElementById("robotImage");
			robotObj.src = "images/robotImages/robotSouth.png";
			robotObj.style.left = canvasLeft + classicRobot.iniRowNum * widthUnitSet + 'px';
			robotObj.style.top = classicRobot.iniColNum * heightUnitSet + 'px';
			classicRobot.rowNum = classicRobot.iniRowNum;
			classicRobot.colNum = classicRobot.iniColNum;
			classicRobot.relColNum = parseInt((canvasHeight - classicRobot.colNum * heightUnitSet) / heightUnitSet);	
		}	
		// move classic block to the position before training
		if(!classicBlock.isDelete){
			var blockObj = document.getElementById("basketImage");
			classicBlock.rowNum = 2;
			classicBlock.colNum = 15;
			blockObj.style.left = canvasLeft + classicBlock.rowNum * widthUnitSet + 'px';
			blockObj.style.top = classicBlock.colNum * heightUnitSet + 'px';
		}	
		// move user's block to the position before training
		var index = 1;
		for(i = 0; i < blockArray.length; i++){
			var name = "blockImage" + index;
			var blockObj = document.getElementById(name);
			blockArray[i].rowNum = blockArray[i].iniRowNum;
			blockArray[i].colNum = blockArray[i].iniColNum;
			blockArray[i].relColNum = blockArray[i].iniRelColNum;
			blockObj.style.left = canvasLeft + blockArray[i].iniRowNum * widthUnitSet + 'px';
			blockObj.style.top = blockArray[i].iniColNum * heightUnitSet + 'px';
			index ++;
		}
	}
	
	isRecall = true;
}

// "Continue" Button: send "terminateAndLearn_msg" message to the server
function continueTest(e){
	if(isCommandGiven){
		isCommandGiven = false;
		terminateWithLearn(e);
		
		testNum = testNum + 1;
		sessionStorage.setItem("first_task", true);
		
		// set the signal sent to the server!
		msg = '{"msgType":"terminateAndLearn_msg"}';
		//console.log("Sending: " + msg);
		ws.send(msg);
					
		switch(taskOrder){
			case 1:		//1, 2, 3
				if(testNum == 1){
					drawFirstTest();
					document.getElementById("instruction").innerHTML = testingMessages[1];
				}
				if(testNum == 2 || testNum == 5){
					drawSecondTest();
					document.getElementById("instruction").innerHTML = testingMessages[2];
				}
				if(testNum == 3 || testNum == 6){
					drawThirdTest();
					document.getElementById("instruction").innerHTML = testingMessages[3];
				}	
				break;
			case 2:		//1, 3, 2
				if(testNum == 1){
					drawFirstTest();
					document.getElementById("instruction").innerHTML = testingMessages[1];
				}
				if(testNum == 2 || testNum == 5){
					drawThirdTest();
					document.getElementById("instruction").innerHTML = testingMessages[2];
				}
				if(testNum == 3 || testNum == 6){
					drawSecondTest();
					document.getElementById("instruction").innerHTML = testingMessages[3];
				}	
				break;
			case 3:		//2, 1, 3
				if(testNum == 1){
					drawSecondTest();
					document.getElementById("instruction").innerHTML = testingMessages[1];
				}
				if(testNum == 2 || testNum == 5){
					drawFirstTest();
					document.getElementById("instruction").innerHTML = testingMessages[2];
				}
				if(testNum == 3 || testNum == 6){
					drawThirdTest();
					document.getElementById("instruction").innerHTML = testingMessages[3];
				}	
				break;
			case 4:		//2, 3, 1	
				if(testNum == 1){
					drawSecondTest();
					document.getElementById("instruction").innerHTML = testingMessages[1];
				}
				if(testNum == 2 || testNum == 5){
					drawThirdTest();
					document.getElementById("instruction").innerHTML = testingMessages[2];
				}
				if(testNum == 3 || testNum == 6){
					drawFirstTest();
					document.getElementById("instruction").innerHTML = testingMessages[3];
				}	
				break;
			case 5:		//3, 1, 2
				if(testNum == 1){
					drawThirdTest();
					document.getElementById("instruction").innerHTML = testingMessages[1];
				}
				if(testNum == 2 || testNum == 5){
					drawFirstTest();
					document.getElementById("instruction").innerHTML = testingMessages[2];
				}
				if(testNum == 3 || testNum == 6){
					drawSecondTest();
					document.getElementById("instruction").innerHTML = testingMessages[3];
				}
				break;
			case 6:		//3, 2, 1
				if(testNum == 1){
					drawThirdTest();
					document.getElementById("instruction").innerHTML = testingMessages[1];
				}
				if(testNum == 2 || testNum == 5){
					drawSecondTest();
					document.getElementById("instruction").innerHTML = testingMessages[2];
				}
				if(testNum == 3 || testNum == 6){
					drawFirstTest();
					document.getElementById("instruction").innerHTML = testingMessages[3];
				}
				break;
		}
		
		if(testNum == 3){
			sessionStorage.setItem("new_dog", true);
			sessionStorage.setItem("task_order", taskOrder);
			document.getElementById("continueBtn").style.display = "none";
			document.getElementById("continueBtn").removeEventListener("click", continueTest, false);
			var continueNewDog = document.getElementById("continueNewDog");
			continueNewDog.style.display = "";
			continueNewDog.addEventListener("click", mySubmit, false);
		}
		
		if(testNum==6){
			document.getElementById("instruction").innerHTML = testingMessages[4];
			document.getElementById("continueBtn").style.display = "none";
			document.getElementById("continueBtn").removeEventListener("click", continueTest, false);
			
			//display the Submit Hit button
    		var submitButton = document.getElementById("submitButton");
			submitButton.style.display = "";
			submitButton.disabled = false;
			submitButton.addEventListener("click", loadComment, false);
			
			sessionStorage.setItem("new_dog", false);
			sessionStorage.setItem("task_order", 0);
		}
	}else{
		alert("You have to click 'Give Command' button to train the dog before you can move on!");
	}
}

function mySubmit(){
	if(isCommandGiven){
		msg = '{"msgType":"terminateAndLearn_msg"}';
		ws.send(msg);
		sendUserId();
		document.getElementById("continueForm").submit();
	}else{
		alert("You have to click 'Give Command' button to train the dog before you can move on!");
	}
	
}

function designGUIState(){
	$('#giveCommand').prop('disabled', false);
	$('#reward').prop('disabled', true);
	$('#punish').prop('disabled', true);
	$('#finishNotLearn').prop('disabled', true);
}

function getColor(number){
	var color;
	switch(number){
    	case 0:
    		color = "Blue";
    		break;
    	case 1:
    		color = "Green";
    		break;
    	case 2:
    		color = "Magenta";
    		break;
    	case 3:
    		color = "Red";
    		break;
    	case 4:
    		color = "Yellow";
    		break;
    } 
    return color;
}

function getShape(number){
	var shape;	
	switch(number){
    	case 0:
    		shape = "chair";
    		break;
    	case 1:
    		shape = "bag";
    		break;
    	case 2:
    		shape = "backpack";
    		break;
    	case 3:
    		shape = "basket";
    		break;
    }    
    return shape;
}

function getColorNum(color){
	var num;
	switch(color){
		case "Blue":
			num = 0;
			break;
		case "Green":
			num = 1;
			break;
		case "Magenta":
			num = 2;
			break;
		case "Red":
			num = 3;
			break;
		case "Yellow":
			num = 4;
			break;
	}
	return num;
}

function getShapeNum(shape){
	var num;	
	switch(shape){
    	case "chair":
    		num = 0;
    		break;
    	case "bag":
    		num = 1;
    		break;
    	case "backpack":
    		num = 2;
    		break;
    	case "basket":
    		num = 3;
    		break;
    }
    return num;
}

function sendUserId(){
	var temp_id = userID + '_1';
	var msg_userID = '{"msgType":"end_exp", "log_id": "'+ temp_id +'"}';
	ws.send(msg_userID);
}

function loadComment() {	
	if(isCommandGiven){
		msg = '{"msgType":"terminateAndLearn_msg"}';
		ws.send(msg);
		temp_id = userID + '_2';
		var msg_userID = '{"msgType":"end_exp", "log_id": "'+ temp_id +'"}';
		ws.send(msg_userID);
		document.getElementById("continueForm").submit();
	}else{
		alert("You have to click 'Give Command' button to train the dog before you can submit the task!");
	}
}