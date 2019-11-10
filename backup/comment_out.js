var search_regx = '(^[\\s]*)'
var replaced_str = '${1}## '

Editor.GetSelectedString(0);
Editor.ReplaceAll(search_regx, replaced_str, 132);
Editor.ReDraw(0);
