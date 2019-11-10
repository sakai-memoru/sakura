// 
// sakura macroを実行する
// 
function process(expandParam){ 
  var target_ = Editor.ExpandParameter(expandParam);
  var macro_path = target_;
  var macro_ext = "js";
  //Editor.InfoMsg(macro_path);
  Editor.ExecExternalMacro(macro_path);
}

// --------------------------------------- entry point
if(typeof(Editor) !== 'undefined'){
  // $F : opened file's full path
  // $f : opened file's name
  // $e : opened file's folder path
  // $b : opened file's extention
  // $C : 選択中の場合、選択テキストの１行目のテキスト（改行コード除く）
  //      選択中でない場合、カーソル位置の単語
  
  process('$f');

} else {
  if(typeof(WScript) !== 'undefined'){
    WScript.Echo('This script is for sakura macro. A env is maybe wsh.')
  } else {
    console.log('This script is for sakura macro. A env is maybe node.')
  }
}
