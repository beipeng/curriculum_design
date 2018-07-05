<?php

include 'include.php';

//get new id

$ses = uniqid(true);

//start session
if(!session_start())
    error("could not start session", true);

$_SESSION["id"] = $ses;

?>
<!DOCTYPE html>
<html>
<head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<style>
.question {
	margin-bottom: 55px;
}
</style>
</head>
<body>
<div style="position: absolute; left: 5%; width: 50%;">
<h2>Color Blind Test </h2>
<h3>Note: you have to pass this test so that you can do the real experiment.</h3>
<form action="answer.php" method="POST" id="colorBlindForm">
<div id="content">
  <div class="question">
    <div class="questionText">1.- What number, if any, do you see in the following picture?<br>
    <img src="images/daltonism10.jpg"></div>
    <div class="answer">
      <ul class="options">
        <li>
          <label>
            <input type="radio" name="question1" value="99">
            99</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question1" value="57">
            57</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question1" value="26">
            26</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question1" value="22">
            22</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question1" value="no">
            I don't see any numbers or the number I see is not listed</label>
        </li>
      </ul>
    </div>
  </div>
  <div class="question">
    <div class="questionText">2.- What number, if any, do you see in the following picture?<br>
    <img src="images/daltonism11.jpg"></div>
    <div class="answer">
      <ul class="options">
        <li>
          <label>
            <input type="radio" name="question2" value="65">
            65</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question2" value="5">
            5</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question2" value="43">
            43</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question2" value="no">
            I don't see any numbers or the number I see is not listed</label>
        </li>
      </ul>
    </div>
  </div>
  <div class="question">
    <div class="questionText">3.- What number, if any, do you see in the following picture?<br>
    <img src="images/daltonism13.jpg"></div>
    <div class="answer">
      <ul class="options">
        <li>
          <label>
            <input type="radio" name="question3" value="35">
            35</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question3" value="74">
            74</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question3" value="8">
            8</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question3" value="no">
            I don't see any numbers or the number I see is not listed</label>
        </li>
      </ul>
    </div>
  </div>
  <div class="question">
    <div class="questionText">4.- What number, if any, do you see in the following picture?<br>
    <img src="images/daltonism19.jpg"></div>
    <div class="answer">
      <ul class="options">
        <li>
          <label>
            <input type="radio" name="question4" value="85">
            85</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question4" value="7">
            7</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question4" value="19">
            19</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question4" value="60">
            60</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question4" value="no">
            I don't see any numbers or the number I see is not listed</label>
        </li>
      </ul>
    </div>
  </div>
  <div class="question">
    <div class="questionText">5.- What number, if any, do you see in the following picture?<br>
    <img src="images/daltonism20.jpg"></div>
    <div class="answer">
      <ul class="options">
        <li>
          <label>
            <input type="radio" name="question5" value="73">
            73</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question5" value="35">
            35</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question5" value="20">
            20</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question5" value="41">
            41</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question5" value="no">
            I don't see any numbers or the number I see is not listed</label>
        </li>
      </ul>
    </div>
  </div>
  <div class="question">
    <div class="questionText">6.- What number, if any, do you see in the following picture?<br>
    <img src="images/daltonism21.jpg"></div>
    <div class="answer">
      <ul class="options">
        <li>
          <label>
            <input type="radio" name="question6" value="10">
            10</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question6" value="73">
            73</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question6" value="11">
            11</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question6" value="15">
            15</label>
        </li>
        <li>
          <label>
            <input type="radio" name="question6" value="no">
            I don't see any numbers or the number I see is not listed</label>
        </li>
      </ul>
    </div>
  </div>
</div>
<input type="submit"></input>
</form>
</div>
</body>
</html>
