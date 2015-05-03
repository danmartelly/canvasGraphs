#!/usr/bin/python
import dataFuncs
import os
import hashlib
import cgi
import cgitb
cgitb.enable()

user = os.environ.get('SSL_CLIENT_S_DN_Email','').split('@')[0].strip()
kerberosHash = "'" + hashlib.sha224(user).hexdigest() + "'"

navigationText = dataFuncs.extractText("text/navigation.html")
instructionText = dataFuncs.extractText("text/instructions.html")
question1Text = dataFuncs.extractText("text/transModelQuestion.html")
question2Text = dataFuncs.extractText("text/coinFlipQuestion.html")

print '''
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
	<title>Optional 601 Review Questions</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
	<script src="sketchGraphs.js" text="javascript/text"></script>
</head>
<body>
	%(navigationText)s
	%(instructionText)s

	<h1> Probability </h1>

	%(question1Text)s
	<h4>Teleport Model</h4>
	<div id="teleportModel"></div>
	<img id="teleportAnswer" src="images/lion.jpeg">
	<h4>Reset Model</h4>
	<div id="resetModel"></div>
	<img id="resetAnswer" src="images/lion.jpeg">
	<h4>Teleport Model 2</h4>
	<div id="teleportModel2"></div>
	<img id="teleportAnswer2" src="images/lion.jpeg">
	<h4>Reset Model 2</h4>
	<div id="resetModel2"></div>
	<img id="resetAnswer2" src="images/lion.jpeg">

	<br><hr>	
	%(question2Text)s
	<div id="coinFlips"></div>
	<img id="coinFlipsAnswer" src="images/lion.jpeg"></div>
</body>
<script text="javascript/text">
	window.onload = function () {
		// Transition Models
		var trans = [];
		var s, space, answer;
		space = document.getElementById("teleportModel");
		answer = document.getElementById("teleportAnswer");
		s = new SketchInterface(%(kerberosHash)s, "teleportModel", space, 600, 300, answer, false, false);
		trans.push(s);
		
		space = document.getElementById("resetModel");
		answer = document.getElementById("resetAnswer");
		s = new SketchInterface(%(kerberosHash)s, "resetModel", space, 600, 300, answer, false, false);
		trans.push(s);

		space = document.getElementById("teleportModel2");
		answer = document.getElementById("teleportAnswer2");
		s = new SketchInterface(%(kerberosHash)s, "teleportModel2", space, 600, 300, answer, false, false);
		trans.push(s);

		space = document.getElementById("resetModel2");
		answer = document.getElementById("resetAnswer2");
		s = new SketchInterface(%(kerberosHash)s, "resetModel2", space, 600, 300, answer, false, false);
		trans.push(s);

		for (var i = 0; i < trans.length; i++) {
			trans[i].setAxes(-.5, 10.5, 1, -1, 10, 20);
			trans[i].labelAxes("State Number", "Probability");
		}

		// Coin flips
		space = document.getElementById("coinFlips");
		answer = document.getElementById("coinFlipsAnswer");
		s = new SketchInterface(%(kerberosHash)s, "coinFlips", space, 600, 300, answer, false, false);
		s.setAxes(-.5, 8, 1, -.05, 1.05, .25);
		s.labelAxes("Flip Number", "Probability that coin is double headed",13);

	}
</script>
</html>
''' % {'kerberosHash':kerberosHash, 'navigationText':navigationText, 'instructionText': instructionText, 'question1Text': question1Text, 'question2Text':question2Text}
