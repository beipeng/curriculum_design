<?php

$id = -1;

function getSession(){

    global $id;

    session_start();

    if(!isset($_SESSION["id"]))
        error("could not get session id", false);

    $id = $_SESSION["id"];
}

function logThis($str){

    global $id;

    $log = fopen("logs/session_" . $id . "_log", "a");
	
    if($log == FALSE)
        return false;

    fwrite($log, $str . "\n");

    fclose($log);

    return true;
}

function logAll($strs){

    global $id;

    $log = fopen("logs/session_" . $id . "_log", "a");

    if(is_null($log))
        return  false;

    for($i = 0; $i < count($strs); ++$i){
        fwrite($log, $strs[$i] . "\n");
    }

    fclose($log);

    return true;
}

function error($message, $l){
    //generic error fucntion, redirects to error page

    if($l)
	logThis($message);

    header("Location: error.html");
    exit;
}

?>
