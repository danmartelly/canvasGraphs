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
basicPolesText1 = dataFuncs.extractText("text/basicPoles1.html")
basicPolesText2 = dataFuncs.extractText("text/basicPoles2.html")
basicPolesText3 = dataFuncs.extractText("text/basicPoles3.html")

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

	%(basicPolesText1)s
	<div id="poles1"></div>
	<img id="polesAnswer1" src="images/lion.jpeg">
	%(basicPolesText2)s
	<div id="poles2"></div>
	<img id="polesAnswer2" src="images/lion.jpeg">
	%(basicPolesText3)s
	<div id="poles3"></div>
	<img id="polesAnswer3" src="images/lion.jpeg">

</body>
<script text="javascript/text">
	window.onload = function () {
		var s, space, answer;
		space = document.getElementById("poles1");
		answer = document.getElementById("polesAnswer1");
		s = new SketchInterface(%(kerberosHash)s, "poles1", space, 600, 300, answer, false, true);
		s.setAxes(-.5, 10.5, 1, -5, 5, 10);
		s.labelAxes("timesteps [n]", "y[n]");

		space = document.getElementById("poles2");
		answer = document.getElementById("polesAnswer2");
		s = new SketchInterface(%(kerberosHash)s, "poles2", space, 600, 300, answer, false, true);
		s.setAxes(-.5, 10.5, 1, -5, 5, 10);
		s.labelAxes("timesteps [n]", "y[n]");

		space = document.getElementById("poles3");
		answer = document.getElementById("polesAnswer3");
		s = new SketchInterface(%(kerberosHash)s, "poles3", space, 300, 300, answer, false, false, "images/unitCircleWeb.png");
		
	}
</script>
</html>
''' % {'kerberosHash':kerberosHash, 'navigationText':navigationText, 'instructionText': instructionText, 'basicPolesText1':basicPolesText1, 'basicPolesText2':basicPolesText2, 'basicPolesText3':basicPolesText3}
