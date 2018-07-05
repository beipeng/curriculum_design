<?php

include 'include.php';

getSession();

$file = fopen("forms/comment_" . $id . "_log", "a");

//comment
fwrite($file, $_POST["comment"] . "\n");

fclose($file);

header('Content-Type: text/javascript');
header("Location: thankyou.php");
?>