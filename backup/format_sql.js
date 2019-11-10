function formatSql(text){
  // 改行するキーワード
  var array=["AND","FROM","FULL","GROUP","INNER","LEFT","ON","ORDER","RIGHT","SET","WHERE","VALUES"];

  // キーワード共通処理
  for(i=0; i<array.length; i++){
    var keyword = array[i];
    var after = " " + keyword + " ";

    // キーワード前後の半角スペースを1つだけにする
    text = text.replace(new RegExp(" +" + keyword + " +", "g"), after);

    // この時点でキーワード"   AND  "は" AND "になる

    // 改行する
    var afterRn = "\r\n" + after;
    text = text.replace(new RegExp(after, "g"), afterRn);
  }

  // SELECT：後ろ改行
  text = text.replace(/SELECT/g, "SELECT\r\n");

  // カンマ：前後のスペース削除
  text = text.replace(/( +,|, +| +, +)/g, ",");
  // カンマ：改行（前カンマ）
  text = text.replace(/,/g, "\r\n , ");

  // かっこ：改行
  text = text.replace(/\(/g, "(\r\n");
  text = text.replace(/\)/g, "\r\n)\r\n");

  return text;
}

function process_ForSelected(){
  var selected = Editor.GetSelectedString(0);
  var str = formatSql(selected)
  if ( selected !== "" ) Editor.InsText(str);
}

process_ForSelected()

