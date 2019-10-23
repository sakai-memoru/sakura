var fs = new ActiveXObject("Scripting.FileSystemObject");
var sh = new ActiveXObject("WScript.Shell");

file_path = Editor.GetFilename();

sh.Run("typora.exe " + file_path, 1, false)

sh = null;
fs = null;
