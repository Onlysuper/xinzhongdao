import HTTP from "./http.js";
import I18n from '../i18n.js';
const langs = I18n.getLanguage()
const publicUrl="https://share.xmfstore.com/client/cdb/newXcx/"
// 用户登录
export const postMap=()=>{return (data)=>{ return HTTP.POST(`${publicUrl}`,`map/map.asp?language=${langs['lang_type']}`,data)}};