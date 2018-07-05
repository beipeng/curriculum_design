<?php

include 'include.php';
getSession();

//log survey event

//logThis(microtime(true) . " EVENT background survey submitted");

//open data file

$file = fopen("forms/background_survey_" . $id . "_log", "a");

//age
fwrite($file, isset($_POST["age"]) ? $_POST["age"] : '' . "\n");

//gender
fwrite($file, isset($_POST["gender"]) ? $_POST["gender"] : '' . "\n");

//education
fwrite($file, isset($_POST["education"]) ? $_POST["education"] : '' . "\n");
fwrite($file, isset($_POST["otherEducation"]) ? $_POST["otherEducation"] : '' . "\n");

//has owned dog
fwrite($file, isset($_POST["hadDog"]) ? $_POST["hadDog"] : '' . "\n");
fwrite($file, isset($_POST["ifHadDog"]) ? $_POST["ifHadDog"] : '' . "\n");

//owns dog
fwrite($file, isset($_POST["hasDog"]) ? $_POST["hasDog"] : '' . "\n");
fwrite($file, isset($_POST["ifHasDog"]) ? $_POST["ifHasDog"] : '' . "\n");

//trained dogs
fwrite($file, isset($_POST["trainedDogs"]) ? $_POST["trainedDogs"] : '' . "\n");

//training experience
fwrite($file, isset($_POST["trainingExperience"]) ? $_POST["trainingExperience"] : '' . "\n");

//group class
fwrite($file, isset($_POST["groupClass"]) ? $_POST["groupClass"] : '' . "\n");

//private class
fwrite($file, isset($_POST["groupClass"]) ? $_POST["groupClass"] : '' . "\n");

//familiar techniques
if(!empty($_POST["usedTechniques"])){
	fwrite($file, implode("|", $_POST["usedTechniques"]) . "\n");
}
fwrite($file, $_POST["otherUsedTechniques"] . "\n");

//used techniques
if(!empty($_POST["familiarTechniques"])){
	fwrite($file, implode("|", $_POST["familiarTechniques"]) . "\n");
}
fwrite($file, $_POST["otherFamiliarTechniques"] . "\n");

fclose($file);

header('Content-Type: text/javascript');
header("Location: index.php");
?>
