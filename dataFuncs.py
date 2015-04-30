import ast
import linecache

pathToStudentData = r'studentData/'

def getStudentData(kerberosHash): 
    fullPath = pathToStudentData + str(kerberosHash) + ".txt"
    try:
        f = open(fullPath, 'r')
    except:
        return {'kerberosHash':kerberosHash}
    
    ans = {'kerberosHash':kerberosHash}
    for line in f:
        if line[-1] == '\n':
            line = line[:len(line)-1]
        try:
            rep = ast.literal_eval(line)
        except SyntaxError:
            rep = None
        if rep != None and rep['kerberosHash'] == kerberosHash:
            ans = rep
            break
    f.close()
    return ans

def getStudentProblemData(kerberosHash, problemID):
    d = getStudentData(kerberosHash)
    return d.get(problemID, 'null')

def saveResponse(kerberosHash, problemID, data):
    fullPath = pathToStudentData + str(kerberosHash) + ".txt"
    try:
        f = open(fullPath, 'r')
        lines = f.readlines()
        f.close()
    except:
        lines = []
    rep = None
    for i in range(len(lines)):
        line = lines[i]
        if line[-1] == '\n':
            line = line[:len(line)-1]
        try:
            rep = ast.literal_eval(line)
        except:
            rep = None
        if rep != None and rep['kerberosHash'] == kerberosHash:
            lines.pop(i)
            break
    if rep == None or rep['kerberosHash'] != kerberosHash:
        rep = {'kerberosHash':kerberosHash}
    rep[problemID] = data
    lines.insert(0, str(rep) + '\n')
    f = open(fullPath, 'w')
    lines = "".join(lines)
    f.write(lines)
    f.close()


