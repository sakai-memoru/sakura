var fs = new ActiveXObject("Scripting.FileSystemObject");
var sh = new ActiveXObject("WScript.Shell");

file_path = Editor.GetFilename();
var folder_path = fs.GetParentFolderName(file_path);

sh.Run("explorer.exe " + folder_path, 1, true)

sh = null;
fs = null;
