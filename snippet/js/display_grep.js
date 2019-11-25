var display_grep = function(text, target_file, target_dir, flag_sub){
  if(typeof(flag_sub) === 'undefined') flag_sub = true;
  
  // grep option
  var grepopt_str = "0000-0100-0111-0001" ; // include sub folders
  if(!flag_sub){
    grepopt_str =   "0000-0100-0111-0000" ; // not include sub folders
  }
  var StringUtil = exports.StringUtil;
  var grepopt = StringUtil.deleteChars(grepopt_str,'\-');
  var gopt = parseInt(grepopt,2);
  //console.log(grepopt);
  console.log(gopt);
  console.log(text);
  console.log(target_file);
  console.log(target_dir);
  Editor.Grep(text, target_file, target_dir, gopt);
}

