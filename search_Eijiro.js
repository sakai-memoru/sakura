// eijirou.js
// 選択範囲またはカーソル位置の単語で英辞郎on the Web英和・和英
var objIE =  new ActiveXObject("InternetExplorer.Application");
objIE.Visible = true;        // True
var strWord = Editor.ExpandParameter("$C");
var naviURL = "http://www2.alc.co.jp/ejr/index.php?word_in=" +
  strWord + "&word_in2=あいうえお&word_in3=PVawEWi72JXCKoa0Je";
objIE.Navigate( naviURL );
