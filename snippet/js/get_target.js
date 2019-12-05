var get_target = function(expandParam){
  // $F : opened file's full path
  // $f : opened file's name
  // $e : opened file's folder path
  // $b : opened file's extention
  // $C : 選択中の場合、選択テキストの１行目のテキスト（改行コード除く）
  //      選択中でない場合、カーソル位置の単語
  // 引数無し : 選択されている場合、選択された文字列。
  //       選択されていない場合、Clipboardにある文字列
  // $Z : 独自expandPrameter : 全テキスト
  // $L : 独自expandPrameter : 行選択として取得
  var ret ='';
  if(typeof(expandParam) === 'undefined'){
    if(Editor.IsTextSelected){
      ret = Editor.GetSelectedString(0);
    }else{
      ret = Editor.GetClipboard(0);
    }
  } else {
    if(expandParam === '$Z'){
      Editor.SelectAll();
      ret = Editor.GetSelectedString(0);
      Editor.IsTextSelectingLock(0);
      Editor.ExpandParameter(expandParam)
    } else if (expandParam === '$L'){
      if(Editor.IsTextSelected){
        // line select
        var lineNum = get_seletedLineNumber();
        ret = get_lines(lineNum.start_line_num, lineNum.end_line_num);
        console.dir(lineNum);
        console.log('L186 :' + ret);
        select_lines(lineNum.start_line_num, lineNum.end_line_num);
      }
    } else {
      ret = Editor.ExpandParameter(expandParam)
    }
  }
  return ret;
};
