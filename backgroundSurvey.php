<?php
include 'include.php';
getSession();
?>

<html>
<body>
	<div style="position: absolute; left: 5%; width: 50%">
	<form action="logBackGroundSurvey.php" method="POST">
	<h2>Please complete the background survey</h2>
	1) Age:	<input type="text" name="age" /><br /><br />

	2) Gender:<br /><br />
	<input type="radio" name="gender" value="female">female</input>
	<input type="radio" name="gender" value="male">male</input><br /><br />

	3) Highest level of education attained (Check One):<br /><br />
	<input type="radio" name="education" value="some high school"> some high school</input><br />
	<input type="radio" name="education" value="high school diploma"> high school diploma</input><br />
	<input type="radio" name="education" value="some college"> some college</input><br />
	<input type="radio" name="education" value="bachelors degree"> bachelors degree</input><br />
	<input type="radio" name="education" value="some graduate school"> some graduate school</input><br />
	<input type="radio" name="education" value="masters degree"> masters degree or equivalent professional degree</input><br />
	<input type="radio" name="education" value="doctoral degree"> doctoral degree or equivalent professional degree</input><br />
	<input type="radio" name="education" value="other"> other, please explain: </input> <input type="text" name="otherEducation" /><br />
	<input type="radio" name="education" value="none"> prefer not to disclose </input><br /><br />
 
	4) Have you ever owned a dog?<br /><br />
	<input type="radio" name="hadDog" value="yes">yes</input><br />
	<input type="radio" name="hadDog" value="no">no</input><br /><br />
	&nbsp;&nbsp;&nbsp;&nbsp;4a) If yes, how many dogs have you owned in your lifetime?<br /><br />
	&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" size="50" name="ifHadDog" /><br /><br />

	5) Do you currently own a dog?<br /><br />
	<input type="radio" name="hasDog" value="yes">yes</input><br />
	<input type="radio" name="hasDog" value="no">no</input><br /><br />
	&nbsp;&nbsp;&nbsp;&nbsp;5a) If yes, how many?<br /><br />
	&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" size="50" name="ifHasDog" /><br /><br />

	6) If you answered yes to (4) or (5), were you responsible for training any of those dogs?<br /><br />
	<input type="radio" name="trainedDogs" value="yes">yes</input><br />
	<input type="radio" name="trainedDogs" value="no">no</input><br /><br />
	6a) if yes, how many years has it been since you were actively involved in training a dog (enter 0 if you are currently training a dog)
	&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" size="50" name="ifEverHadDog" /><br /><br />

	7) How much experience do you have training dogs?<br /><br />
	<input type="radio" name="trainingExperience" value="None">none</input><br />
	<input type="radio" name="trainingExperience" value="Some">some</input><br />
	<input type="radio" name="trainingExperience" value="A lot">a lot</input><br />
	<input type="radio" name="trainingExperience" value="I am an expert in dog training">I am an expert in dog training</input><br /><br />

	8) Have you ever attended a group training class with a dog?<br /><br />
	<input type="radio" name="groupClass" value="yes">yes</input><br />
	<input type="radio" name="groupClass" value="no">no</input><br /><br />

	9) Have you ever taken part in a private training lesson with a dog?<br /><br />
	<input type="radio" name="privateClass" value="yes">yes</input><br />
	<input type="radio" name="privateClass" value="no">no</input><br /><br />

	10) Please indicate which of the following dog training techniques you have used while training a dog<br /><br />
	<input type="checkbox" name="usedTechniques[]" value="clicker training">clicker training</input><br />
	<input type="checkbox" name="usedTechniques[]" value="lure-reward training">lure-reward training</input><br />
	<input type="checkbox" name="usedTechniques[]" value="compulsion-based methods">compulsion-based methods</input><br />
	<input type="checkbox" name="usedTechniques[]" value="alpha/dominance">alpha/dominance</input><br />
	<input type="checkbox" name="usedTechniques[]" value="other">other:</input><input type="text" name="otherUsedTechniques" size=50></input><br />
	<input type="checkbox" name="usedTechniques[]" value="none">none of the above</input><br /><br />

	11) Please indicate which of the following dog training techniques you are familiar enough with to use, even if you have not actually used them<br /><br />
	<input type="checkbox" name="familiarTechniques[]" value="clicker training">clicker training</input><br />
	<input type="checkbox" name="familiarTechniques[]" value="lure-reward training">lure-reward training</input><br />
	<input type="checkbox" name="familiarTechniques[]" value="compulsion-based methods">compulsion-based methods</input><br />
	<input type="checkbox" name="familiarTechniques[]" value="alpha/dominance">alpha/dominance</input><br />
	<input type="checkbox" name="familiarTechniques[]" value="other">other:</input><input type="text" name="otherFamiliarTechniques" size=50></input><br />
	<input type="checkbox" name="familiarTechniques[]" value="none">none of the above</input><br /><br />

	<input type="submit"></input>
	</form>
</div>
</body>
</html>

<script type="text/javascript">
	sessionStorage.setItem("userID", "<?php echo $_SESSION["id"] ?>" );
</script>
