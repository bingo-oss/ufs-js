/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./test/webtest.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/common.js":
/*!***********************!*\
  !*** ./src/common.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fetchAdapter = fetchAdapter;
exports.uploadAdapter = uploadAdapter;
function _createAjax() {
    var xmlhttp = {};
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
}

function fetchAdapter(url, options) {
    options = Object.assign({}, options);
    try {
        //weex client ajax
        if (weex) {
            return new Promise(function (resolve, reject) {
                var stream = weex.requireModule('stream');
                options.url = url;
                stream.fetch(options, function (res) {
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
        return new Promise(function (resolve, reject) {
            var xhr = _createAjax();
            var method = options.method || "GET";
            xhr.open(method, url);
            if (options.headers) {
                for (var key in options.headers) {
                    xhr.setRequestHeader(key, options.headers[key]);
                }
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) {
                    return;
                }
                if (xhr.status == 200) {
                    var response = JSON.parse(xhr.response);
                    resolve(response);
                } else {
                    reject(new Error(xhr.response));
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

function uploadAdapter(url, options, fileObj) {
    options = Object.assign({}, options);
    try {
        //weex client upload
        if (weex) {
            return new Promise(function (resolve, reject) {
                //用weex的方式上传文件
                var fileTransfer = weex.requireModule("FileTransferModule");
                fileTransfer.upload(fileObj, url, {
                    headers: options.headers,
                    method: "PUT"
                }, null, function (result) {
                    resolve();
                }, function (err) {
                    reject(err);
                });
            });
        }
    } catch (ex) {
        //web client upload
        return new Promise(function (resolve, reject) {
            var xhr = _createAjax();
            var method = options.method || "PUT";
            xhr.open(method, url, true);
            if (options.headers) {
                for (var key in options.headers) {
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
                    reject(new Error(xhr.response));
                }
            };
            xhr.send(fileObj);
        });
    }
}

/***/ }),

/***/ "./src/ufs.js":
/*!********************!*\
  !*** ./src/ufs.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConvertClient = exports.StorageClient = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = __webpack_require__(/*! ./common */ "./src/common.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *  UFS 文件存储客户端
 */
var StorageClient = exports.StorageClient = function () {
    /**
     *  构造函数
     * @param {string} url 服务器 URL
     * @param {Object} options 选项
     * @param {(string|function)} options.accessToken 访问令牌
     */
    function StorageClient(url, options) {
        _classCallCheck(this, StorageClient);

        this.url = url;
        if (options) {
            if (options.accessToken) {
                this.accessToken = options.accessToken;
            }
        }
    }

    /**
     * 发送请求
     * @param {string} url 请求URL
     * @param {Object} options 选项
     */


    _createClass(StorageClient, [{
        key: "fetch",
        value: function fetch(url, options) {
            var headers = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.accessToken
            };
            options.headers = Object.assign({}, options.headers, headers);
            return (0, _common.fetchAdapter)(url, options);
        }

        /**
         * 获取指定的文件信息
         * @param {string} fileId 文件 ID
         * @returns {Promise<FileStatus>}  See {@link https://docs.bingosoft.net/paas/ufs/api/storage/_book/definitions.html#file_status}
         */

    }, {
        key: "status",
        value: function status(fileId) {
            var url = this.url + "/file/" + fileId;
            return this.fetch(url);
        }

        /**
         * 获取指定文件的响应头信息
         * @param {string} fileId 文件 ID
         */

    }, {
        key: "getResponseHeaders",
        value: function getResponseHeaders(fileId) {
            var url = this.url + "/file/" + fileId + "/responseHeaders";
            return this.fetch(url);
        }

        /**
         * 获取指定文件的元数据信息
         * @param {string} fileId 文件 ID
         */

    }, {
        key: "getMetadata",
        value: function getMetadata(fileId) {
            var url = this.url + "/file/" + fileId + "/metadata";
            return this.fetch(url);
        }

        /**
         *  上传签名
         * @param {Object} request 要进行签名的上传请求
         * @param {string} request.storage 要使用存储引擎名称
         * @param {Object} request.file 文件对象，例如：document.getElementById("fileInput").files[0]
         * @param {Object} request.requestHeaders 要签名的请求头
         * @param {Object} request.requestParameters 要签名的请求参数
         * @returns {Promise<UploadSignResult>} 已经成功上传的文件信息，See {@link https://docs.bingosoft.net/paas/ufs/api/storage/_book/definitions.html#uploadsignresult}
         */

    }, {
        key: "generatePresignedUpload",
        value: function generatePresignedUpload(request) {
            var url = this.url + "/file/upload/sign";
            var body = JSON.stringify({
                "requestHeaders": request.requestHeaders,
                "requestParameters": request.requestParameters,
                "storage": request.storage
            });
            return this.fetch(url, {
                method: "POST",
                body: body
            });
        }

        /**
         * 上传文件(先进行签名)
         * @param {Object} request 上传请求对象
         * @param {string} request.storage 要使用存储引擎名称
         * @param {Object} request.file 文件对象，例如：document.getElementById("fileInput").files[0]
         * @param {string} request.contentTpe 文件内容类型
         * @param {string} request.accessControl 文件的访问权限，PRIVATE、PUBLIC_READ、PUBLIC_READWRITE
         * @param {Object} request.metadata 文件元数据
         * @param {Object} request.requestHeaders 要签名的请求头
         * @param {Object} request.requestParameters 要签名的请求参数
         * @param {Object} request.responseHeaders 以后进行文件下载时，文件的 HTTP Response Headers
         * @returns {Promise<FileStatus>} 已经成功上传的文件信息，See {@link https://docs.bingosoft.net/paas/ufs/api/storage/_book/definitions.html#file_status}
         */

    }, {
        key: "upload",
        value: function upload(request) {
            var _this = this;

            request = request || {};
            //获取文件签名
            return this.generatePresignedUpload(request).then(function (res) {
                if (typeof res == "string") {
                    res = JSON.parse(res);
                }
                if (res.url) {
                    var options = {
                        headers: res.headers
                        //上传文件
                    };return (0, _common.uploadAdapter)(res.url, options, request.file).then(function () {
                        return new Promise(function (resolve, reject) {
                            resolve(res.uploadId);
                        });
                    });
                }
            }).then(function (uploadId) {
                //提交commit
                var url = _this.url + "/file/upload/commit";
                var body = JSON.stringify({
                    "storage": request.storage,
                    "uploadId": uploadId,
                    "contentType": request.contentType,
                    "accessControl": request.accessControl,
                    "responseHeaders": request.responseHeaders,
                    "metadata": request.metadata
                });
                return _this.fetch(url, {
                    method: "POST",
                    body: body
                });
            });
        }

        /**
         * 签名文件下载请求，并返回产生的文件下载 URL信息（object)
         * @param {Object} request 请求信息
         * @param {string} request.fileId 文件 ID
         * @param {Object} request.requestHeaders 要进行签要的 HTTP 请求头
         * @param {Object} request.requestParameters 要进行签名的 HTTP QUERY 参数
         * @param {Object} request.responseHeaderOverrides 下载时要重写的文件 HTTP Response Headers
         * @returns {Promise<String>} 下载地址 URL
         */

    }, {
        key: "urlFor",
        value: function urlFor(request) {
            var url = this.url + "/file/download/sign";
            var body = JSON.stringify(request);
            return this.fetch(url, {
                method: "POST",
                body: body
            });
        }

        /**
         * 删除文件
         * @param {string} fileId 文件 ID
         * @returns {Promise} 
         */

    }, {
        key: "delete",
        value: function _delete(fileId) {
            var url = this.url + "/file";
            var body = JSON.stringify({
                fileId: fileId
            });
            return this.fetch(url, {
                method: "DELETE",
                body: body
            });
        }
    }]);

    return StorageClient;
}();

/**
 * UFS 文件转换客户端
 */


var ConvertClient = exports.ConvertClient = function () {
    /**
     *  构造函数
     * @param {string} url UFS 服务器 URL
     * @param {string} appId 应用 ID
     * @param {Object} options 选项
     * @param {(string|function)} options.accessToken 访问令牌
     */
    function ConvertClient(url, appId, options) {
        _classCallCheck(this, ConvertClient);

        this.url = url;
        this.appId = appId;
        if (options) {
            if (options.accessToken) {
                this.accessToken = options.accessToken;
            }
        }
    }

    /**
     * 发送请求
     * @param {string} url 请求URL
     * @param {Object} options 选项
     */


    _createClass(ConvertClient, [{
        key: "fetch",
        value: function fetch(url, options) {
            var headers = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.accessToken,
                "x-appId": this.appId
            };
            options.headers = Object.assign({}, options.headers, headers);
            return (0, _common.fetchAdapter)(url, options);
        }

        /**
         * 添加文件转换作业，See {@link https://docs.bingosoft.net/paas/ufs/api/convert/_book/definitions.html#convertrequest}
         * @param {Object} request 请求信息
         * @returns {Promise<ConvertStatus>}  See {@link https://docs.bingosoft.net/paas/ufs/api/convert/_book/definitions.html#convertstatus}
         */

    }, {
        key: "enqueue",
        value: function enqueue(request) {
            var url = this.url + "/convert";
            var body = JSON.stringify(request);
            return this.fetch(url, {
                method: "POST",
                body: body
            });
        }

        /**
         * 获取指定的转换作业情况
         * @param {string} fileId 文件 ID
         * @param {string} kind 转换种类
         * @param {string} name 转换名称
         * @returns {Promise<ConvertStatus>}  See {@link https://docs.bingosoft.net/paas/ufs/api/convert/_book/definitions.html#convertstatus}
         */

    }, {
        key: "status",
        value: function status(fileId, kind, name) {
            var url = this.url + "/convert?fileId=" + fileId + "&kind=" + kind + "&name=" + name;
            return this.fetch(url);
        }

        /**
         * 估算转换作业耗时
         * @param {string} fileId 文件 ID
         * @param {string} kind 转换种类
         * @param {string} params 转换参数
         * @returns {Promise<number>} 耗时（毫秒）
         */

    }, {
        key: "estimatedTime",
        value: function estimatedTime(fileId, kind, params) {
            var url = this.url + "/convert/estimateTime?fileId=" + fileId + "&kind=" + kind;
            if (params) {
                url += "&params=" + encodeURIComponent(params);
            }
            return this.fetch(url);
        }
    }]);

    return ConvertClient;
}();

//weex下window报错


try {
    if (window && !window["ufs"]) {
        window.ufs = {
            StorageClient: StorageClient,
            ConvertClient: ConvertClient
        };
    }
} catch (ex) {
    //todo
}

/***/ }),

/***/ "./test/webtest.js":
/*!*************************!*\
  !*** ./test/webtest.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ufs = __webpack_require__(/*! ../src/ufs */ "./src/ufs.js");

var apiServer = "http://ufs-dev.bingosoft.net/api/";
var ssoServer = "http://10.201.78.206/sso";
var username = "admin";
var password = "cj123456";
var clientId = "apigw";
var clientSecret = "apigw";

//打印日志
var printLog = function printLog(log, clear) {
    if (!clear) {
        var oLog = document.getElementById("result").innerHTML;
        log = oLog === '' ? "" + log : oLog + "</br>" + log;
    }
    document.getElementById("result").innerHTML = log;
};

//拿到accesstoken
var prepare = function prepare() {
    var formData = "grant_type=password&username=" + username + "&password=" + password + "&client_id=" + clientId + "&client_secret=" + clientSecret;
    return fetch(ssoServer + "/oauth2/token", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    }).then(function (response) {
        return response.json();
    }).then(function (body) {
        var config = {
            url: apiServer,
            accessToken: body.access_token
        };
        printLog("AccessToken: " + body.access_token);
        //构建client
        return new _ufs.StorageClient(config.url, {
            accessToken: config.accessToken
        });
    }).catch(function (err) {
        printLog(err);
    });
};

//执行上传
var uploadTest = function uploadTest(file) {
    prepare().then(function (storageClient) {
        if (!storageClient) return;
        storageClient.upload({
            file: file
        }).then(function (fileStatus) {
            printLog("\u4E0A\u4F20\u7ED3\u679C: " + JSON.stringify(fileStatus));

            return storageClient.urlFor({
                fileId: fileStatus.id
            }).then(function (res) {
                printLog("\u6587\u4EF6\u8DEF\u5F84: " + res.url);
            });
        });
    });
};

if (window) {
    window.ufsUploadTest = uploadTest;
}

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdWZzLmpzIiwid2VicGFjazovLy8uL3Rlc3Qvd2VidGVzdC5qcyJdLCJuYW1lcyI6WyJmZXRjaEFkYXB0ZXIiLCJ1cGxvYWRBZGFwdGVyIiwiX2NyZWF0ZUFqYXgiLCJ4bWxodHRwIiwid2luZG93IiwiWE1MSHR0cFJlcXVlc3QiLCJBY3RpdmVYT2JqZWN0IiwidXJsIiwib3B0aW9ucyIsIk9iamVjdCIsImFzc2lnbiIsIndlZXgiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInN0cmVhbSIsInJlcXVpcmVNb2R1bGUiLCJmZXRjaCIsInJlcyIsIm9rIiwiZGF0YSIsIkpTT04iLCJwYXJzZSIsInN0YXR1cyIsInN0YXR1c1RleHQiLCJleCIsInhociIsIm1ldGhvZCIsIm9wZW4iLCJoZWFkZXJzIiwia2V5Iiwic2V0UmVxdWVzdEhlYWRlciIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlYWR5U3RhdGUiLCJyZXNwb25zZSIsIkVycm9yIiwiYm9keSIsInNlbmQiLCJmaWxlT2JqIiwiZmlsZVRyYW5zZmVyIiwidXBsb2FkIiwiZXJyIiwiU3RvcmFnZUNsaWVudCIsImFjY2Vzc1Rva2VuIiwiZmlsZUlkIiwicmVxdWVzdCIsInN0cmluZ2lmeSIsInJlcXVlc3RIZWFkZXJzIiwicmVxdWVzdFBhcmFtZXRlcnMiLCJzdG9yYWdlIiwiZ2VuZXJhdGVQcmVzaWduZWRVcGxvYWQiLCJ0aGVuIiwiZmlsZSIsInVwbG9hZElkIiwiY29udGVudFR5cGUiLCJhY2Nlc3NDb250cm9sIiwicmVzcG9uc2VIZWFkZXJzIiwibWV0YWRhdGEiLCJDb252ZXJ0Q2xpZW50IiwiYXBwSWQiLCJraW5kIiwibmFtZSIsInBhcmFtcyIsImVuY29kZVVSSUNvbXBvbmVudCIsInVmcyIsImFwaVNlcnZlciIsInNzb1NlcnZlciIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJjbGllbnRJZCIsImNsaWVudFNlY3JldCIsInByaW50TG9nIiwibG9nIiwiY2xlYXIiLCJvTG9nIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImlubmVySFRNTCIsInByZXBhcmUiLCJmb3JtRGF0YSIsImpzb24iLCJjb25maWciLCJhY2Nlc3NfdG9rZW4iLCJjYXRjaCIsInVwbG9hZFRlc3QiLCJzdG9yYWdlQ2xpZW50IiwiZmlsZVN0YXR1cyIsInVybEZvciIsImlkIiwidWZzVXBsb2FkVGVzdCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FDeEVnQkEsWSxHQUFBQSxZO1FBbURBQyxhLEdBQUFBLGE7QUE3RGhCLFNBQVNDLFdBQVQsR0FBdUI7QUFDbkIsUUFBSUMsVUFBVSxFQUFkO0FBQ0EsUUFBSUMsT0FBT0MsY0FBWCxFQUEyQjtBQUN2QkYsa0JBQVUsSUFBSUUsY0FBSixFQUFWO0FBQ0gsS0FGRCxN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QUFPdEM7QUFEYSxTQUE5QixDQUFQO0FBR0gsS0FsQk0sRUFrQkp3QyxLQWxCSSxDQWtCRSxlQUFLO0FBQ1ZaLGlCQUFTOUIsR0FBVDtBQUNILEtBcEJNLENBQVA7QUFxQkgsQ0F2QkQ7O0FBeUJBO0FBQ0EsSUFBSTJDLGFBQWEsU0FBYkEsVUFBYSxDQUFDaEMsSUFBRCxFQUFVO0FBQ3ZCMEIsY0FBVTNCLElBQVYsQ0FBZSx5QkFBaUI7QUFDNUIsWUFBRyxDQUFDa0MsYUFBSixFQUFrQjtBQUNsQkEsc0JBQWM3QyxNQUFkLENBQXFCO0FBQ2pCWSxrQkFBTUE7QUFEVyxTQUFyQixFQUVHRCxJQUZILENBRVEsc0JBQWM7QUFDbEJvQixvREFBa0JsRCxLQUFLeUIsU0FBTCxDQUFld0MsVUFBZixDQUFsQjs7QUFFQSxtQkFBT0QsY0FBY0UsTUFBZCxDQUFxQjtBQUN4QjNDLHdCQUFRMEMsV0FBV0U7QUFESyxhQUFyQixFQUVKckMsSUFGSSxDQUVDLGVBQU87QUFDWG9CLHdEQUFrQnJELElBQUlYLEdBQXRCO0FBQ0gsYUFKTSxDQUFQO0FBS0gsU0FWRDtBQVdILEtBYkQ7QUFjSCxDQWZEOztBQWlCQSxJQUFJSCxNQUFKLEVBQVk7QUFDUkEsV0FBT3FGLGFBQVAsR0FBdUJMLFVBQXZCO0FBQ0gsQyIsImZpbGUiOiJ3ZWJ0ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi90ZXN0L3dlYnRlc3QuanNcIik7XG4iLCJmdW5jdGlvbiBfY3JlYXRlQWpheCgpIHtcbiAgICB2YXIgeG1saHR0cCA9IHt9O1xuICAgIGlmICh3aW5kb3cuWE1MSHR0cFJlcXVlc3QpIHtcbiAgICAgICAgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHhtbGh0dHAgPSBuZXcgQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxIVFRQXCIpO1xuICAgIH1cbiAgICByZXR1cm4geG1saHR0cDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoQWRhcHRlcih1cmwsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyk7XG4gICAgdHJ5IHtcbiAgICAgICAgLy93ZWV4IGNsaWVudCBhamF4XG4gICAgICAgIGlmICh3ZWV4KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBzdHJlYW0gPSB3ZWV4LnJlcXVpcmVNb2R1bGUoJ3N0cmVhbScpO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMudXJsID0gdXJsO1xuICAgICAgICAgICAgICAgIHN0cmVhbS5mZXRjaChvcHRpb25zLCAocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMub2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzLmRhdGEgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5kYXRhID0gSlNPTi5wYXJzZShyZXMuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlcy5kYXRhLCByZXMuc3RhdHVzLCByZXMuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocmVzLnN0YXR1cywgcmVzLnN0YXR1c1RleHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIC8vIHdlYiBjbGllbnQgYWpheFxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IHhociA9IF9jcmVhdGVBamF4KCk7XG4gICAgICAgICAgICBsZXQgbWV0aG9kID0gb3B0aW9ucy5tZXRob2QgfHwgXCJHRVRcIjtcbiAgICAgICAgICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgb3B0aW9ucy5oZWFkZXJzW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlICE9IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKHhoci5yZXNwb25zZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmJvZHkpIHtcbiAgICAgICAgICAgICAgICB4aHIuc2VuZChvcHRpb25zLmJvZHkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGxvYWRBZGFwdGVyKHVybCwgb3B0aW9ucywgZmlsZU9iaikge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKTtcbiAgICB0cnkge1xuICAgICAgICAvL3dlZXggY2xpZW50IHVwbG9hZFxuICAgICAgICBpZiAod2VleCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAvL+eUqHdlZXjnmoTmlrnlvI/kuIrkvKDmlofku7ZcbiAgICAgICAgICAgICAgICBsZXQgZmlsZVRyYW5zZmVyID0gd2VleC5yZXF1aXJlTW9kdWxlKFwiRmlsZVRyYW5zZmVyTW9kdWxlXCIpO1xuICAgICAgICAgICAgICAgIGZpbGVUcmFuc2Zlci51cGxvYWQoZmlsZU9iaiwgdXJsLCB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IG9wdGlvbnMuaGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiXG4gICAgICAgICAgICAgICAgfSwgbnVsbCwgcmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAvL3dlYiBjbGllbnQgdXBsb2FkXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgeGhyID0gX2NyZWF0ZUFqYXgoKTtcbiAgICAgICAgICAgIGxldCBtZXRob2QgPSBvcHRpb25zLm1ldGhvZCB8fCBcIlBVVFwiO1xuICAgICAgICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuaGVhZGVycykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBvcHRpb25zLmhlYWRlcnNba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgIT0gNCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcih4aHIucmVzcG9uc2UpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB4aHIuc2VuZChmaWxlT2JqKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSIsImltcG9ydCB7ZmV0Y2hBZGFwdGVyLHVwbG9hZEFkYXB0ZXJ9IGZyb20gXCIuL2NvbW1vblwiO1xyXG5cclxuLyoqXHJcbiAqICBVRlMg5paH5Lu25a2Y5YKo5a6i5oi356uvXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU3RvcmFnZUNsaWVudCB7XHJcbiAgICAvKipcclxuICAgICAqICDmnoTpgKDlh73mlbBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwg5pyN5Yqh5ZmoIFVSTFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg6YCJ6aG5XHJcbiAgICAgKiBAcGFyYW0geyhzdHJpbmd8ZnVuY3Rpb24pfSBvcHRpb25zLmFjY2Vzc1Rva2VuIOiuv+mXruS7pOeJjFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmwsIG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLnVybCA9IHVybDtcclxuICAgICAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5hY2Nlc3NUb2tlbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IG9wdGlvbnMuYWNjZXNzVG9rZW47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlj5HpgIHor7fmsYJcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwg6K+35rGCVVJMXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyDpgInpoblcclxuICAgICAqL1xyXG4gICAgZmV0Y2godXJsLCBvcHRpb25zKSB7XHJcbiAgICAgICAgbGV0IGhlYWRlcnMgPSB7XHJcbiAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6XCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgIFwiQXV0aG9yaXphdGlvblwiOlwiQmVhcmVyIFwiICsgdGhpcy5hY2Nlc3NUb2tlblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgb3B0aW9ucy5oZWFkZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucy5oZWFkZXJzLCBoZWFkZXJzKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2hBZGFwdGVyKHVybCxvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluaMh+WumueahOaWh+S7tuS/oeaBr1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVJZCDmlofku7YgSURcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPEZpbGVTdGF0dXM+fSAgU2VlIHtAbGluayBodHRwczovL2RvY3MuYmluZ29zb2Z0Lm5ldC9wYWFzL3Vmcy9hcGkvc3RvcmFnZS9fYm9vay9kZWZpbml0aW9ucy5odG1sI2ZpbGVfc3RhdHVzfVxyXG4gICAgICovXHJcbiAgICBzdGF0dXMoZmlsZUlkKSB7XHJcbiAgICAgICAgbGV0IHVybCA9IGAke3RoaXMudXJsfS9maWxlLyR7ZmlsZUlkfWA7IFxyXG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoKHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bmjIflrprmlofku7bnmoTlk43lupTlpLTkv6Hmga9cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSWQg5paH5Lu2IElEXHJcbiAgICAgKi9cclxuICAgIGdldFJlc3BvbnNlSGVhZGVycyhmaWxlSWQpIHtcclxuICAgICAgICBsZXQgdXJsID0gYCR7dGhpcy51cmx9L2ZpbGUvJHtmaWxlSWR9L3Jlc3BvbnNlSGVhZGVyc2A7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2godXJsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluaMh+WumuaWh+S7tueahOWFg+aVsOaNruS/oeaBr1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVJZCDmlofku7YgSURcclxuICAgICAqL1xyXG4gICAgZ2V0TWV0YWRhdGEoZmlsZUlkKSB7XHJcbiAgICAgICAgbGV0IHVybCA9IGAke3RoaXMudXJsfS9maWxlLyR7ZmlsZUlkfS9tZXRhZGF0YWA7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2godXJsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqICDkuIrkvKDnrb7lkI1cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXF1ZXN0IOimgei/m+ihjOetvuWQjeeahOS4iuS8oOivt+axglxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3Quc3RvcmFnZSDopoHkvb/nlKjlrZjlgqjlvJXmk47lkI3np7BcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXF1ZXN0LmZpbGUg5paH5Lu25a+56LGh77yM5L6L5aaC77yaZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlSW5wdXRcIikuZmlsZXNbMF1cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXF1ZXN0LnJlcXVlc3RIZWFkZXJzIOimgeetvuWQjeeahOivt+axguWktFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3QucmVxdWVzdFBhcmFtZXRlcnMg6KaB562+5ZCN55qE6K+35rGC5Y+C5pWwXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxVcGxvYWRTaWduUmVzdWx0Pn0g5bey57uP5oiQ5Yqf5LiK5Lyg55qE5paH5Lu25L+h5oGv77yMU2VlIHtAbGluayBodHRwczovL2RvY3MuYmluZ29zb2Z0Lm5ldC9wYWFzL3Vmcy9hcGkvc3RvcmFnZS9fYm9vay9kZWZpbml0aW9ucy5odG1sI3VwbG9hZHNpZ25yZXN1bHR9XHJcbiAgICAgKi9cclxuICAgIGdlbmVyYXRlUHJlc2lnbmVkVXBsb2FkKHJlcXVlc3QpIHtcclxuICAgICAgICBsZXQgdXJsID0gYCR7dGhpcy51cmx9L2ZpbGUvdXBsb2FkL3NpZ25gO1xyXG4gICAgICAgIGxldCBib2R5ID0gSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICBcInJlcXVlc3RIZWFkZXJzXCI6IHJlcXVlc3QucmVxdWVzdEhlYWRlcnMsXHJcbiAgICAgICAgICAgIFwicmVxdWVzdFBhcmFtZXRlcnNcIjogcmVxdWVzdC5yZXF1ZXN0UGFyYW1ldGVycyxcclxuICAgICAgICAgICAgXCJzdG9yYWdlXCI6IHJlcXVlc3Quc3RvcmFnZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoKHVybCwge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIGJvZHk6IGJvZHlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOS4iuS8oOaWh+S7tijlhYjov5vooYznrb7lkI0pXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdCDkuIrkvKDor7fmsYLlr7nosaFcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0LnN0b3JhZ2Ug6KaB5L2/55So5a2Y5YKo5byV5pOO5ZCN56ewXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdC5maWxlIOaWh+S7tuWvueixoe+8jOS+i+Wmgu+8mmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZUlucHV0XCIpLmZpbGVzWzBdXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcmVxdWVzdC5jb250ZW50VHBlIOaWh+S7tuWGheWuueexu+Wei1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3QuYWNjZXNzQ29udHJvbCDmlofku7bnmoTorr/pl67mnYPpmZDvvIxQUklWQVRF44CBUFVCTElDX1JFQUTjgIFQVUJMSUNfUkVBRFdSSVRFXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdC5tZXRhZGF0YSDmlofku7blhYPmlbDmja5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXF1ZXN0LnJlcXVlc3RIZWFkZXJzIOimgeetvuWQjeeahOivt+axguWktFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3QucmVxdWVzdFBhcmFtZXRlcnMg6KaB562+5ZCN55qE6K+35rGC5Y+C5pWwXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdC5yZXNwb25zZUhlYWRlcnMg5Lul5ZCO6L+b6KGM5paH5Lu25LiL6L295pe277yM5paH5Lu255qEIEhUVFAgUmVzcG9uc2UgSGVhZGVyc1xyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8RmlsZVN0YXR1cz59IOW3sue7j+aIkOWKn+S4iuS8oOeahOaWh+S7tuS/oeaBr++8jFNlZSB7QGxpbmsgaHR0cHM6Ly9kb2NzLmJpbmdvc29mdC5uZXQvcGFhcy91ZnMvYXBpL3N0b3JhZ2UvX2Jvb2svZGVmaW5pdGlvbnMuaHRtbCNmaWxlX3N0YXR1c31cclxuICAgICAqL1xyXG4gICAgdXBsb2FkKHJlcXVlc3QpIHtcclxuICAgICAgICByZXF1ZXN0ID0gcmVxdWVzdCB8fCB7fTtcclxuICAgICAgICAvL+iOt+WPluaWh+S7tuetvuWQjVxyXG4gICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlUHJlc2lnbmVkVXBsb2FkKHJlcXVlc3QpXHJcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgcmVzID09IFwic3RyaW5nXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcyA9IEpTT04ucGFyc2UocmVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChyZXMudXJsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6cmVzLmhlYWRlcnNcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy/kuIrkvKDmlofku7ZcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBsb2FkQWRhcHRlcihyZXMudXJsLG9wdGlvbnMscmVxdWVzdC5maWxlKS50aGVuKCgpPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlcy51cGxvYWRJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbih1cGxvYWRJZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAvL+aPkOS6pGNvbW1pdFxyXG4gICAgICAgICAgICAgICAgbGV0IHVybCA9IGAke3RoaXMudXJsfS9maWxlL3VwbG9hZC9jb21taXRgO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJvZHkgPSBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlXCI6IHJlcXVlc3Quc3RvcmFnZSxcclxuICAgICAgICAgICAgICAgICAgICBcInVwbG9hZElkXCI6IHVwbG9hZElkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY29udGVudFR5cGVcIjogcmVxdWVzdC5jb250ZW50VHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBcImFjY2Vzc0NvbnRyb2xcIjogcmVxdWVzdC5hY2Nlc3NDb250cm9sLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicmVzcG9uc2VIZWFkZXJzXCI6IHJlcXVlc3QucmVzcG9uc2VIZWFkZXJzLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibWV0YWRhdGFcIjogcmVxdWVzdC5tZXRhZGF0YVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCh1cmwsIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6Ym9keVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog562+5ZCN5paH5Lu25LiL6L296K+35rGC77yM5bm26L+U5Zue5Lqn55Sf55qE5paH5Lu25LiL6L29IFVSTOS/oeaBr++8iG9iamVjdClcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXF1ZXN0IOivt+axguS/oeaBr1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3QuZmlsZUlkIOaWh+S7tiBJRFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3QucmVxdWVzdEhlYWRlcnMg6KaB6L+b6KGM562+6KaB55qEIEhUVFAg6K+35rGC5aS0XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdC5yZXF1ZXN0UGFyYW1ldGVycyDopoHov5vooYznrb7lkI3nmoQgSFRUUCBRVUVSWSDlj4LmlbBcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXF1ZXN0LnJlc3BvbnNlSGVhZGVyT3ZlcnJpZGVzIOS4i+i9veaXtuimgemHjeWGmeeahOaWh+S7tiBIVFRQIFJlc3BvbnNlIEhlYWRlcnNcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFN0cmluZz59IOS4i+i9veWcsOWdgCBVUkxcclxuICAgICAqL1xyXG4gICAgdXJsRm9yKHJlcXVlc3QpIHtcclxuICAgICAgICBsZXQgdXJsID0gYCR7dGhpcy51cmx9L2ZpbGUvZG93bmxvYWQvc2lnbmA7XHJcbiAgICAgICAgbGV0IGJvZHkgPSBKU09OLnN0cmluZ2lmeShyZXF1ZXN0KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCh1cmwsIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICBib2R5OiBib2R5XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKDpmaTmlofku7ZcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSWQg5paH5Lu2IElEXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gXHJcbiAgICAgKi9cclxuICAgIGRlbGV0ZShmaWxlSWQpIHtcclxuICAgICAgICBsZXQgdXJsID0gYCR7dGhpcy51cmx9L2ZpbGVgO1xyXG4gICAgICAgIGxldCBib2R5ID0gSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICBmaWxlSWQ6IGZpbGVJZFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoKHVybCwge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXHJcbiAgICAgICAgICAgIGJvZHk6IGJvZHlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFVGUyDmlofku7bovazmjaLlrqLmiLfnq69cclxuICovXHJcbmV4cG9ydCBjbGFzcyBDb252ZXJ0Q2xpZW50IHtcclxuICAgIC8qKlxyXG4gICAgICogIOaehOmAoOWHveaVsFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBVRlMg5pyN5Yqh5ZmoIFVSTFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGFwcElkIOW6lOeUqCBJRFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg6YCJ6aG5XHJcbiAgICAgKiBAcGFyYW0geyhzdHJpbmd8ZnVuY3Rpb24pfSBvcHRpb25zLmFjY2Vzc1Rva2VuIOiuv+mXruS7pOeJjFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih1cmwsIGFwcElkLCBvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5hcHBJZCA9IGFwcElkO1xyXG4gICAgICAgIGlmIChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFjY2Vzc1Rva2VuKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gb3B0aW9ucy5hY2Nlc3NUb2tlbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWPkemAgeivt+axglxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCDor7fmsYJVUkxcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIOmAiemhuVxyXG4gICAgICovXHJcbiAgICBmZXRjaCh1cmwsIG9wdGlvbnMpIHtcclxuICAgICAgICBsZXQgaGVhZGVycyA9IHtcclxuICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjpcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgXCJBdXRob3JpemF0aW9uXCI6XCJCZWFyZXIgXCIgKyB0aGlzLmFjY2Vzc1Rva2VuLFxyXG4gICAgICAgICAgICBcIngtYXBwSWRcIjogdGhpcy5hcHBJZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgb3B0aW9ucy5oZWFkZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucy5oZWFkZXJzLCBoZWFkZXJzKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2hBZGFwdGVyKHVybCxvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOaWh+S7tui9rOaNouS9nOS4mu+8jFNlZSB7QGxpbmsgaHR0cHM6Ly9kb2NzLmJpbmdvc29mdC5uZXQvcGFhcy91ZnMvYXBpL2NvbnZlcnQvX2Jvb2svZGVmaW5pdGlvbnMuaHRtbCNjb252ZXJ0cmVxdWVzdH1cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXF1ZXN0IOivt+axguS/oeaBr1xyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8Q29udmVydFN0YXR1cz59ICBTZWUge0BsaW5rIGh0dHBzOi8vZG9jcy5iaW5nb3NvZnQubmV0L3BhYXMvdWZzL2FwaS9jb252ZXJ0L19ib29rL2RlZmluaXRpb25zLmh0bWwjY29udmVydHN0YXR1c31cclxuICAgICAqL1xyXG4gICAgZW5xdWV1ZShyZXF1ZXN0KSB7XHJcbiAgICAgICAgbGV0IHVybCA9IGAke3RoaXMudXJsfS9jb252ZXJ0YDtcclxuICAgICAgICBsZXQgYm9keSA9IEpTT04uc3RyaW5naWZ5KHJlcXVlc3QpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoKHVybCwge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBib2R5OiBib2R5XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bmjIflrprnmoTovazmjaLkvZzkuJrmg4XlhrVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSWQg5paH5Lu2IElEXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2luZCDovazmjaLnp43nsbtcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIOi9rOaNouWQjeensFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8Q29udmVydFN0YXR1cz59ICBTZWUge0BsaW5rIGh0dHBzOi8vZG9jcy5iaW5nb3NvZnQubmV0L3BhYXMvdWZzL2FwaS9jb252ZXJ0L19ib29rL2RlZmluaXRpb25zLmh0bWwjY29udmVydHN0YXR1c31cclxuICAgICAqL1xyXG4gICAgc3RhdHVzKGZpbGVJZCwga2luZCwgbmFtZSkge1xyXG4gICAgICAgIGxldCB1cmwgPSBgJHt0aGlzLnVybH0vY29udmVydD9maWxlSWQ9JHtmaWxlSWR9JmtpbmQ9JHtraW5kfSZuYW1lPSR7bmFtZX1gO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoKHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkvLDnrpfovazmjaLkvZzkuJrogJfml7ZcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSWQg5paH5Lu2IElEXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2luZCDovazmjaLnp43nsbtcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbXMg6L2s5o2i5Y+C5pWwXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxudW1iZXI+fSDogJfml7bvvIjmr6vnp5LvvIlcclxuICAgICAqL1xyXG4gICAgZXN0aW1hdGVkVGltZShmaWxlSWQsIGtpbmQsIHBhcmFtcykge1xyXG4gICAgICAgIGxldCB1cmwgPSAgYCR7dGhpcy51cmx9L2NvbnZlcnQvZXN0aW1hdGVUaW1lP2ZpbGVJZD0ke2ZpbGVJZH0ma2luZD0ke2tpbmR9YDtcclxuICAgICAgICBpZiAocGFyYW1zKSB7XHJcbiAgICAgICAgICAgIHVybCArPSBcIiZwYXJhbXM9XCIgKyBlbmNvZGVVUklDb21wb25lbnQocGFyYW1zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2godXJsKTtcclxuICAgIH1cclxufVxyXG5cclxuLy93ZWV45LiLd2luZG935oql6ZSZXHJcbnRyeXtcclxuICAgIGlmICh3aW5kb3cgJiYgIXdpbmRvd1tcInVmc1wiXSkge1xyXG4gICAgICAgIHdpbmRvdy51ZnMgPSB7XHJcbiAgICAgICAgICAgIFN0b3JhZ2VDbGllbnQ6IFN0b3JhZ2VDbGllbnQsXHJcbiAgICAgICAgICAgIENvbnZlcnRDbGllbnQ6IENvbnZlcnRDbGllbnRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbmNhdGNoKGV4KXtcclxuICAgIC8vdG9kb1xyXG59XHJcblxyXG4iLCJpbXBvcnQge1N0b3JhZ2VDbGllbnQsQ29udmVydENsaWVudH0gZnJvbSBcIi4uL3NyYy91ZnNcIjtcblxuY29uc3QgYXBpU2VydmVyID0gXCJodHRwOi8vdWZzLWRldi5iaW5nb3NvZnQubmV0L2FwaS9cIjtcbmNvbnN0IHNzb1NlcnZlciA9IFwiaHR0cDovLzEwLjIwMS43OC4yMDYvc3NvXCI7XG5jb25zdCB1c2VybmFtZSA9IFwiYWRtaW5cIjtcbmNvbnN0IHBhc3N3b3JkID0gXCJjajEyMzQ1NlwiO1xuY29uc3QgY2xpZW50SWQgPSBcImFwaWd3XCI7XG5jb25zdCBjbGllbnRTZWNyZXQgPSBcImFwaWd3XCI7XG5cbi8v5omT5Y2w5pel5b+XXG5sZXQgcHJpbnRMb2cgPShsb2csY2xlYXIpPT57XG4gICAgaWYoIWNsZWFyKXtcbiAgICAgICAgbGV0IG9Mb2cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdFwiKS5pbm5lckhUTUw7XG4gICAgICAgIGxvZyA9IChvTG9nPT09Jyc/YCR7bG9nfWA6YCR7b0xvZ308L2JyPiR7bG9nfWApO1xuICAgIH1cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdFwiKS5pbm5lckhUTUwgPSBsb2c7XG59XG5cbi8v5ou/5YiwYWNjZXNzdG9rZW5cbmxldCBwcmVwYXJlID0gKCkgPT4ge1xuICAgIGxldCBmb3JtRGF0YSA9IGBncmFudF90eXBlPXBhc3N3b3JkJnVzZXJuYW1lPSR7dXNlcm5hbWV9JnBhc3N3b3JkPSR7cGFzc3dvcmR9JmNsaWVudF9pZD0ke2NsaWVudElkfSZjbGllbnRfc2VjcmV0PSR7Y2xpZW50U2VjcmV0fWA7XG4gICAgcmV0dXJuIGZldGNoKGAke3Nzb1NlcnZlcn0vb2F1dGgyL3Rva2VuYCwge1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogZm9ybURhdGFcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpXG4gICAgfSkudGhlbihmdW5jdGlvbiAoYm9keSkge1xuICAgICAgICBsZXQgY29uZmlnID0ge1xuICAgICAgICAgICAgdXJsOiBhcGlTZXJ2ZXIsXG4gICAgICAgICAgICBhY2Nlc3NUb2tlbjogYm9keS5hY2Nlc3NfdG9rZW5cbiAgICAgICAgfVxuICAgICAgICBwcmludExvZyhgQWNjZXNzVG9rZW46ICR7Ym9keS5hY2Nlc3NfdG9rZW59YCk7XG4gICAgICAgIC8v5p6E5bu6Y2xpZW50XG4gICAgICAgIHJldHVybiBuZXcgU3RvcmFnZUNsaWVudChjb25maWcudXJsLCB7XG4gICAgICAgICAgICBhY2Nlc3NUb2tlbjogY29uZmlnLmFjY2Vzc1Rva2VuXG4gICAgICAgIH0pO1xuICAgIH0pLmNhdGNoKGVycj0+e1xuICAgICAgICBwcmludExvZyhlcnIpO1xuICAgIH0pO1xufVxuXG4vL+aJp+ihjOS4iuS8oFxubGV0IHVwbG9hZFRlc3QgPSAoZmlsZSkgPT4ge1xuICAgIHByZXBhcmUoKS50aGVuKHN0b3JhZ2VDbGllbnQgPT4ge1xuICAgICAgICBpZighc3RvcmFnZUNsaWVudClyZXR1cm47XG4gICAgICAgIHN0b3JhZ2VDbGllbnQudXBsb2FkKHtcbiAgICAgICAgICAgIGZpbGU6IGZpbGVcbiAgICAgICAgfSkudGhlbihmaWxlU3RhdHVzID0+IHtcbiAgICAgICAgICAgIHByaW50TG9nKGDkuIrkvKDnu5Pmnpw6ICR7SlNPTi5zdHJpbmdpZnkoZmlsZVN0YXR1cyl9YCk7XG4gICAgXG4gICAgICAgICAgICByZXR1cm4gc3RvcmFnZUNsaWVudC51cmxGb3Ioe1xuICAgICAgICAgICAgICAgIGZpbGVJZDogZmlsZVN0YXR1cy5pZFxuICAgICAgICAgICAgfSkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgIHByaW50TG9nKGDmlofku7bot6/lvoQ6ICR7cmVzLnVybH1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuaWYgKHdpbmRvdykge1xuICAgIHdpbmRvdy51ZnNVcGxvYWRUZXN0ID0gdXBsb2FkVGVzdDtcbn0iXSwic291cmNlUm9vdCI6IiJ9