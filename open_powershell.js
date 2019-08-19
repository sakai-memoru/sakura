var fs = new ActiveXObject("Scripting.FileSystemObject");
var sh = new ActiveXObject("WScript.Shell");

file_path = Editor.GetFilename();
var folder_path = fs.GetParentFolderName(file_path);

sh.CurrentDirectory = folder_path
sh.Run("powershell.exe ", 1, true)

sh = null;
fs = null;
