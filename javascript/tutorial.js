var instructions = document.getElementById("instruction");
var tutorial;
var next = false;
var signal = "";
var canvasLeft = parseInt(document.getElementById("canvas0").style.left);
var canvasHeight = parseInt(document.getElementById("canvas0").style.height);

var tutorialMessages = [
	'In this study, you will need to design a curriculum (a set of assignments) for a virtual dog to train on so that the dog can quickly learn to complete the final target assignment.<br /><br />Click <a class="continueBtn"> <span> Continue</span> </a>  to continue',
	'In each assignment, the dog will learn to carry out a given command in the simulated home environment. The dog will automatically be given rewards or punishment so that it learns the tasks you assign.<br /><br /> We will walk you through two examples of the dog being trained. You should watch it carefully to understand how the dog learns to complete assignments.<br /><br />Click <a class="continueBtn"> <span> Continue</span> </a>  to continue',
	'Command: move to the room at the right-hand side <br /><br />',
	'Command: move the red object to the room at the right-hand side <br /><br />',
	'We have finished helping you walk through the process of creating a curriculum for the dog. <br /><br /> Before beginning the real task, you should remember that the <span style="color:#D80000;">target assignment</span> the dog has to complete is <span style="color:#D80000;">moving the bag to the yellow room</span> in the room layout shown below.<br /><br /><img src="images/target_assignment.png" alt=" "/><br /><br />You have to design a curriculum for the dog so that it can successfully learn to complete the target assignment.<br /><br />',
	'When you evaluate your curriculum, you can observe the whole process of the dog being trained in each assignment in your curriculum and the target assignment.<br /><br />To get higher payment, you can redesign a better curriculum for the dog (<span style="color:#D80000;">you have to redesign it at least once before submitting the HIT</span>).<br /><br />',
	'Thanks for finishing the tutorial! You will now begin the HIT!'
];

var isClickTerminate = false;

initiate();

function initiate(){
	if(sessionStorage.getItem("task_gui")){
		instructions.innerHTML = "";
		return;
	}else{
		document.getElementById("continueBtn").addEventListener("click", tutorialContinue, false);
		tutorialSetup();
	}
}

function tutorialContinue(){
	signal = "CONTINUE";
	next = true;
	update();
}

function tutorialSetup(){
	document.getElementById("tutorial").style.display = "block";
	instructions.innerHTML = tutorialMessages[0];
	if(signal == "CONTINUE"){
		tutorial = tutorialTwoExp;
		signal == "";
		next = true;
		update();
	}else{
		tutorial = tutorialSetup;
	}
}

function tutorialTwoExp(){
	instructions.innerHTML = tutorialMessages[1];
	tutorial = tutorialGiveCommand;
}

function tutorialGiveCommand(){
	instructions.innerHTML = tutorialMessages[2];
	document.getElementById("continueBtn").style.display = "none";
	document.getElementById("instruction").style.top = "485px";
	document.getElementById("instruction").style.left = "220px";
	document.getElementById("canvasDiv").style.display = "block";
	window.setTimeout(exCommandTutorial, 500);
}

function exCommandTutorial(){
	var robotX = 5;
	var robotY = 7;
	var count = 0;
	var action = "West";
	var training = setInterval( function(){
		if(count == 0 || count == 2){
			robotX -= 1;
			action = "West";
			moveRobotTutorial(robotX, robotY, action);
			count += 1;
		}else if(count == 1){
			robotY -= 1;
			action = "South";
			moveRobotTutorial(robotX, robotY, action);
			count += 1;
		}else if(count == 3) {
			// punish the dog
			document.getElementById("tutorial").style.backgroundColor = "#ff3333";
			document.getElementById("feedbackText").innerHTML = "punish";
			document.getElementById("feedbackText").style.display = "block";
			window.setTimeout(function () {
				document.getElementById("tutorial").style.backgroundColor = "#33cc99";
				document.getElementById("feedbackText").style.display = "none";
			}, 1000);
			count += 1;
		}else if((count > 3 && count < 6) || (count > 6 && count < 11)) {
			robotX += 1;
			action = "East";
			moveRobotTutorial(robotX, robotY, action);
			count += 1;
		}else if(count == 6){
			// reward the dog
			document.getElementById("tutorial").style.backgroundColor = "#00e600";
			document.getElementById("feedbackText").innerHTML = "reward";
			document.getElementById("feedbackText").style.display = "block";
			window.setTimeout(function () {
				document.getElementById("tutorial").style.backgroundColor = "#33cc99";
				document.getElementById("feedbackText").style.display = "none";
			}, 1000);
			count += 1;
		}else if(count == 11){
			// reward the dog
			document.getElementById("tutorial").style.backgroundColor = "#00e600";
			document.getElementById("feedbackText").innerHTML = "reward";
			document.getElementById("feedbackText").style.display = "block";
			window.setTimeout(function () {
				document.getElementById("tutorial").style.backgroundColor = "#33cc99";
				document.getElementById("feedbackText").style.display = "none";
			}, 1000);
			count += 1;
		}else{
			moveRobotTutorial(robotX, robotY, "Sit2")
			clearInterval(training);
			document.getElementById("continueBtn").style.display = "block";
			tutorial =  tutorialGiveNextCommand;
		}
	}, 1000);
}

function tutorialGiveNextCommand(){
	instructions.innerHTML = tutorialMessages[3];
	document.getElementById("continueBtn").style.display = "none";
	document.getElementById("instruction").style.top = "485px";
	document.getElementById("instruction").style.left = "140px";
	document.getElementById("canvasDiv").style.display = "block";
	drawTutorialLayout();
	window.setTimeout(exNextCommandTutorial, 500);
}

function exNextCommandTutorial(){
	var robotX = 5;
	var robotY = 7;
	var blockX = 7;
	var blockY = 9;
	var count = 0;
	var action = "West";
	var training = setInterval( function(){
		if(count == 0 || count == 2 || count == 13 || count == 14 || count == 24 || count == 30 || count == 34){
			robotX -= 1;
			action = "West";
			moveRobotTutorial(robotX, robotY, action);
			count += 1;
		}else if(count == 1 || count == 15 || count == 16 || count == 36){
			robotY -= 1;
			action = "South";
			moveRobotTutorial(robotX, robotY, action);
			count += 1;
		}else if(count == 3 || count == 10 || count == 12 || count == 17 || count == 28) {
			// punish the dog
			document.getElementById("tutorial").style.backgroundColor = "#ff3333";
			document.getElementById("feedbackText").innerHTML = "punish";
			document.getElementById("feedbackText").style.display = "block";
			window.setTimeout(function () {
				document.getElementById("tutorial").style.backgroundColor = "#33cc99";
				document.getElementById("feedbackText").style.display = "none";
			}, 1000);
			count += 1;
		}else if(count > 3 && count < 6 || count > 6 && count < 10 || count == 11) {
			robotX += 1;
			action = "East";
			moveRobotTutorial(robotX, robotY, action);
			count += 1;
		}else if(count > 17 && count < 20 || count > 20 && count < 23 || count == 25 || count == 29){
			robotY += 1;
			action = "North";
			moveRobotTutorial(robotX, robotY, action);
			count += 1;
		}else if(count == 6 || count == 20 || count == 23 || count == 35 || count == 39){
			// reward the dog
			document.getElementById("tutorial").style.backgroundColor = "#00e600";
			document.getElementById("feedbackText").innerHTML = "reward";
			document.getElementById("feedbackText").style.display = "block";
			window.setTimeout(function () {
				document.getElementById("tutorial").style.backgroundColor = "#33cc99";
				document.getElementById("feedbackText").style.display = "none";
			}, 1000);
			count += 1;
		}else if(count == 26){
			robotX += 1;
			action = "East";
			moveRobotTutorial(robotX, robotY, action);

			blockX -= 1;
			moveBlockTutorial(blockX, blockY);
			count += 1;
		}else if(count == 27){
			robotX -= 1;
			action = "West";
			moveRobotTutorial(robotX, robotY, action);

			blockX -= 1;
			moveBlockTutorial(blockX, blockY);
			count += 1;
		}else if(count > 30 && count < 34){
			robotY -= 1;
			action = "South";
			moveRobotTutorial(robotX, robotY, action);

			blockY -= 1;
			moveBlockTutorial(blockX, blockY);
			count += 1;
		}else if(count > 36 && count < 39 || count > 39 && count < 42){
			robotX += 1;
			action = "East";
			moveRobotTutorial(robotX, robotY, action);

			blockX += 1;
			moveBlockTutorial(blockX, blockY);
			count += 1;
		}else if(count == 42){
			// reward the dog
			document.getElementById("tutorial").style.backgroundColor = "#00e600";
			document.getElementById("feedbackText").innerHTML = "reward";
			document.getElementById("feedbackText").style.display = "block";
			window.setTimeout(function () {
				document.getElementById("tutorial").style.backgroundColor = "#33cc99";
				document.getElementById("feedbackText").style.display = "none";
			}, 1000);
			count += 1;
		}else{
			moveRobotTutorial(robotX, robotY, "Sit2")
			clearInterval(training);
			document.getElementById("continueBtn").style.display = "block";
			tutorial = tutorialInterface1;
		}
	}, 1000);

}

function tutorialInterface1(){
	instructions.innerHTML = tutorialMessages[4];
	document.getElementById("instruction").style.left = "0px";
	document.getElementById("instruction").style.top = "5px";
	document.getElementById("tutorial").style.display = "none";
	document.getElementById("canvasDiv").style.display = "none";
	document.getElementById("mainDiv").style.display = "block";
	document.getElementById("selectedTitle").style.display = "block";
	document.getElementById("recordDiv").style.display = "block";
	document.getElementById("goalDiv").style.display = "block";
	document.getElementById("selectDiv").style.display = "block";
	document.getElementById("finishDesignDiv").style.display = "block";
	if(document.getElementById("selectBtn")){
		document.getElementById("selectBtn").addEventListener("click", curriculumDesign, false);
	}
	window.onload = popup('popUpDiv');
	tutorial= tutorialInterface2;
}

function tutorialInterface2(){
	instructions.innerHTML = tutorialMessages[5];
	document.getElementById("instruction").style.left = "0px";
	document.getElementById("instruction").style.top = "150px";
	tutorial= tutorialTask;
}

function keyCommandTutorial(e){
	// press 'c', give command to the dog
	if (e.keyCode == 67 || e.keyCode == 99){
		exCommandTutorial();
	}
}

function punishTutorial(){
	var robotX = 3;
	var robotY = 4;
	var action = "North";
	var count = 0;
	var training = setInterval( function(){
		if(count == 5){
			document.getElementById("instruction").innerHTML = tutorialMessages[3];
			document.getElementById("reward").addEventListener("click", rewardTutorial, false);
			window.addEventListener("keydown",  keyDownReward, false);
			clearInterval(showInstruction);
		}else{
			moveRobotTutorial(7, 9, action);
			robotX -= 1;
			count += 1;
		}
	}, 500);
}

function rewardTutorial(){
	//show the green flashed circle
	document.getElementById("continueBtn").removeEventListener("click", tutorialContinue, false);
	var circleElm = document.getElementById("circle");
	circleElm.style.display = "block";
	circleElm.style.background = "#00ff00";
	window.setTimeout(function(){
		circleElm.style.display = "none";
	}, 1000);

	moveRobotTutorial(6, 3, "East");
	var robotX = 6;
	var robotY = 3;
	var action = "East";

	document.getElementById("instruction").innerHTML = tutorialMessages[4];
	document.getElementById("continueBtn").style.display = "";

	var showInstruction = setInterval( function(){
		if(robotX < 6){
			robotX += 1;
			action = "East";
		}else{
			if(robotY < 6){
				robotY += 1;
				action = "North";
			}
		}

		if(robotX == 6 && robotY == 6){
			window.setTimeout(function(){
				action = "Sit2";
				moveRobotTutorial(robotX, robotY, action);
			}, 500);
			document.getElementById("continueBtn").addEventListener("click", tutorialNext, false);
			clearInterval(showInstruction);
		}
		moveRobotTutorial(robotX, robotY, action);
	}, 500);
	document.getElementById("reward").removeEventListener("click", rewardTutorial, false);
	window.removeEventListener("keydown",  keyDownReward, false);
}

function tutorialNext(){
	document.getElementById("instruction").innerHTML = tutorialMessages[5];
	document.getElementById("continueBtn").style.display = "";
	document.getElementById("finishNotLearn").addEventListener("click", terminateTutorial, false);
	document.getElementById("continueBtn").removeEventListener("click", tutorialContinue, false);
	window.addEventListener("keydown", keyRecallTutorial, false);
	document.getElementById("continueBtn").addEventListener("click", function(){
		console.log("isClickTerminate: " + isClickTerminate);
		if(isClickTerminate){
			tutorialFinishCommand();
		}else{
			alert("Please click 'Restart' button to move on!");
		}
	}, false);
}

function tutorialFinishCommand(){
	document.getElementById("continueBtn").style.display = "";
	document.getElementById("instruction").innerHTML = tutorialMessages[6];
	document.getElementById("continueBtn").addEventListener("click", taskStart, false);
}

function moveRobotTutorial(robotX, robotY, action){
	var path = "images/robotImages/robot" + action + ".png";
	var robotObj = document.getElementById("robotImage");
	robotObj.src = path;
	robotObj.style.left = canvasLeft + robotX * widthUnitSet + 'px';
	robotObj.style.top = (canvasHeight - robotY * heightUnitSet) + 'px';
	classicRobot.rowNum = robotX;
	classicRobot.relColNum = robotY;
	classicRobot.colNum = parseInt((canvasHeight - classicRobot.relColNum * heightUnitSet) / heightUnitSet);
}

function moveBlockTutorial(blockX, blockY){
	var blockElm = document.getElementById("blockImage2");
	blockElm.style.left = canvasLeft + blockX * widthUnitSet + 'px';
	blockElm.style.top = (canvasHeight/heightUnitSet - blockY) * heightUnitSet + 'px';
	blockArray[0].rowNum = blockX;
	blockArray[0].colNum = blockY;
	blockArray[0].relColNum = parseInt((canvasHeight - blockArray[0].colNum * heightUnitSet) / heightUnitSet);
}

function terminateAndLearnTutorial(){
	moveRobotTutorial(4, 3, "South");
	isClickTerminate = true;
}

function terminateTutorial(){
	moveRobotTutorial(4, 3, "South");
	isClickTerminate = true;
}

function keyRecallTutorial(e){
	// press 'space', recall the training
	if (e.keyCode == 32){
		console.log("in keyRecall! ");
		moveRobotTutorial(4, 3, "South");
		isClickTerminate = true;
		console.log("in keyRecall isClickTerminate: " + isClickTerminate);
	}
}

function tutorialTask(){
	instructions.innerHTML = tutorialMessages[6];
	document.getElementById("instruction").style.top = "130px";
	tutorial = taskStart;
}

function taskStart(){
	document.getElementById("continueBtn").style.display = "none";
	sessionStorage.setItem("design_gui", true);
	var url = window.location.href;
	var tempUrl = url.split('#');
	var newUrl = tempUrl[0];
	window.location = newUrl;
}

function update(){
	tutorial();
	next = false;
}

function mouseClicked(e){
	next = true;
	update();
}

//Highlighting
var isHighlight = false;
var htarget = null;
var hstep = 0;
var highlightTemp = 0;

function highlight(target){
	if(htarget != null)
		htarget.style.opacity = highlightTemp;
	hstep = 0;
	htarget = document.getElementById(target);
	highlightTemp = htarget.style.opacity;
	if(!isHighlight)
		setTimeout(highlightUpdate, 100);
	isHighlight = true;
}

function noHighlight(){
	if(htarget != null)
		htarget.style.opacity = highlightTemp;
	isHighlight = false;
	htarget = null;
}

function highlightUpdate(){
	if(isHighlight){
		htarget.style.opacity = 0.4*(Math.sin(hstep) + 1);
		hstep += 0.15;
		setTimeout(highlightUpdate, 100);
	}
}

function keyDownReward(e){
	// press 'R', reward the agent
	if (e.keyCode == 82 || e.keyCode == 114){
		rewardTutorial();
	}
}

function keyDownPunish(e){
	// press 'P', punish the agent
	if (e.keyCode == 80 || e.keyCode == 112){
		punishTutorial();
	}
}