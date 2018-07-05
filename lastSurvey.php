<?php
include 'include.php';
getSession();
?>

<html>
<body>
	<div style="position: absolute; left: 5%; width: 500px;">
		<form action="logLastSurvey.php" method="POST">	
			<h2>Last Experiment Survey</h2>

			1)  Please explain the strategy you used in the initial curriculum design.
			<textarea name="strategy" cols="65" rows="5"></textarea><br /><br />

			2)  What things did you identify that the dog need to learn in the curriculum to successfully complete the target assignment?
			<textarea name="learn" cols="65" rows="5"></textarea><br /><br />

			3)  Did you redesign your curriculum? 
			<textarea name="redesign" cols="65" rows="5"></textarea><br /><br />

			4)  If so, how did you redesign it?
			<textarea name="howRedesign" cols="65" rows="5"></textarea><br /><br />
			<br /><br />

			<input type="submit" value="submit"></input>
		</form>
	</div>
</body>
</html>
