// CONST 
var CONS_TARGET_FOLDER = "journal";
var CONS_MACRO_NAME = "insert_selected.js";
var CONS_MACRO_FOLDER = "sakura";

function getTodayString(){
  var dtm = new Date();
  return [
    ('' + dtm.getFullYear()).slice(-2),
    ('0' + (dtm.getMonth() +1)).slice(-2),
    ('0' + dtm.getDate()).slice(-2)
  ].join('');
}

function get_myjournal(){
  var target_folder_name = CONS_TARGET_FOLDER;
  var objFS = new ActiveXObject("Scripting.FileSystemObject");
  var objShell = new ActiveXObject("WScript.Shell");
  var doc_folder = objShell.SpecialFolders("MyDocuments");
  var target_folder_path = objFS.BuildPath(doc_folder, target_folder_name);
  var time_str = getTodayString()
  var target_journal_path = objFS.BuildPath(target_folder_path, time_str + ".md");
  objShell = null;
  objFS = null;
  return target_journal_path
}

function get_sakuraMacroPath(){
  var target_macro_name = CONS_MACRO_NAME;
  var target_folder_name = CONS_MACRO_FOLDER;
  var objFS = new ActiveXObject("Scripting.FileSystemObject");
  var objShell = new ActiveXObject("WScript.Shell");
  var appdata_folder = objShell.SpecialFolders("AppData");
  var target_folder_path = objFS.BuildPath(appdata_folder, target_folder_name);
  var target_macro_path = objFS.BuildPath(target_folder_path, target_macro_name);
  objShell = null;
  objFS = null;
  return target_macro_path
}

function set_ClipBoardData(){ 
  var selected = "";

  switch(Editor.IsTextSelected()) {
    // 非選択状態
    case 0:
      selected = Editor.ExpandParameter("$C");
      break;
    // 選択状態
    case 1:
    // ブロック選択状態
    case 2:
      selected = editor.GetSelectedString(0);
      break;

    default:
        /* ignore */
        null;
        break;
  }
  return selected;
}

// journalファイルをsakuraで、macroを起動して開く
function process(){ 
  var target_journal_path = get_myjournal();
  var target_macro_path = get_sakuraMacroPath();
  var str = set_ClipBoardData();
  Editor.SetClipboard(0,str);
  var cmd_statement = "sakura.exe " + target_journal_path + " -M=" + target_macro_path;
  
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
  process();
  
} else {
  if(typeof(WScript) !== 'undefined'){
    WScript.Echo('This script is for sakura macro. A env is maybe wsh.')
  } else {
    console.log('This script is for sakura macro. A env is maybe node.')
  }
}

