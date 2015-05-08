#!/usr/bin/python
import os
import cgi
import cgitb
import dataFuncs
cgitb.enable()

form = cgi.FieldStorage()

if all([k in form for k in ['kerberosHash', 'problemID']]):
    kh = str(form['kerberosHash'].value)
    pid = str(form['problemID'].value)
    data = dataFuncs.getStudentProblemData(kh, pid)
    print '''
%(data)s''' % {'data':data}
else:
    print '''
{"error":'error. Missing data. Only received %(formKeys)s'}''' % {'formKeys':form.keys()}


