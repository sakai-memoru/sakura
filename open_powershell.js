(function(){

// 
// powershell で編集フォルダをworkdirectoryとして開く
function doProcess(expandParam){
  var target_path = Editor.ExpandParameter(expandParam);
  var objShell = new ActiveXObject("WScript.Shell");
  objShell.CurrentDirectory = target_path;
  var cmd_statement = "powershell.exe -noprofile "
  Editor.ExecCommand(cmd_statement, 0)
}

// -------------- entry point
if(typeof(Editor) !== 'undefined'){
  // $F : opened file's full path
  // $f : opened file's name
  // $e : opened file's folder path
  // $b : opened file's extention
  // $C : 選択中の場合、選択テキストの１行目のテキスト（改行コード除く）
  //      選択中でない場合、カーソル位置の単語
  doProcess('$e');
  
} else {
  if(typeof(WScript) !== 'undefined'){
    WScript.Echo('[Warn] This script is for sakura macro. A env is maybe wsh.')
  } else {
    console.log('[Warn] This script is for sakura macro. A env is maybe node.')
  }
}

}())
