var get_template = function(herestrings, sep){
  sep = sep || '\r\n';
  var template = herestrings.toString().split(sep).slice(2,-2).join(sep);
  return template;
};

