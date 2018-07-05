<?php
include 'include.php';
getSession();
?>

<html>
<head>
    <meta charset="utf-8" />
    <title>Demo</title>
    <link rel="stylesheet" type="text/css" href="css/style.css?v555" />
    <script src="javascript/jquery.js"></script>
    <script src="javascript/gup.js"></script>
    <script src="javascript/controls.js"></script>
    <script src="javascript/csspopup.js?v1241"></script> 
</head>

<body>
<div id="canvasDiv" style="display:none;">
	<canvas id="canvas0" style="left: 470px; top: 0px; width: 700px; height: 528px;"> 
	Your browser does not support the canvas element.
	</canvas>
	<canvas id="canvas" width="700" height="528">
	</canvas>
	<canvas id="canvas2" width="700" height="528">
	</canvas>
	<canvas id="canvas3" width="700" height="528">
	</canvas>
</div>

<script type="text/javascript">
function mouseOver(param){
	var imgId = parseInt(param.id);
	param.childNodes[0].style.position = "relative";
	param.childNodes[0].style.zIndex = "9000";
	param.childNodes[0].style.transform = "scale(2.5)";
	if(imgId == 1 || imgId == 2 || imgId == 5 || imgId == 6 ){
		param.childNodes[0].style.transformOrigin = "top left";
	}else if(imgId == 11 || imgId == 12 || imgId == 15 || imgId == 16 ){
		param.childNodes[0].style.transformOrigin = "bottom right";
	}else if(imgId == 3 || imgId == 4 || imgId == 7 || imgId == 8 ){
		param.childNodes[0].style.transformOrigin = "top right";
	}else if(imgId == 9 || imgId == 10 || imgId == 13 || imgId == 14 ){
		param.childNodes[0].style.transformOrigin = "bottom left";
	}
}

function mouseOut(param){
	param.childNodes[0].style.zIndex = "8999";
	param.childNodes[0].style.transform = "none";
}
</script>

<div class="main" id="mainDiv" style="display:none;">
	<h1>Library of Assignments</h1>
	<div class="gallery">
		<a href="#" id="1" onclick="mouseOver(this)" onmouseout="mouseOut(this)"><img src="images/large/layout_1.png" alt=" " class="grid-image"/></a>
		<a href="#" id="2" onclick="mouseOver(this)" onmouseout="mouseOut(this)"><img src="images/large/layout_2.png" alt=" " class="grid-image"/></a>
		<a href="#" id="3" onclick="mouseOver(this)" onmouseout="mouseOut(this)"><img src="images/large/layout_3.png" alt=" " class="grid-image"/></a>
		<a href="#" id="4" onclick="mouseOver(this)" onmouseout="mouseOut(this)"><img src="images/large/layout_4.png" alt=" " class="grid-image"/></a>
		<a href="#" id="5" onclick="mouseOver(this)" onmouseout="mouseOut(this)"><img src="images/large/layout_5.png" alt=" " class="grid-image"/></a>
		<a href="#" id="6" onclick="mouseOver(this)" onmouseout="mouseOut(this)"><img src="images/large/layout_6.png" alt=" " class="grid-image"/></a>
		<a href="#" id="7" onclick="mouseOver(this)" onmouseout="mouseOut(this)"><img src="images/large/layout_7.png" alt=" " class="grid-image"/></a>
		<a href="#" id="8" onclick="mouseOver(this)" onmouseout="mouseOut(this)"><img src="images/large/layout_8.png" alt=" " class="grid-image"/></a>
		<a href="#" id="9" onclick="mouseOver(this)" onmouseout="mouseOut(this)"><img src="images/large/layout_9.png" alt=" " class="grid-image"/></a>
		<a href="#" id="10" onclick="mouseOver(this)" onmouseout="mouseOut(this)"><img src="images/large/layout_10.png" alt=" " class="grid-image"/></a>
		<a href="#" id="11" onclick="mouseOver(this)" onmouseout="mouseOut(this)"><img src="images/large/layout_11.png" alt=" " class="grid-image"/></a>
		<a href="#" id="12" onclick="mouseOver(this)" onmouseout="mouseOut(this)"><img src="images/large/layout_12.png" alt=" " class="grid-image"/></a>
		<a href="#" id="13" onclick="mouseOver(this)" onmouseout="mouseOut(this)"><img src="images/large/layout_13.png" alt=" " class="grid-image"/></a>
		<a href="#" id="14" onclick="mouseOver(this)" onmouseout="mouseOut(this)"><img src="images/large/layout_14.png" alt=" " class="grid-image"/></a>
		<a href="#" id="15" onclick="mouseOver(this)" onmouseout="mouseOut(this)"><img src="images/large/layout_15.png" alt=" " class="grid-image"/></a>
		<a href="#" id="16" onclick="mouseOver(this)" onmouseout="mouseOut(this)"><img src="images/large/layout_16.png" alt=" " class="grid-image"/></a>
	</div>
</div>

<h1 class="selectedTitle" id="selectedTitle" style="display:none;">Current Curriculum</h1>
<div class="record" id="recordDiv" style="display:none;">
</div>

<div class="goal" id="goalDiv" style="display:none;">
	<p>
		<strong>The target assignment:</strong>
	</p><br />
	<img src="images/target_assignment_small.png" alt=" "/>
	<p style="text-align: center;"> Move the bag to the yellow room</p>
</div>

<div class="select" id="selectDiv" style="display:none;">
	<p>
		<strong>Please select an assignment!</strong>
	</p>
	<button type="submit" id="selectBtn" class="button green serif round glass">Add Assignment 1</button>
	<select class="commandSelect" id="commandSelect">
  		<option value="com1">Select command from here</option>
	</select>
</div>

<div class="finish" id="finishDesignDiv" style="display:none;">
	<p>
		<strong>Go to evaluate my curriculum!</strong>
	</p>
	<form name="submitCur" id="submit" method="post" action="start.php" onSubmit="event.preventDefault(); validateMyForm();">
	<button type="submit" id="finishBtn" class="button pink serif round glass disabled">Evaluate Curriculum</button>
	<input type="hidden" name="select_order" value=""></input>
	<input type="hidden" name="command_index" value=""></input>
	<input type="hidden" name="change_select_order" value=""></input>
	<input type="hidden" name="change_command_index" value=""></input>
	</form>
</div>

<div id="tutorial" style="display: none; background-color:#33cc99;"> 
	<div id="sidebar"> 
	<center>
		<h1 id="tutorialText"> TUTORIAL </h1>
		<span style="position:absolute; left: 740px; top: 10px; max-width: 500px; color:#D80000; font-size:18px;">Please do not click the Back button on your browser during this user study. </span>
	</center>	
	<div id="feedbackText" style="position:absolute; left: 90px; top: 300px; font-size:32px; color: white; display: none;">punish</div>
	<div id="instruction">
	In this study, you will need to design a curriculum for the dog to learn, so that the dog can successfully complete the given command in the target environment.  <br /><br />Click Continue button to move on
	</div>
	<a id="continueBtn" class="continueBtn" style="position: absolute; left: 480px; top: 640px;">
		<span> Continue</span>
	</a>	
	</div>
</div>
<script src="javascript/tutorial.js?v560" type="text/javascript"></script>

<div id="blanket" style="display:none;"></div>

<div id="popUpDiv" style="background-color: #33CC99; display:none; width:1100px; height:700px;	">
	<iframe src="tutorialSelectAssignment.html" width="100%" height="98%" frameborder="0"></iframe>
</div>

<div id="popUpDiv2" style="background-color: #33CC99; display:none; width:1100px; height:700px;	">
	<iframe src="tutorialChangeAssignment.html" width="100%" height="98%" frameborder="0"></iframe>
</div>

<script type="text/javascript">

$(".gallery a").on("click", function() {
	$( ".gallery img" ).each(function(){
		if($(this).hasClass("grid-current-image")){
			$(".gallery img").removeClass("grid-current-image");
			$(".gallery img").addClass("grid-image");
		}
	});
	$elem = $(this).children();
	if($elem.hasClass("grid-image")){
		$elem.removeClass("grid-image");
		$elem.addClass("grid-current-image");
	}
	
	changeSelect();
});

function changeSelect($id){
	remove("commandSelect");
	var divElm = document.getElementById("selectDiv");
	var selElm = document.createElement("select");
	var id = document.getElementsByClassName("grid-current-image")[0].parentNode.id
	var command = getCommand(id);
	
	selElm.id = "commandSelect";		
	divElm.appendChild(selElm);
	for (var i = 0; i < command.length; i++){
		var optElm = document.createElement("option");
		optElm.innerHTML = command[i];
		selElm.appendChild(optElm);
	}
}

function remove(id) {
	if (document.getElementById(id)){
		return (elem=document.getElementById(id)).parentNode.removeChild(elem);
	}
}

function getCommand(id){
	var command;
	switch(id){
		case "1":
			command = ["Select command from here", "Move to the yellow room"];
			break;
		case "2":
			command = ["Select command from here", "Move to the yellow room", "Move to the purple room"];
			break;
		case "3":
			command = ["Select command from here", "Move to the red room", "Move to the green room", "Move to the yellow room"];
			break;
		case "4":
			command = ["Select command from here", "Move to the purple room", "Move to the yellow room", "Move to the green room", "Move to the blue room"];
			break;
		case "5":
			command = ["Select command from here", "Move to the red room", "Move the bag to the red room"];
			break;
		case "6":
			command = ["Select command from here", "Move to the red room", "Move to the yellow room", "Move the backpack to the blue room", "Move the backpack to the yellow room"];
			break;
		case "7":
			command = ["Select command from here", "Move to the red room", "Move to the yellow room", "Move to the purple room", "Move the basket to the red room", "Move the basket to the yellow room", "Move the basket to the purple room"];
			break;
		case "8":
			command = ["Select command from here", "Move to the purple room", "Move to the green room", "Move to the yellow room", "Move to the red room", "Move the chair to the purple room", "Move the chair to the green room", "Move the chair to the yellow room", "Move the chair to the red room"];
			break;
		case "9":
			command = ["Select command from here", "Move to the purple room", "Move the chair to the purple room", "Move the bag to the purple room"];
			break;
		case "10":
			command = ["Select command from here", "Move to the blue room", "Move to the yellow room", "Move the backpack to the blue room", "Move the backpack to the yellow room", "Move the bag to the red room"];
			break;
		case "11":
			command = ["Select command from here", "Move to the yellow room", "Move to the green room", "Move to the purple room", "Move the chair to the yellow room", "Move the chair to the blue room", "Move the chair to the green room", "Move the bag to the blue room", "Move the bag to the green room"];
			break;
		case "12":
			command = ["Select command from here", "Move to the green room", "Move to the red room", "Move to the purple room", "Move to the yellow room", "Move the bag to the red room", "Move the bag to the blue room", "Move the bag to the purple room", "Move the backpack to the red room", "Move the backpack to the blue room", "Move the backpack to the purple room", "Move the backpack to the yellow room"];
			break;
		case "13":
			command = ["Select command from here", "Move to the green room", "Move the chair to the green room", "Move the bag to the green room", "Move the backpack to the green room"];
			break;
		case "14":
			command = ["Select command from here", "Move to the green room", "Move to the yellow room", "Move the bag to the green room", "Move the chair to the yellow room", "Move the chair to the purple room", "Move the backpack to the yellow room", "Move the backpack to the purple room"];
			break;
		case "15":
			command = ["Select command from here", "Move to the green room", "Move to the yellow room", "Move to the blue room", "Move the basket to the green room", "Move the basket to the yellow room", "Move the basket to the blue room", "Move the backpack to the yellow room", "Move the backpack to the blue room", "Move the backpack to the red room", "Move the bag to the blue room", "Move the bag to the red room"];
			break;
		case "16":
			command = ["Select command from here", "Move to the red room", "Move to the green room", "Move to the blue room", "Move to the yellow room", "Move the chair to the purple room", "Move the chair to the green room", "Move the chair to the blue room", "Move the chair to the yellow room", "Move the backpack to the green room", "Move the backpack to the red room", "Move the backpack to the blue room", "Move the backpack to the yellow room", "Move the bag to the purple room", "Move the bag to the red room", "Move the bag to the green room"];
			break;
	}
	return command;
}
    
function validateMyForm(){
	var finishBtn = document.getElementById("finishBtn");
	var className = finishBtn.className;
	if(sessionStorage.getItem("design_gui")){
		if(className == "button pink serif round glass"){
			document.submitCur.select_order.value = sessionStorage.getItem("select_order_list");
			document.submitCur.command_index.value = sessionStorage.getItem("command_index_list");
			
			document.submitCur.change_select_order.value = sessionStorage.getItem("change_select_order_list");
			document.submitCur.change_command_index.value = sessionStorage.getItem("change_command_index_list");
			
			sessionStorage.setItem("train_gui", true);
			document.getElementById("submit").submit();
		}	
	}else{
		if(className == "button pink serif round glass"){
			document.getElementById("tutorial").style.display = "block";
			document.getElementById("canvasDiv").style.display = "none";
			document.getElementById("mainDiv").style.display = "none";
			document.getElementById("selectedTitle").style.display = "none";
			document.getElementById("recordDiv").style.display = "none";
			document.getElementById("goalDiv").style.display = "none";
			document.getElementById("selectDiv").style.display = "none";
			document.getElementById("finishDesignDiv").style.display = "none";
			document.getElementById("selectBtn").removeEventListener("click", curriculumDesign, false);
		}
	}
}

function loadTest(){
	console.log("load test");
	sessionStorage.setItem('proceed_test', true)
	var url = window.location.href;
	var tempUrl = url.split('#');
	var newUrl = tempUrl[0];
	window.location = newUrl;		
}
</script>

</body>
<script type="text/javascript" src="javascript/jquerypp.custom.js"></script>
<script type="text/javascript" src="javascript/jquery.elastislide.js?v12"></script>
<script type="text/javascript">
	var current = 0,
	$preview = $( '#preview' ),
	$carouselEl = $( '#carousel' ),
	$carouselItems = $carouselEl.children(),
	carousel = $carouselEl.elastislide( {
		current : current,
		minItems : 4,
		onClick : function( el, pos, evt ) {
				changeImage( el, pos );
				evt.preventDefault();
			},
		onReady : function() {
				changeImage( $carouselItems.eq( current ), current );	
			}
		} )
		function changeImage( el, pos ) {
//			$preview.attr( 'src', el.data( 'preview' ) );
// 			$carouselItems.removeClass( 'current-img' );
// 			el.addClass( 'current-img' );
// 			carousel.setCurrent(pos);
		}
</script>
<script src="javascript/burlapDemo.js?v564"></script>
<script src="javascript/trainingGui.js?v564" type="text/javascript"></script>
</html>