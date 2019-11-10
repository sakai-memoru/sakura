var search_regx = '^$\r\n'
var replaced_str = ''

Editor.GetSelectedString(0);
Editor.ReplaceAll(search_regx, replaced_str, 4);
Editor.ReDraw(0);
