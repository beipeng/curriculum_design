<?php

include 'include.php';

getSession();

//log survey event

logThis(microtime(true) . " EVENT last survey " . $_SESSION["stage"] . " submitted");

//open data file

$file = fopen("forms/last_survey_" . $id, "a");

if(is_null($file))
	error("cannot save form data");

//descrption
if(isset($_POST["strategy"])){
fwrite($file, $_POST["strategy"] . "\n\n");
}else{
fwrite($file, "\n\n");
}

if(isset($_POST["learn"])){
fwrite($file, $_POST["learn"] . "\n\n");
}else{
fwrite($file, "\n\n");
}

if(isset($_POST["redesign"])){
fwrite($file, $_POST["redesign"] . "\n\n");
}else{
fwrite($file, "\n\n");
}

if(isset($_POST["howRedesign"])){
fwrite($file, $_POST["howRedesign"] . "\n\n");
}else{
fwrite($file, "\n\n");
}

fclose($file);

header("Location: comment.php");
?>
