function process(file_path){
  var objShell = new ActiveXObject("WScript.Shell");

  Editor.InfoMsg(folder_path);
  objShell.CurrentDirectory = folder_path;
  objShell.Run("powershell.exe ", 1, false);

  sh = null;
  fs = null;
}

// 
// powershell で編集フォルダをworkdirectoryとして開く
function process(expandParam){
  target_path = Editor.ExpandParameter(expandParam);
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
  process('$e');
  
} else {
  if(typeof(WScript) !== 'undefined'){
    WScript.Echo('This script is for sakura macro. A env is maybe wsh.')
  } else {
    console.log('This script is for sakura macro. A env is maybe node.')
  }
}

