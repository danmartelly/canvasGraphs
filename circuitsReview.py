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
diodeAmpText1 = dataFuncs.extractText("text/diodeAmp1.html")
diodeAmpText2 = dataFuncs.extractText("text/diodeAmp2.html")
diodeAmpText3 = dataFuncs.extractText("text/diodeAmp3.html")
lightFollowText1 = dataFuncs.extractText("text/lightFollower1.html");
lightFollowText2 = dataFuncs.extractText("text/lightFollower2.html");
lightFollowText3 = dataFuncs.extractText("text/lightFollower3.html");
lightFollowText4 = dataFuncs.extractText("text/lightFollower4.html");

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
	<img id="theveninAnswer" src="images/theveninAnswer.png">

	<br><hr>	

	%(diodeAmpText1)s
	<div id="diodeAmp1"></div>
	<img id="diodeAmpAnswer1" src="images/diodeAmpAnswer1.png">
	<hr>
	%(diodeAmpText2)s
	<div id="diodeAmp2"></div>
	<img id="diodeAmpAnswer2" src="images/diodeAmpAnswer2.png">
	<hr>
	%(diodeAmpText3)s
	<div id="diodeAmp3"></div>
	<img id="diodeAmpAnswer3" src="images/diodeAmpAnswer3.png">

	%(lightFollowText1)s
	<div id="lightFollow1"></div>
	<div id="lightFollowAnswer1"><img src="images/lightFollowerPlotC.png">
		<p style="color:red">The gain for each eye was reduced to 60%% of its previous value.</p>
	</div>
	<hr>
	%(lightFollowText2)s
	<div id="lightFollow2"></div>
	<div id="lightFollowAnswer2"><img src="images/lightFollowerPlotD.png">
		<p style="color:red">Gain for right eye was reduced to 60%% of its previous value, while gain for left eye was unchanged.</p>
	</div>
	<hr>
	%(lightFollowText3)s
	<div id="lightFollow3"></div>
	<div id="lightFollowAnswer3"><img src="images/lightFollowerPlotE.png">
		<p style="color:red">Reference voltage for both current sources increased - which has not effect on current sources.</p>
	</div>
	<hr>
	%(lightFollowText4)s
	<div id="lightFollow4"></div>
	<div id="lightFollowAnswer4"><img src="images/lightFollowerBasePlot.png">
		<p style="color:red">Reference voltage for both current sources increased - which has not effect on current sources.</p>
	</div>

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

		// diode amp
		var diodeAmps = [];
		space = document.getElementById("diodeAmp1");
		answer = document.getElementById("diodeAmpAnswer1");
		s = new SketchInterface(%(kerberosHash)s, "diodeAmp1", space, 600, 336, answer, false, false, "images/diodeAmpPlotWebGuide.png");
		diodeAmps.push(s);
		
		space = document.getElementById("diodeAmp2");
		answer = document.getElementById("diodeAmpAnswer2");
		s = new SketchInterface(%(kerberosHash)s, "diodeAmp2", space, 600, 336, answer, false, false, "images/diodeAmpPlotWebGuide.png");
		diodeAmps.push(s);

		space = document.getElementById("diodeAmp3");
		answer = document.getElementById("diodeAmpAnswer3");
		s = new SketchInterface(%(kerberosHash)s, "diodeAmp3", space, 600, 336, answer, false, false, "images/diodeAmpPlotWebGuide.png");
		diodeAmps.push(s);

		//light follower
		space = document.getElementById("lightFollow1");
		answer = document.getElementById("lightFollowAnswer1");
		s = new SketchInterface(%(kerberosHash)s, "lightFollow1", space, 500, 300, answer, false, false, "images/lightFollowerTracing.png");

		space = document.getElementById("lightFollow2");
		answer = document.getElementById("lightFollowAnswer2");
		s = new SketchInterface(%(kerberosHash)s, "lightFollow2", space, 500, 300, answer, false, false, "images/lightFollowerTracing.png");

		space = document.getElementById("lightFollow3");
		answer = document.getElementById("lightFollowAnswer3");
		s = new SketchInterface(%(kerberosHash)s, "lightFollow3", space, 500, 300, answer, false, false, "images/lightFollowerTracing.png");

space = document.getElementById("lightFollow4");
		answer = document.getElementById("lightFollowAnswer4");
		s = new SketchInterface(%(kerberosHash)s, "lightFollow4", space, 500, 300, answer, false, false, "images/lightFollowerTracing.png");

	}
</script>
</html>
''' % {'kerberosHash':kerberosHash, 'navigationText':navigationText, 'instructionText': instructionText, 'theveninText':theveninText, 'diodeAmpText1':diodeAmpText1, 'diodeAmpText2':diodeAmpText2, 'diodeAmpText3':diodeAmpText3, 'lightFollowText1': lightFollowText1, 'lightFollowText2':lightFollowText2, 'lightFollowText3':lightFollowText3, 'lightFollowText4':lightFollowText4}
