/**
 * 隐藏：人非草芥
 * 日期：2018/03/06
 * 时间：22:02
 * 作用：格式化时间 此处打码
 */

export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'ms': date.getMilliseconds()
    //.getMilliseconds();
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

export function dateTimeFormat(longTypeDate){
  var datetimeType = "";
  var date = new Date();
  date.setTime(longTypeDate);
  datetimeType+= date.getFullYear();   //年
  datetimeType+= "-" + getMonth(date); //月
  datetimeType += "-" + getDay(date);   //日
  datetimeType+= "&nbsp;&nbsp;" + getHours(date);   //时
  datetimeType+= ":" + getMinutes(date);      //分
  datetimeType+= ":" + getSeconds(date);      //分
  return datetimeType;
}
