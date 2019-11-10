var search_regx1 = '^'
var search_regx2 = '$'
var search_regx3 = '\t'
var replaced_str1 = '\| '
var replaced_str2 = ' \| '
var replaced_str3 = ' \|'

Editor.GetSelectedString(0);
Editor.ReplaceAll(search_regx1, replaced_str1, 4);
Editor.ReplaceAll(search_regx2, replaced_str2, 4);
Editor.ReplaceAll(search_regx3, replaced_str3, 4);
Editor.ReDraw(0);
