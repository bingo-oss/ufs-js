function _createAjax() {
  var xmlhttp = {};
  if (XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  return xmlhttp;
}

// 如果ajax支持进度并且options指定了进度函数，附加进度事件回调
function attachUploadProgress(xhr, options) {
  if (xhr.upload && options && options.onProgress) {
    xhr.upload.onprogress = function progress(e) {
      if (e.total > 0) {
        e.percent = (e.loaded / e.total) * 100;
      }
      options.onProgress(e);
    };
  }
}

// 区分weex和web环境
export function fetchAdapter(url, options) {
  options = Object.assign({
    jsonParse: true,
    responseType: ""
  }, options);
  try {
    //weex client ajax
    if (weex) {
      return new Promise((resolve, reject) => {
        var stream = weex.requireModule("stream");
        options.url = url;
        stream.fetch(options, (res) => {
          if (res.ok) {
            if (typeof res.data == "string") {
              res.data = JSON.parse(res.data);
            }
            resolve(res.data);
          } else {
            reject(res);
          }
        });
      });
    }
  } catch (ex) {
    // web client ajax
    return new Promise((resolve, reject) => {
      let xhr = _createAjax();
      attachUploadProgress(xhr, options);
      let method = options.method || "GET";
      xhr.open(method, url);
      if (options.headers) {
        for (let key in options.headers) {
          xhr.setRequestHeader(key, options.headers[key]);
        }
      }
      xhr.responseType =  options.responseType;
      xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) {
          return;
        }
        if (xhr.status == 200) {
          let response = options.jsonParse ? JSON.parse(xhr.response) : xhr.response;
          resolve(response);
        } else {
          reject(xhr);
        }
      };
      if (options.body) {
        xhr.send(options.body);
      } else {
        xhr.send();
      }
    });
  }
}

export function uploadAdapter(url, options, fileObj) {
  options = Object.assign({}, options);
  try {
    //weex client upload
    if (weex) {
      return new Promise((resolve, reject) => {
        //用weex的方式上传文件
        let fileTransfer = weex.requireModule("FileTransferModule");
        fileTransfer.upload(
          fileObj,
          url,
          {
            headers: options.headers,
            method: "PUT",
          },
          null,
          (result) => {
            resolve(result);
          },
          (err) => {
            reject(err);
          }
        );
      });
    }
  } catch (ex) {
    //web client upload
    return new Promise((resolve, reject) => {
      let xhr = _createAjax();
      attachUploadProgress(xhr, options);
      let method = options.method || "PUT";
      xhr.open(method, url, true);
      if (options.headers) {
        for (let key in options.headers) {
          xhr.setRequestHeader(key, options.headers[key]);
        }
      }
      xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) {
          return;
        }
        if (xhr.status == 200) {
          resolve(xhr.response);
        } else {
          reject(xhr);
        }
      };
      xhr.send(fileObj);
    });
  }
}

function pathsJoin(...args) {
  let paths = [];
  let firstStartsWithSlash = false;
  if (args.length > 0) {
    firstStartsWithSlash = args[0].startsWith("/");
  }
  for (let el of args) {
    let t = el;
    if (el.endsWith("/")) {
      t = el.substr(0, el.length - 1);
    } else if (el.startsWith("/")) {
      t = el.substr(1, el.length);
    }
    paths.push(t);
  }
  let _path = paths.join("/");
  return firstStartsWithSlash ? `/${_path}` : _path;
}

export function rebuildUrlIfNecessary(url, options) {
  if (!url) {
    return url;
  }
  //兼容相对路径地址
  if (!url.startsWith("http") && options.baseUrl) {
    url = pathsJoin(options.baseUrl, url);
    return url;
  }
  return url;
}

export function getQuery(name, url) {
  let query;
  if (url) {
    query = url.split("?")[1];
  } else {
    query = window.location.search.substr(1);
  }
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] == name) {
      return decodeURIComponent(pair[1]);
    }
  }
  return null;
}