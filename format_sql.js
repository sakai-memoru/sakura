// 
// node で編集ファイルを実行する
function process(expandParam){ 
  var target_ = ''
  if(expandParam == '$CLIP'){
    target_ = Editor.GetClipboard(0);
  } else {
    //target_ = Editor.ExpandParameter(expandParam);
    null;
  }
  if(target_ !== ''){
    var cmd_statement = "G:\\Users\\sakai\\AppData\\Roaming\\sakura\\formatter\\sqlfix.exe " + target_
    Editor.ExecCommand('echo str = "' + cmd_statement + '"', 1);
    Editor.ExecCommand(cmd_statement, 1);

  }
}

// -------------- entry point
if(typeof(Editor) !== 'undefined'){
  // $F : opened file's full path
  // $f : opened file's name
  // $e : opened file's folder path
  // $b : opened file's extention
  // $C : 選択中の場合、選択テキストの１行目のテキスト（改行コード除く）
  //      選択中でない場合、カーソル位置の単語
  // $CLIP : clipboard 
  Editor.FileSave();
  process('$CLIP');
  
} else {
  if(typeof(WScript) !== 'undefined'){
    WScript.Echo('This script is for sakura macro. A env is maybe wsh.')
  } else {
    console.log('This script is for sakura macro. A env is maybe node.')
  }
}
