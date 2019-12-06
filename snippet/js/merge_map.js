var merge_map = function(template, map_){
  for (var key_ in map_){
    if(map_.hasOwnProperty(key_)){
      // console.log("L148 : key_ = " + key_);
      // console.log("L149 : map_[key_] = " + map_[key_]);
      var regx = new RegExp('{{' + key_ + '}}',"gim");
      template = template.replace(regx, map_[key_]);
    }
  }
  return template;
}
