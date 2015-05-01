#!/usr/bin/python
import dataFuncs
import os
import cgi
import cgitb
cgitb.enable()

user = os.environ.get('SSL_CLIENT_S_DN_Email','').split('@')[0].strip()
kerberosHash = hash(user)
fullname = os.environ.get('SSL_CLIENT_S_DN_CN', user)

print '''
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
	<title>interface2</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
	<script src="sketchGraphs.js" text="javascript/text"></script>
</head>
<body>
	You are %(fullname)s
	<div id='test'></div><img id="answer1" src="lion.jpeg">
	<div id='test2'></div><img id="answer2" src="lion.jpeg">

</body>
<script text="javascript/text">
	window.onload = function () {
		var s;
		s = new SketchInterface(%(kerberosHash)s, 1, document.getElementById("test"), 600, 300, document.getElementById('answer1'));
		s.setAxes(-6, 6, 5, -5, 10, 1);	
		s = new SketchInterface(%(kerberosHash)s, 2, document.getElementById("test2"), 600, 300, document.getElementById('answer2'));
		s.setAxes(-1, 3, .5, -5, 10, 1);
		s.labelAxes('xaxis', 'yaxis');

	}
</script>
</html>
''' % {'user':user, 'fullname':fullname, 'kerberosHash':kerberosHash}
