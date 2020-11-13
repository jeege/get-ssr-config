const urlReg =  /^(?:(http(s)?\:)?\/\/)?[A-Za-z0-9-]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/gi

const isUrl = (string) => {
    return urlReg.test(string)
}

const formatTime = (time, formatStr) => {
    const t = new Date(time);
    const obj = {
      YYYY: t.getFullYear(),
      MM: `${t.getMonth() + 1}`.padStart(2, "0"),
      DD: `${t.getDate() + 1}`.padStart(2, "0"),
      HH: `${t.getHours()}`.padStart(2, "0"),
      mm: `${t.getMinutes()}`.padStart(2, "0"),
      ss: `${t.getSeconds()}`.padStart(2, "0")
    };
    return formatStr.replace(/YYYY|MM|DD|HH|mm|ss/gi, val => {
      return obj[val];
    });
  };

const random = (n) => {
  let str = ''
  while(str.length < n){
    str += `${Math.random()}`.substr(2,n - str.length)
  }
  return str
}

module.exports = {
    isUrl,
    formatTime,
    random
}