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
theveninText = dataFuncs.extractText("text/thevenin.html")
sumOpAmpText1 = dataFuncs.extractText("text/sumOpAmp1.html")
sumOpAmpText2 = dataFuncs.extractText("text/sumOpAmp2.html")
diodeAmpText1 = dataFuncs.extractText("text/diodeAmp1.html")
diodeAmpText2 = dataFuncs.extractText("text/diodeAmp2.html")
diodeAmpText3 = dataFuncs.extractText("text/diodeAmp3.html")

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

	<h1> Circuits </h1>

	%(theveninText)s
	<div id="thevenin"></div>
	<img id="theveninAnswer" src="images/lion.jpeg">

	<br><hr>	
	%(sumOpAmpText1)s
	<div id="sumOpAmp1"></div>
	<img id="sumOpAmpAnswer1" src="images/lion.jpeg"></div>
	%(sumOpAmpText2)s
	<div id="sumOpAmp2"></div>
	<img id="sumOpAmpAnswer2" src="images/lion.jpeg">

	%(diodeAmpText1)s
	<div id="diodeAmp1"></div>
	<img id="diodeAmpAnswer1" src="images/lion.jpeg">
	<hr>
	%(diodeAmpText2)s
	<div id="diodeAmp2"></div>
	<img id="diodeAmpAnswer2" src="images/lion.jpeg">
	<hr>
	%(diodeAmpText3)s
	<div id="diodeAmp3"></div>
	<img id="diodeAmpAnswer3" src="images/lion.jpeg">

</body>
<script text="javascript/text">
	window.onload = function () {
		// Thevenin
		var s, space, answer;
		space = document.getElementById("thevenin");
		answer = document.getElementById("theveninAnswer");
		s = new SketchInterface(%(kerberosHash)s, "thevenin", space, 600, 300, answer, true, true);
		s.setAxes(-5,5,10,-5,5,10);
		s.labelAxes("voltage (V)","current (I)");

		// Summing op amp
		space = document.getElementById("sumOpAmp1");
		answer = document.getElementById("sumOpAmpAnswer1");
		s = new SketchInterface(%(kerberosHash)s, "sumOpAmp1", space, 600, 300, answer, false, true);
		s.setAxes(-10, 1050, 100, -5, 5, 10);
		s.labelAxes("Resistance Rf", "voltage out");
		space = document.getElementById("sumOpAmp2");
		answer = document.getElementById("sumOpAmpAnswer2");
		s = new SketchInterface(%(kerberosHash)s, "sumOpAmp2", space, 600, 300, answer, false, true);
		s.setAxes(-10, 1050, 100, -5, 5, 10);

		// diode amp
		var diodeAmps = [];
		space = document.getElementById("diodeAmp1");
		answer = document.getElementById("diodeAmpAnswer1");
		s = new SketchInterface(%(kerberosHash)s, "diodeAmp1", space, 600, 300, answer, false, false);
		diodeAmps.push(s);
		
		space = document.getElementById("diodeAmp2");
		answer = document.getElementById("diodeAmpAnswer2");
		s = new SketchInterface(%(kerberosHash)s, "diodeAmp2", space, 600, 300, answer, false, false);
		diodeAmps.push(s);

		space = document.getElementById("diodeAmp3");
		answer = document.getElementById("diodeAmpAnswer3");
		s = new SketchInterface(%(kerberosHash)s, "diodeAmp3", space, 600, 300, answer, false, false);
		diodeAmps.push(s);

		for (var i = 0; i < diodeAmps.length; i++) {
			diodeAmps[i].setAxes(-5, 105, 20, -.5, 10.5, 1);
			diodeAmps[i].labelAxes("timesteps","voltage out");
		}

	}
</script>
</html>
''' % {'kerberosHash':kerberosHash, 'navigationText':navigationText, 'instructionText': instructionText, 'theveninText':theveninText, 'sumOpAmpText1':sumOpAmpText1, 'sumOpAmpText2':sumOpAmpText2, 'diodeAmpText1':diodeAmpText1, 'diodeAmpText2':diodeAmpText2, 'diodeAmpText3':diodeAmpText3}
