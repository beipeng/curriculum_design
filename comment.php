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
	<div style="position: absolute; left: 5%; top:10%; width: 680px;">
		<center><h2>Thank you!</h2></center>
		<h3> Please help us improve our research by giving any comment or suggestion: </h3>
		<form action="logComment.php" method="POST">
			<textarea name="comment" cols="93" rows="10"></textarea><br /><br /><br /><br />
			<input type="submit" style="position:relative; top:5px; left:45%;">
		</form>
	</div>
</body>
</html>
