function _createAjax() {
    var xmlhttp = {};
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
}
//如果ajax支持进度并且options指定了进度函数，附加进度事件回调
function attachUploadProgress(xhr,options){
    if (xhr.upload&&options&&options.onProgress) {
        xhr.upload.onprogress = function progress(e) {
            if (e.total > 0) {
                e.percent = e.loaded / e.total * 100;
            }
            options.onProgress(e);
        };
    }
}
export function fetchAdapter(url, options) {
    options = Object.assign({}, options);
    try {
        //weex client ajax
        if (weex) {
            return new Promise((resolve, reject) => {
                var stream = weex.requireModule('stream');
                options.url = url;
                stream.fetch(options, (res) => {
                    if (res.ok) {
                        if (typeof res.data == "string") {
                            res.data = JSON.parse(res.data);
                        }
                        resolve(res.data, res.status, res.statusText);
                    } else {
                        reject(res.status, res.statusText);
                    }
                });
            });
        }
    } catch (ex) {
        // web client ajax
        return new Promise((resolve, reject) => {
            let xhr = _createAjax();
            attachUploadProgress(xhr,options);
            let method = options.method || "GET";
            xhr.open(method, url);
            if (options.headers) {
                for (let key in options.headers) {
                    xhr.setRequestHeader(key, options.headers[key]);
                }
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) {
                    return;
                }
                if (xhr.status == 200) {
                    let response = JSON.parse(xhr.response);
                    resolve(response);
                } else {
                    reject(new Error(xhr.response), xhr.status);
                }
            }
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
                fileTransfer.upload(fileObj, url, {
                    headers: options.headers,
                    method: "PUT"
                }, null, result => {
                    resolve();
                }, err => {
                    reject(err);
                });
            });
        }
    } catch (ex) {
        //web client upload
        return new Promise((resolve, reject) => {
            let xhr = _createAjax();
            attachUploadProgress(xhr,options);
            let method = options.method || "PUT";
            xhr.open(method, url, true);
            if (options.headers) {
                for (let key in options.headers) {
                    xhr.setRequestHeader(key, options.headers[key]);
                }
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) {
                    return;
                }
                if (xhr.status == 200) {
                    resolve();
                } else {
                    reject(new Error(xhr.response), xhr.status);
                }
            }
            xhr.send(fileObj);
        });
    }
}