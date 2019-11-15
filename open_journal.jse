(function(){

// CONST 
var CONS_LIBPATH = '';
var LIBS = [
  "./lib/date.jse",
]

// CONST 
var CONS_TARGET_FOLDER = "journal2";
var CONS_MACRO_FOR_INSERT = "insert_selected.jse";
var CONS_MACRO_FOR_NEW = "create_header_and_add_selected.jse";
var CONS_MACRO_FOLDER = "sakura";

function check_env(){
  // set env_name for targetting wsh, sakura, node
  var env_name = '';
  if (typeof(WScript) !== "undefined") env_name = 'wsh';
  if (typeof(Editor) !== "undefined") env_name = 'sakura';
  if (typeof(alert) !== "undefined") {env_name = 'browser';}
  else if (typeof(console) !== "undefined") env_name = 'node';
  return env_name;
}
var flag = check_env();

// load external libraries
if(flag == "wsh"||flag == "sakura"){
  var objFS = new ActiveXObject("Scripting.FileSystemObject");
  var lib_path = CONS_LIBPATH ? CONS_LIBPATH: './';
  // require common moduje
  with({
    libs : LIBS, 
    get_moduleCode : function(path){
      return objFS.OpenTextFile(path,1).ReadAll();
    }
  }) {
    for (i in libs){
      try {
        var module_path = objFS.BuildPath(lib_path,libs[i]);
        eval(get_moduleCode(module_path));
      } catch (e) {
        //console.log( e.description || e.message || "error" );
        null;
      }
    }
  };
  objFS = null;
}

function get_journalForToday(){
  var target_folder_name = CONS_TARGET_FOLDER;
  var objFS = new ActiveXObject("Scripting.FileSystemObject");
  var objShell = new ActiveXObject("WScript.Shell");
  var doc_folder = objShell.SpecialFolders("MyDocuments");
  var target_folder_path = objFS.BuildPath(doc_folder, target_folder_name);
  var time_str = get_todayString()
  var target_journal_path = objFS.BuildPath(target_folder_path, time_str + ".md");
  objShell = null;
  objFS = null;
  return target_journal_path
}

function create_textfile_by_force(path){
  var objFS = new ActiveXObject("Scripting.FileSystemObject");
  var parent_folder = objFS.GetParentFolderName(path);
  if(!objFS.FolderExists(parent_folder)){
    objFS.CreateFolder(parent_folder);
  }
  var objTS = objFS.OpenTextFile(path,2,true); // FIXME UTF-16 -> UTF-8
  objTS.Close();
  objTS = null;
  objFS = null;
}

function test_path_and_new(path){
  var objFS = new ActiveXObject("Scripting.FileSystemObject");
  var isExist = objFS.FileExists(path)
  if(isExist){
    null;
  } else {
    create_textfile_by_force(path);
  }
  objFS = null;
  return isExist;
}

function get_sakuraMacroPathForExist(isExist){
  if(isExist){
    var target_macro_name = CONS_MACRO_FOR_INSERT;
  } else {
    var target_macro_name = CONS_MACRO_FOR_NEW;
  }
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

function get_ClipBoardData(){ 
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
      selected = Editor.GetSelectedString(0);
      break;

    default:
        /* ignore */
        null;
        break;
  }
  return selected;
}

// journalファイルをsakuraで、macroを起動して開く 
function doProcess(){ 
  var target_journal_path = get_journalForToday();
  var isExist = test_path_and_new(target_journal_path);
  var str = get_ClipBoardData();
  Editor.SetClipboard(0,str);
  var target_macro_path = get_sakuraMacroPathForExist(isExist);
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
  doProcess();
  
} else {
  if(typeof(WScript) !== 'undefined'){
    WScript.Echo('[Warn] This script is for sakura macro. A env is maybe wsh.')
  } else {
    console.log('[Warn] This script is for sakura macro. A env is maybe node.')
  }
}

}())
