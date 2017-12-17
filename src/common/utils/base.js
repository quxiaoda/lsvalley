// 暴露的工具方法
// {
//   cookie: {get, set, remove}
//   url: {protocol, domain}
//   removeUrlKeyPair              删除指定url上的字段
//   getUrlKeyVal                  获取当前URL上指定参数值
//   getPlatform                   获取平台
//   addProtocol                   给url增加协议头
//   changeImgSize                 改变图片尺寸
// }


const baseUrl = window.location.href
const baseUrlProtocol = location.protocol
const baseUrlDomain = baseUrl.substr(0, baseUrl.indexOf(".com") + 4)

// cookie操作
const cookie = {
  get: function(name, encode) {
    const arg = name + "="
    const len = arg.length
    const cookieLen = document.cookie.length
    let i = 0,
      j = 0
    while(i < cookieLen) {
      j = i + len
      if(document.cookie.substring(i, j) === arg) {
        return this.getCookieVal(j, encode)
      }
      i = document.cookie.indexOf(' ', i) + 1
      if(i === 0) {
        break
      }
    }
    return ""
  }
  , set: function(name, value, expires, path, domain, secure) {
      const argv = arguments
      const argc = arguments.length
      const urlDomainArr = baseUrlDomain.split(".")
      const urlDomain = urlDomainArr[urlDomainArr.length - 2]
      //let expires = (argc > 2) ? argv[2] : null;
      const now = new Date();
      expires = (argc > 2) ? 
        new Date(new Date().getTime() + parseInt(expires) * 24 * 60 * 60 * 1000) 
        : new Date(now.getFullYear(), now.getMonth() + 1, now.getUTCDate())
      path = (argc > 3) ? argv[3] : '/'
      domain = (argc > 4) ? argv[4] : "." + urlDomain + ".com"
      secure = (argc > 5) ? argv[5] : false
      document.cookie = name + "=" + escape(value) 
        + ((expires == null) ? "" : ("; expires=" + expires.toGMTString()))
        + ((path == null) ? "" : ("; path=" + path)) 
        + ((domain == null) ? "" : ("; domain=" + domain)) 
        + ((secure == true) ? "; secure" : "")
  }
  , remove: function(name) {
        if(this.get(name)) {
          this.set(name, "", -1)
        }
  }
  , getCookieVal: function(offset, encode) {
      let endStr = document.cookie.indexOf(";", offset)
      if(endStr === -1) {
        endStr = document.cookie.length
      }
      if(!encode) {
        return document.cookie.substring(offset, endStr)
      }else {
        return unescape(document.cookie.substring(offset, endStr))
      }
  }
}
// 获取url信息
const url = {
  protocol: baseUrlProtocol,
  domain: baseUrlDomain
}

/**
* 删除指定url上的字段 
* @param  url   要替换的url
* @param  key   替换的字段
*/ 
export function removeUrlKeyPair(url, key) {
  const reg = new new RegExp(key + "=[^&]*", "gmi")
  url = url.replace(reg, "");
  if (url.indexOf('&') == url.length - 1) url = url.substring(0, url.length - 1)
  if (url.indexOf('?') == url.length - 1) url = url.substring(0, url.length - 1)
  url = url.replace("?&", "?").replace('&&', '&')
  return url
}

/**
* 获取当前URL上指定参数值 
* @param  name  要获取的参数名
*/ 
export function getUrlKeyVal(name) {
  const regex = new RegExp("[?&]" + encodeURIComponent(name) + "\\=([^&#]+)")
  const value = (location.search.match(regex) || ["", ""])[1]
  return decodeURIComponent(value)
}

/**
* 获取平台（微信 or m站 or 客户端） 
*/ 
export function getPlatform() {
  const ua = navigator.userAgent.toLowerCase();
  const mtvdi = cookie.get('mtvdi') || "";
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
      return "wx";
  } else if (mtvdi || (getUrlKeyVal("pub_page_from") == "zheclient")) {
      return "zheclient";
  } {
      return getUrlKeyVal('platformType') ? getUrlKeyVal('platformType') : "m";
  }
}

/**
*                                                                           

/**
* 改变图片大小
* @param img   图片路径
* @param size  目标尺寸
*/
export function changeImgSize(img, size) {
    var img_arr = img.split("/");
    var img_arr_length = img_arr.length;
    var img_name = img;
    if (img_arr_length > 1) {
        img_name = img_arr[img_arr_length - 1];
    }
    img_name = img_name.replace(".webp", "");
    var img_name_arr = img_name.split(".");
    if (img_name_arr.length == 3) {
        img_name_arr.splice(img_name_arr.length - 1, 0, size);
    }
    if (img_name_arr.length == 4) {
        img_name_arr.splice(img_name_arr.length - 2, 1, size);
    }
    var new_img_name = img_name_arr.join(".");
    return img.replace(img_name, new_img_name);
};

export {cookie, url}
