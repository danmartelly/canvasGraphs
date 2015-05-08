#!/usr/bin/python
import os
import cgi
import cgitb
import dataFuncs
cgitb.enable()

form = cgi.FieldStorage()

if all([k in form for k in ['saveData', 'kerberosHash', 'problemID']]):
    d = str(form['saveData'].value)
    kh = str(form['kerberosHash'].value)
    pid = str(form['problemID'].value)
    dataFuncs.saveResponse(kh, pid, d)
    print '''
success. Data received: %(formKeys)s
''' % {'formKeys':form.keys()}
else:
    print '''
{"error": 'Missing data. Only received %(formKeys)s'}
''' % {'formKeys':form.keys()}


