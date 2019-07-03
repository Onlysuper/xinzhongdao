let I18n = {
  locale : null,
  locales : {},           //语言包内容
  langCode : ['zh_jian','zh_fan','en'] 
}
 
I18n.registerLocale = function(locales){
  I18n.locales = locales;      //将语言包里的对象赋给当前对象的locales属性
}
 
I18n.setLocale = function(code){
  I18n.locale = code;          //存储当前语言的种类('zh_jian'或者'zh_fan')
}
 
I18n.setLocaleByIndex = function(index){
  I18n.setLocale(I18n.langCode[index]);
}
 
I18n.getLanguage = function(){
  return I18n.locales[I18n.locale];
}
 
 
export default I18n;
