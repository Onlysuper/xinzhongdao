import HTTP from "./http.js";
const publicUrl="https://share.xmfstore.com/client/cdb/newXcx/"
export const postUserInfo=(url)=>{return (data)=>{return HTTP.POSTFORM(`${publicUrl}`,`User/Info.asp${url}`,data)}};