<?php
include 'include.php';
getSession();
?>

<html>
<head>
    <meta charset="utf-8" />
    <title>Demo</title>
    <link rel="stylesheet" type="text/css" href="css/style.css?v555" />
    <link rel="stylesheet" type="text/css" href="css/elastislide.css?v1238" />
	<link rel="stylesheet" type="text/css" href="css/custom.css?v1237" />
	<script src="javascript/modernizr.custom.17475.js"></script>
    <script src="javascript/jquery.js"></script>
    <script src="javascript/gup.js"></script>
    <script src="javascript/viewer.js"></script>
    <script src="javascript/controls.js"></script>
    <script src="javascript/csspopup.js?v1241"></script>    
</head>

<body>
<div id="canvasDiv" style="display:block;">
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

<div id="showFeedback" style="position: absolute; left: 440px; top: 102px; width: 580px; height: 456px; display: none;"></div>
<div id="curOrderDiv" style="position: absolute; left: 470px; top: 55px; width: 520px; padding: 10px; color: #D80000; font-size: 26px; font-family: serif; display:none;">
	<center id="curOrderText"></center>
</div>
<div id="commandDiv" style="position: absolute; left: 470px; top: 555px; width: 520px; padding: 10px; color: #ff9900; font-size: 26px; font-family: serif; display:none;">
	<center id="commandText"></center>
</div>

<div id="blanket" style="display:none; "></div>

<div id="commentDiv" style="display:none;">
	<iframe src="comment.php" width="100%" height="100%" frameborder="0" id="iframeComment"></iframe>
</div>

<script language="Javascript">
	function loadComment() {
		window.onload = popup('commentDiv');
		document.getElementById('iframeComment').src += '';
		document.getElementById('commentDiv').style.display = "block";
		document.getElementById('commentDiv').style.left = '430px';
		document.getElementById('commentDiv').style.top = '180px';
	}

	function isRedesign() {
		sessionStorage.setItem("is_redesign", true);
		sessionStorage.setItem("train_gui", false);
	}
</script>

<div id="scoreDiv" style="position: absolute; left: 600px; top: 80px; display: none;">
	<span style="font-size:26px; color:#D80000;">SCORE: 20   (0 is the best)</span>
</div>

<div class="redesign" id="redesignDiv" style="display:none;">
	<p>
		<strong>Want a better curriculum? (You have to redesign it at least once before submitting the HIT!)</strong>
	</p>
	<form method="post" action="index.php">
		<button type="submit" id="redesignBtn" class="button blue serif round glass" onclick="isRedesign()">Redesign Curriculum</button>
	</form>
</div>

<div class="submitCur" id="submitDiv" style="display:none;">
	<p>
		<strong>Want to submit it?</strong>
	</p>
	<form action="lastSurvey.php" method="POST">
		<button type="submit" id="finishBtn" class="button pink serif round glass" style="width:250px;">Submit HIT</button>
	</form>
</div>

<div class="circle" id="circle" style="display: none; background: red;"></div>

</body>

<script src="javascript/burlapDemo.js?v564"></script>
<script src="javascript/trainingGui.js?v564" type="text/javascript"></script>
</html>