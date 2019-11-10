//var file_path = Editor.GetFilename();
var file_path = Editor.ExpandParameter('$F');
Editor.SetClipboard(0, file_path)

