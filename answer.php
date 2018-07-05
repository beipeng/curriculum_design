<?php
include 'include.php';
getSession();   

$number = 0;

$value = 0;

$value = isset($_POST["question1"]) ? $_POST["question1"] : 0;
if($value != 26){
	$number += 1;
}

$value = isset($_POST["question2"]) ? $_POST["question2"] : 0;
if($value != 5){
	$number += 1;
}

$value = isset($_POST["question3"]) ? $_POST["question3"] : 0;
if($value != 35){
	$number += 1;
}

$value = isset($_POST["question4"]) ? $_POST["question4"] : 0;
if($value != 7){
	$number += 1;
}

$value = isset($_POST["question5"]) ? $_POST["question5"] : 0;
if($value != 73){
	$number += 1;
}

$value = isset($_POST["question6"]) ? $_POST["question6"] : 0;
if($value != 15){
	$number += 1;
}
?>

<html>
	<head>
    <h3><?php 
		switch($number){
			case 0:
				echo "Your answers are all correct and you are qualified for this HIT. Now please complete a background survey.";
				break;
			case 1:
				echo "You gave one wrong answer but you are still qualified for this HIT. Now please complete a background survey.";
				break;
			case 2:
				echo "Sorry, you gave two wrong answers so you can't do this HIT.";
				break;
			case 3:
				echo "Sorry, you gave three wrong answers so you can't do this HIT.";
				break;
			case 4:
				echo "Sorry, you gave four wrong answers so you can't do this HIT.";
				break;
			case 5:
				echo "Sorry, you gave five wrong answers so you can't do this HIT.";
				break;
			case 6:
				echo "Sorry, your answers are all wrong so you can't do this HIT.";
				break;
		}
    ?></h3>
	<form action="backgroundSurvey.php" method="POST" id="proceedForm" style="display: none;">
		<input type="submit" value="proceed to background survey"></input>
	</form>
	</head>
</html>

<script language="javascript">
	var number = "<?php echo $number ?>";

	showMessage();
	function showMessage(){
		if(number < 2){
			document.getElementById("proceedForm").style.display = "block";
		}
	}	
</script>