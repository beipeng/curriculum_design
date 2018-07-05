<?php
include 'include.php';
getSession();

$file = fopen("forms/designed_curriculum" . $id . "_log", "a");

//record the whole process of the last curriculum being changed
if($_POST["change_select_order"]){
	fwrite($file, "change last curriculum \n");
fwrite($file, $_POST["change_select_order"] . "\n");
fwrite($file, $_POST["change_command_index"] . "\n\n\n");
}

//record current curriculum
fwrite($file, "current curriculum \n");
//selected room layouts' id
fwrite($file, $_POST["select_order"] . "\n");
//selected commands' index
fwrite($file, $_POST["command_index"] . "\n");

fclose($file);
?>

<html>
<body>
	<div style="position: absolute; top: 100px; left: 300px">
		<p>Now, you will watch the whole process of the dog being trained in your designed curriculum and the target assignment!</p>
		<form id="submit" method="post" action="train.php">
			<input type="submit" value="proceed to training"></input>
		</form>
	</div>
</body>
</html>
<script type="text/javascript">
	sessionStorage.setItem("train_gui", true);
</script>
