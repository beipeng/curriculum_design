<?php
include 'include.php';
getSession();
?>

<html>
<head>
	<style>
	body {
		font-family: Helvetica, Arial;
	}
	</style>
</head>

<body>
	<div id="thankDiv"></div>
</body>

</html>
<script type="text/javascript">
	var log_id = '<?php echo $_SESSION["id"] ?>';
	var divElm = document.getElementById("thankDiv");
	divElm.innerHTML = '<center style="position: absolute; left: 5%; top: 10%; width: 60%;"><h1>Thank you for completing this task! <br /><br />  Your experiment code is ' + log_id + '<br /><br />Please return to the HIT in Mechanical Turk to <br /><br />paste this code into the box so that you can get paid! </h1></center>';
</script>