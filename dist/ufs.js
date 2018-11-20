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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ufs.js");
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

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdWZzLmpzIl0sIm5hbWVzIjpbImZldGNoQWRhcHRlciIsInVwbG9hZEFkYXB0ZXIiLCJfY3JlYXRlQWpheCIsInhtbGh0dHAiLCJ3aW5kb3ciLCJYTUxIdHRwUmVxdWVzdCIsIkFjdGl2ZVhPYmplY3QiLCJ1cmwiLCJvcHRpb25zIiwiT2JqZWN0IiwiYXNzaWduIiwid2VleCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3RyZWFtIiwicmVxdWlyZU1vZHVsZSIsImZldGNoIiwicmVzIiwib2siLCJkYXRhIiwiSlNPTiIsInBhcnNlIiwic3RhdHVzIiwic3RhdHVzVGV4dCIsImV4IiwieGhyIiwibWV0aG9kIiwib3BlbiIsImhlYWRlcnMiLCJrZXkiLCJzZXRSZXF1ZXN0SGVhZGVyIiwib25yZWFkeXN0YXRlY2hhbmdlIiwicmVhZHlTdGF0ZSIsInJlc3BvbnNlIiwiRXJyb3IiLCJib2R5Iiwic2VuZCIsImZpbGVPYmoiLCJmaWxlVHJhbnNmZXIiLCJ1cGxvYWQiLCJlcnIiLCJTdG9yYWdlQ2xpZW50IiwiYWNjZXNzVG9rZW4iLCJmaWxlSWQiLCJyZXF1ZXN0Iiwic3RyaW5naWZ5IiwicmVxdWVzdEhlYWRlcnMiLCJyZXF1ZXN0UGFyYW1ldGVycyIsInN0b3JhZ2UiLCJnZW5lcmF0ZVByZXNpZ25lZFVwbG9hZCIsInRoZW4iLCJmaWxlIiwidXBsb2FkSWQiLCJjb250ZW50VHlwZSIsImFjY2Vzc0NvbnRyb2wiLCJyZXNwb25zZUhlYWRlcnMiLCJtZXRhZGF0YSIsIkNvbnZlcnRDbGllbnQiLCJhcHBJZCIsImtpbmQiLCJuYW1lIiwicGFyYW1zIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwidWZzIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7UUN4RWdCQSxZLEdBQUFBLFk7UUFtREFDLGEsR0FBQUEsYTtBQTdEaEIsU0FBU0MsV0FBVCxHQUF1QjtBQUNuQixRQUFJQyxVQUFVLEVBQWQ7QUFDQSxRQUFJQyxPQUFPQyxjQUFYLEVBQTJCO0FBQ3ZCRixrQkFBVSxJQUFJRSxjQUFKLEVBQVY7QUFDSCxLQUZELE1BRU87QUFDSEYsa0JBQVUsSUFBSUcsYUFBSixDQUFrQixtQkFBbEIsQ0FBVjtBQUNIO0FBQ0QsV0FBT0gsT0FBUDtBQUNIOztBQUVNLFNBQVNILFlBQVQsQ0FBc0JPLEdBQXRCLEVBQTJCQyxPQUEzQixFQUFvQztBQUN2Q0EsY0FBVUMsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JGLE9BQWxCLENBQVY7QUFDQSxRQUFJO0FBQ0E7QUFDQSxZQUFJRyxJQUFKLEVBQVU7QUFDTixtQkFBTyxJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3BDLG9CQUFJQyxTQUFTSixLQUFLSyxhQUFMLENBQW1CLFFBQW5CLENBQWI7QUFDQVIsd0JBQVFELEdBQVIsR0FBY0EsR0FBZDtBQUNBUSx1QkFBT0UsS0FBUCxDQUFhVCxPQUFiLEVBQXNCLFVBQUNVLEdBQUQsRUFBUztBQUMzQix3QkFBSUEsSUFBSUMsRUFBUixFQUFZO0FBQ1IsNEJBQUksT0FBT0QsSUFBSUUsSUFBWCxJQUFtQixRQUF2QixFQUFpQztBQUM3QkYsZ0NBQUlFLElBQUosR0FBV0MsS0FBS0MsS0FBTCxDQUFXSixJQUFJRSxJQUFmLENBQVg7QUFDSDtBQUNEUCxnQ0FBUUssSUFBSUUsSUFBWixFQUFrQkYsSUFBSUssTUFBdEIsRUFBOEJMLElBQUlNLFVBQWxDO0FBQ0gscUJBTEQsTUFLTztBQUNIViwrQkFBT0ksSUFBSUssTUFBWCxFQUFtQkwsSUFBSU0sVUFBdkI7QUFDSDtBQUNKLGlCQVREO0FBVUgsYUFiTSxDQUFQO0FBY0g7QUFDSixLQWxCRCxDQWtCRSxPQUFPQyxFQUFQLEVBQVc7QUFDVDtBQUNBLGVBQU8sSUFBSWIsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNwQyxnQkFBSVksTUFBTXhCLGFBQVY7QUFDQSxnQkFBSXlCLFNBQVNuQixRQUFRbUIsTUFBUixJQUFrQixLQUEvQjtBQUNBRCxnQkFBSUUsSUFBSixDQUFTRCxNQUFULEVBQWlCcEIsR0FBakI7QUFDQSxnQkFBSUMsUUFBUXFCLE9BQVosRUFBcUI7QUFDakIscUJBQUssSUFBSUMsR0FBVCxJQUFnQnRCLFFBQVFxQixPQUF4QixFQUFpQztBQUM3Qkgsd0JBQUlLLGdCQUFKLENBQXFCRCxHQUFyQixFQUEwQnRCLFFBQVFxQixPQUFSLENBQWdCQyxHQUFoQixDQUExQjtBQUNIO0FBQ0o7QUFDREosZ0JBQUlNLGtCQUFKLEdBQXlCLFlBQVk7QUFDakMsb0JBQUlOLElBQUlPLFVBQUosSUFBa0IsQ0FBdEIsRUFBeUI7QUFDckI7QUFDSDtBQUNELG9CQUFJUCxJQUFJSCxNQUFKLElBQWMsR0FBbEIsRUFBdUI7QUFDbkIsd0JBQUlXLFdBQVdiLEtBQUtDLEtBQUwsQ0FBV0ksSUFBSVEsUUFBZixDQUFmO0FBQ0FyQiw0QkFBUXFCLFFBQVI7QUFDSCxpQkFIRCxNQUdPO0FBQ0hwQiwyQkFBTyxJQUFJcUIsS0FBSixDQUFVVCxJQUFJUSxRQUFkLENBQVA7QUFDSDtBQUNKLGFBVkQ7QUFXQSxnQkFBSTFCLFFBQVE0QixJQUFaLEVBQWtCO0FBQ2RWLG9CQUFJVyxJQUFKLENBQVM3QixRQUFRNEIsSUFBakI7QUFDSCxhQUZELE1BRU87QUFDSFYsb0JBQUlXLElBQUo7QUFDSDtBQUNKLFNBekJNLENBQVA7QUEwQkg7QUFDSjs7QUFFTSxTQUFTcEMsYUFBVCxDQUF1Qk0sR0FBdkIsRUFBNEJDLE9BQTVCLEVBQXFDOEIsT0FBckMsRUFBOEM7QUFDakQ5QixjQUFVQyxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQkYsT0FBbEIsQ0FBVjtBQUNBLFFBQUk7QUFDQTtBQUNBLFlBQUlHLElBQUosRUFBVTtBQUNOLG1CQUFPLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDcEM7QUFDQSxvQkFBSXlCLGVBQWU1QixLQUFLSyxhQUFMLENBQW1CLG9CQUFuQixDQUFuQjtBQUNBdUIsNkJBQWFDLE1BQWIsQ0FBb0JGLE9BQXBCLEVBQTZCL0IsR0FBN0IsRUFBa0M7QUFDOUJzQiw2QkFBU3JCLFFBQVFxQixPQURhO0FBRTlCRiw0QkFBUTtBQUZzQixpQkFBbEMsRUFHRyxJQUhILEVBR1Msa0JBQVU7QUFDZmQ7QUFDSCxpQkFMRCxFQUtHLGVBQU87QUFDTkMsMkJBQU8yQixHQUFQO0FBQ0gsaUJBUEQ7QUFRSCxhQVhNLENBQVA7QUFZSDtBQUNKLEtBaEJELENBZ0JFLE9BQU9oQixFQUFQLEVBQVc7QUFDVDtBQUNBLGVBQU8sSUFBSWIsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNwQyxnQkFBSVksTUFBTXhCLGFBQVY7QUFDQSxnQkFBSXlCLFNBQVNuQixRQUFRbUIsTUFBUixJQUFrQixLQUEvQjtBQUNBRCxnQkFBSUUsSUFBSixDQUFTRCxNQUFULEVBQWlCcEIsR0FBakIsRUFBc0IsSUFBdEI7QUFDQSxnQkFBSUMsUUFBUXFCLE9BQVosRUFBcUI7QUFDakIscUJBQUssSUFBSUMsR0FBVCxJQUFnQnRCLFFBQVFxQixPQUF4QixFQUFpQztBQUM3Qkgsd0JBQUlLLGdCQUFKLENBQXFCRCxHQUFyQixFQUEwQnRCLFFBQVFxQixPQUFSLENBQWdCQyxHQUFoQixDQUExQjtBQUNIO0FBQ0o7QUFDREosZ0JBQUlNLGtCQUFKLEdBQXlCLFlBQVk7QUFDakMsb0JBQUlOLElBQUlPLFVBQUosSUFBa0IsQ0FBdEIsRUFBeUI7QUFDckI7QUFDSDtBQUNELG9CQUFJUCxJQUFJSCxNQUFKLElBQWMsR0FBbEIsRUFBdUI7QUFDbkJWO0FBQ0gsaUJBRkQsTUFFTztBQUNIQywyQkFBTyxJQUFJcUIsS0FBSixDQUFVVCxJQUFJUSxRQUFkLENBQVA7QUFDSDtBQUNKLGFBVEQ7QUFVQVIsZ0JBQUlXLElBQUosQ0FBU0MsT0FBVDtBQUNILFNBcEJNLENBQVA7QUFxQkg7QUFDSixDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2R0Q7Ozs7QUFFQTs7O0lBR2FJLGEsV0FBQUEsYTtBQUNUOzs7Ozs7QUFNQSwyQkFBWW5DLEdBQVosRUFBaUJDLE9BQWpCLEVBQTBCO0FBQUE7O0FBQ3RCLGFBQUtELEdBQUwsR0FBV0EsR0FBWDtBQUNBLFlBQUlDLE9BQUosRUFBYTtBQUNULGdCQUFJQSxRQUFRbUMsV0FBWixFQUF5QjtBQUNyQixxQkFBS0EsV0FBTCxHQUFtQm5DLFFBQVFtQyxXQUEzQjtBQUNIO0FBQ0o7QUFDSjs7QUFFRDs7Ozs7Ozs7OzhCQUtNcEMsRyxFQUFLQyxPLEVBQVM7QUFDaEIsZ0JBQUlxQixVQUFVO0FBQ1YsZ0NBQWUsa0JBREw7QUFFVixpQ0FBZ0IsWUFBWSxLQUFLYztBQUZ2QixhQUFkO0FBSUFuQyxvQkFBUXFCLE9BQVIsR0FBa0JwQixPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQkYsUUFBUXFCLE9BQTFCLEVBQW1DQSxPQUFuQyxDQUFsQjtBQUNBLG1CQUFPLDBCQUFhdEIsR0FBYixFQUFpQkMsT0FBakIsQ0FBUDtBQUNIOztBQUVEOzs7Ozs7OzsrQkFLT29DLE0sRUFBUTtBQUNYLGdCQUFJckMsTUFBUyxLQUFLQSxHQUFkLGNBQTBCcUMsTUFBOUI7QUFDQSxtQkFBTyxLQUFLM0IsS0FBTCxDQUFXVixHQUFYLENBQVA7QUFDSDs7QUFFRDs7Ozs7OzsyQ0FJbUJxQyxNLEVBQVE7QUFDdkIsZ0JBQUlyQyxNQUFTLEtBQUtBLEdBQWQsY0FBMEJxQyxNQUExQixxQkFBSjtBQUNBLG1CQUFPLEtBQUszQixLQUFMLENBQVdWLEdBQVgsQ0FBUDtBQUNIOztBQUVEOzs7Ozs7O29DQUlZcUMsTSxFQUFRO0FBQ2hCLGdCQUFJckMsTUFBUyxLQUFLQSxHQUFkLGNBQTBCcUMsTUFBMUIsY0FBSjtBQUNBLG1CQUFPLEtBQUszQixLQUFMLENBQVdWLEdBQVgsQ0FBUDtBQUNIOztBQUVEOzs7Ozs7Ozs7Ozs7Z0RBU3dCc0MsTyxFQUFTO0FBQzdCLGdCQUFJdEMsTUFBUyxLQUFLQSxHQUFkLHNCQUFKO0FBQ0EsZ0JBQUk2QixPQUFPZixLQUFLeUIsU0FBTCxDQUFlO0FBQ3RCLGtDQUFrQkQsUUFBUUUsY0FESjtBQUV0QixxQ0FBcUJGLFFBQVFHLGlCQUZQO0FBR3RCLDJCQUFXSCxRQUFRSTtBQUhHLGFBQWYsQ0FBWDtBQUtBLG1CQUFPLEtBQUtoQyxLQUFMLENBQVdWLEdBQVgsRUFBZ0I7QUFDZm9CLHdCQUFRLE1BRE87QUFFZlMsc0JBQU1BO0FBRlMsYUFBaEIsQ0FBUDtBQUlIOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7OytCQWFPUyxPLEVBQVM7QUFBQTs7QUFDWkEsc0JBQVVBLFdBQVcsRUFBckI7QUFDQTtBQUNBLG1CQUFPLEtBQUtLLHVCQUFMLENBQTZCTCxPQUE3QixFQUNGTSxJQURFLENBQ0csZUFBTztBQUNULG9CQUFHLE9BQU9qQyxHQUFQLElBQWMsUUFBakIsRUFBMEI7QUFDdEJBLDBCQUFNRyxLQUFLQyxLQUFMLENBQVdKLEdBQVgsQ0FBTjtBQUNIO0FBQ0Qsb0JBQUlBLElBQUlYLEdBQVIsRUFBYTtBQUNULHdCQUFJQyxVQUFVO0FBQ1ZxQixpQ0FBUVgsSUFBSVc7QUFFaEI7QUFIYyxxQkFBZCxDQUlBLE9BQU8sMkJBQWNYLElBQUlYLEdBQWxCLEVBQXNCQyxPQUF0QixFQUE4QnFDLFFBQVFPLElBQXRDLEVBQTRDRCxJQUE1QyxDQUFpRCxZQUFJO0FBQ3hELCtCQUFPLElBQUl2QyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3BDRCxvQ0FBUUssSUFBSW1DLFFBQVo7QUFDSCx5QkFGTSxDQUFQO0FBR0gscUJBSk0sQ0FBUDtBQUtIO0FBQ0osYUFoQkUsRUFpQkZGLElBakJFLENBaUJHLG9CQUFZO0FBQ2Q7QUFDQSxvQkFBSTVDLE1BQVMsTUFBS0EsR0FBZCx3QkFBSjtBQUNBLG9CQUFJNkIsT0FBT2YsS0FBS3lCLFNBQUwsQ0FBZTtBQUN0QiwrQkFBV0QsUUFBUUksT0FERztBQUV0QixnQ0FBWUksUUFGVTtBQUd0QixtQ0FBZVIsUUFBUVMsV0FIRDtBQUl0QixxQ0FBaUJULFFBQVFVLGFBSkg7QUFLdEIsdUNBQW1CVixRQUFRVyxlQUxMO0FBTXRCLGdDQUFZWCxRQUFRWTtBQU5FLGlCQUFmLENBQVg7QUFRQSx1QkFBTyxNQUFLeEMsS0FBTCxDQUFXVixHQUFYLEVBQWdCO0FBQ25Cb0IsNEJBQVEsTUFEVztBQUVuQlMsMEJBQUtBO0FBRmMsaUJBQWhCLENBQVA7QUFJSCxhQWhDRSxDQUFQO0FBaUNIOztBQUVEOzs7Ozs7Ozs7Ozs7K0JBU09TLE8sRUFBUztBQUNaLGdCQUFJdEMsTUFBUyxLQUFLQSxHQUFkLHdCQUFKO0FBQ0EsZ0JBQUk2QixPQUFPZixLQUFLeUIsU0FBTCxDQUFlRCxPQUFmLENBQVg7QUFDQSxtQkFBTyxLQUFLNUIsS0FBTCxDQUFXVixHQUFYLEVBQWdCO0FBQ2ZvQix3QkFBUSxNQURPO0FBRWZTLHNCQUFNQTtBQUZTLGFBQWhCLENBQVA7QUFJSDs7QUFFRDs7Ozs7Ozs7Z0NBS09RLE0sRUFBUTtBQUNYLGdCQUFJckMsTUFBUyxLQUFLQSxHQUFkLFVBQUo7QUFDQSxnQkFBSTZCLE9BQU9mLEtBQUt5QixTQUFMLENBQWU7QUFDdEJGLHdCQUFRQTtBQURjLGFBQWYsQ0FBWDtBQUdBLG1CQUFPLEtBQUszQixLQUFMLENBQVdWLEdBQVgsRUFBZ0I7QUFDbkJvQix3QkFBUSxRQURXO0FBRW5CUyxzQkFBTUE7QUFGYSxhQUFoQixDQUFQO0FBSUg7Ozs7OztBQUdMOzs7OztJQUdhc0IsYSxXQUFBQSxhO0FBQ1Q7Ozs7Ozs7QUFPQSwyQkFBWW5ELEdBQVosRUFBaUJvRCxLQUFqQixFQUF3Qm5ELE9BQXhCLEVBQWlDO0FBQUE7O0FBQzdCLGFBQUtELEdBQUwsR0FBV0EsR0FBWDtBQUNBLGFBQUtvRCxLQUFMLEdBQWFBLEtBQWI7QUFDQSxZQUFJbkQsT0FBSixFQUFhO0FBQ1QsZ0JBQUlBLFFBQVFtQyxXQUFaLEVBQXlCO0FBQ3JCLHFCQUFLQSxXQUFMLEdBQW1CbkMsUUFBUW1DLFdBQTNCO0FBQ0g7QUFDSjtBQUNKOztBQUVEOzs7Ozs7Ozs7OEJBS01wQyxHLEVBQUtDLE8sRUFBUztBQUNoQixnQkFBSXFCLFVBQVU7QUFDVixnQ0FBZSxrQkFETDtBQUVWLGlDQUFnQixZQUFZLEtBQUtjLFdBRnZCO0FBR1YsMkJBQVcsS0FBS2dCO0FBSE4sYUFBZDtBQUtBbkQsb0JBQVFxQixPQUFSLEdBQWtCcEIsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JGLFFBQVFxQixPQUExQixFQUFtQ0EsT0FBbkMsQ0FBbEI7QUFDQSxtQkFBTywwQkFBYXRCLEdBQWIsRUFBaUJDLE9BQWpCLENBQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7Z0NBS1FxQyxPLEVBQVM7QUFDYixnQkFBSXRDLE1BQVMsS0FBS0EsR0FBZCxhQUFKO0FBQ0EsZ0JBQUk2QixPQUFPZixLQUFLeUIsU0FBTCxDQUFlRCxPQUFmLENBQVg7QUFDQSxtQkFBTyxLQUFLNUIsS0FBTCxDQUFXVixHQUFYLEVBQWdCO0FBQ25Cb0Isd0JBQVEsTUFEVztBQUVuQlMsc0JBQU1BO0FBRmEsYUFBaEIsQ0FBUDtBQUlIOztBQUVEOzs7Ozs7Ozs7OytCQU9PUSxNLEVBQVFnQixJLEVBQU1DLEksRUFBTTtBQUN2QixnQkFBSXRELE1BQVMsS0FBS0EsR0FBZCx3QkFBb0NxQyxNQUFwQyxjQUFtRGdCLElBQW5ELGNBQWdFQyxJQUFwRTtBQUNBLG1CQUFPLEtBQUs1QyxLQUFMLENBQVdWLEdBQVgsQ0FBUDtBQUNIOztBQUVEOzs7Ozs7Ozs7O3NDQU9jcUMsTSxFQUFRZ0IsSSxFQUFNRSxNLEVBQVE7QUFDaEMsZ0JBQUl2RCxNQUFVLEtBQUtBLEdBQWYscUNBQWtEcUMsTUFBbEQsY0FBaUVnQixJQUFyRTtBQUNBLGdCQUFJRSxNQUFKLEVBQVk7QUFDUnZELHVCQUFPLGFBQWF3RCxtQkFBbUJELE1BQW5CLENBQXBCO0FBQ0g7QUFDRCxtQkFBTyxLQUFLN0MsS0FBTCxDQUFXVixHQUFYLENBQVA7QUFDSDs7Ozs7O0FBR0w7OztBQUNBLElBQUc7QUFDQyxRQUFJSCxVQUFVLENBQUNBLE9BQU8sS0FBUCxDQUFmLEVBQThCO0FBQzFCQSxlQUFPNEQsR0FBUCxHQUFhO0FBQ1R0QiwyQkFBZUEsYUFETjtBQUVUZ0IsMkJBQWVBO0FBRk4sU0FBYjtBQUlIO0FBQ0osQ0FQRCxDQVFBLE9BQU1qQyxFQUFOLEVBQVM7QUFDTDtBQUNILEMiLCJmaWxlIjoidWZzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvdWZzLmpzXCIpO1xuIiwiZnVuY3Rpb24gX2NyZWF0ZUFqYXgoKSB7XG4gICAgdmFyIHhtbGh0dHAgPSB7fTtcbiAgICBpZiAod2luZG93LlhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgICAgIHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB4bWxodHRwID0gbmV3IEFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MSFRUUFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHhtbGh0dHA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaEFkYXB0ZXIodXJsLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpO1xuICAgIHRyeSB7XG4gICAgICAgIC8vd2VleCBjbGllbnQgYWpheFxuICAgICAgICBpZiAod2VleCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgc3RyZWFtID0gd2VleC5yZXF1aXJlTW9kdWxlKCdzdHJlYW0nKTtcbiAgICAgICAgICAgICAgICBvcHRpb25zLnVybCA9IHVybDtcbiAgICAgICAgICAgICAgICBzdHJlYW0uZmV0Y2gob3B0aW9ucywgKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLm9rKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlcy5kYXRhID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuZGF0YSA9IEpTT04ucGFyc2UocmVzLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXMuZGF0YSwgcmVzLnN0YXR1cywgcmVzLnN0YXR1c1RleHQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlcy5zdGF0dXMsIHJlcy5zdGF0dXNUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAvLyB3ZWIgY2xpZW50IGFqYXhcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCB4aHIgPSBfY3JlYXRlQWpheCgpO1xuICAgICAgICAgICAgbGV0IG1ldGhvZCA9IG9wdGlvbnMubWV0aG9kIHx8IFwiR0VUXCI7XG4gICAgICAgICAgICB4aHIub3BlbihtZXRob2QsIHVybCk7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIG9wdGlvbnMuaGVhZGVycykge1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIG9wdGlvbnMuaGVhZGVyc1trZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSAhPSA0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcih4aHIucmVzcG9uc2UpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5ib2R5KSB7XG4gICAgICAgICAgICAgICAgeGhyLnNlbmQob3B0aW9ucy5ib2R5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBsb2FkQWRhcHRlcih1cmwsIG9wdGlvbnMsIGZpbGVPYmopIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyk7XG4gICAgdHJ5IHtcbiAgICAgICAgLy93ZWV4IGNsaWVudCB1cGxvYWRcbiAgICAgICAgaWYgKHdlZXgpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgLy/nlKh3ZWV455qE5pa55byP5LiK5Lyg5paH5Lu2XG4gICAgICAgICAgICAgICAgbGV0IGZpbGVUcmFuc2ZlciA9IHdlZXgucmVxdWlyZU1vZHVsZShcIkZpbGVUcmFuc2Zlck1vZHVsZVwiKTtcbiAgICAgICAgICAgICAgICBmaWxlVHJhbnNmZXIudXBsb2FkKGZpbGVPYmosIHVybCwge1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiBvcHRpb25zLmhlYWRlcnMsXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIlxuICAgICAgICAgICAgICAgIH0sIG51bGwsIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgLy93ZWIgY2xpZW50IHVwbG9hZFxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IHhociA9IF9jcmVhdGVBamF4KCk7XG4gICAgICAgICAgICBsZXQgbWV0aG9kID0gb3B0aW9ucy5tZXRob2QgfHwgXCJQVVRcIjtcbiAgICAgICAgICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgb3B0aW9ucy5oZWFkZXJzW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlICE9IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoeGhyLnJlc3BvbnNlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeGhyLnNlbmQoZmlsZU9iaik7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJpbXBvcnQge2ZldGNoQWRhcHRlcix1cGxvYWRBZGFwdGVyfSBmcm9tIFwiLi9jb21tb25cIjtcclxuXHJcbi8qKlxyXG4gKiAgVUZTIOaWh+S7tuWtmOWCqOWuouaIt+err1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFN0b3JhZ2VDbGllbnQge1xyXG4gICAgLyoqXHJcbiAgICAgKiAg5p6E6YCg5Ye95pWwXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIOacjeWKoeWZqCBVUkxcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIOmAiemhuVxyXG4gICAgICogQHBhcmFtIHsoc3RyaW5nfGZ1bmN0aW9uKX0gb3B0aW9ucy5hY2Nlc3NUb2tlbiDorr/pl67ku6TniYxcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IodXJsLCBvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuYWNjZXNzVG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBvcHRpb25zLmFjY2Vzc1Rva2VuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Y+R6YCB6K+35rGCXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIOivt+axglVSTFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg6YCJ6aG5XHJcbiAgICAgKi9cclxuICAgIGZldGNoKHVybCwgb3B0aW9ucykge1xyXG4gICAgICAgIGxldCBoZWFkZXJzID0ge1xyXG4gICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOlwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjpcIkJlYXJlciBcIiArIHRoaXMuYWNjZXNzVG9rZW5cclxuICAgICAgICB9O1xyXG4gICAgICAgIG9wdGlvbnMuaGVhZGVycyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMuaGVhZGVycywgaGVhZGVycyk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoQWRhcHRlcih1cmwsb3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bmjIflrprnmoTmlofku7bkv6Hmga9cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSWQg5paH5Lu2IElEXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxGaWxlU3RhdHVzPn0gIFNlZSB7QGxpbmsgaHR0cHM6Ly9kb2NzLmJpbmdvc29mdC5uZXQvcGFhcy91ZnMvYXBpL3N0b3JhZ2UvX2Jvb2svZGVmaW5pdGlvbnMuaHRtbCNmaWxlX3N0YXR1c31cclxuICAgICAqL1xyXG4gICAgc3RhdHVzKGZpbGVJZCkge1xyXG4gICAgICAgIGxldCB1cmwgPSBgJHt0aGlzLnVybH0vZmlsZS8ke2ZpbGVJZH1gOyBcclxuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCh1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5oyH5a6a5paH5Lu255qE5ZON5bqU5aS05L+h5oGvXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlkIOaWh+S7tiBJRFxyXG4gICAgICovXHJcbiAgICBnZXRSZXNwb25zZUhlYWRlcnMoZmlsZUlkKSB7XHJcbiAgICAgICAgbGV0IHVybCA9IGAke3RoaXMudXJsfS9maWxlLyR7ZmlsZUlkfS9yZXNwb25zZUhlYWRlcnNgO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoKHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bmjIflrprmlofku7bnmoTlhYPmlbDmja7kv6Hmga9cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSWQg5paH5Lu2IElEXHJcbiAgICAgKi9cclxuICAgIGdldE1ldGFkYXRhKGZpbGVJZCkge1xyXG4gICAgICAgIGxldCB1cmwgPSBgJHt0aGlzLnVybH0vZmlsZS8ke2ZpbGVJZH0vbWV0YWRhdGFgO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoKHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAg5LiK5Lyg562+5ZCNXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdCDopoHov5vooYznrb7lkI3nmoTkuIrkvKDor7fmsYJcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0LnN0b3JhZ2Ug6KaB5L2/55So5a2Y5YKo5byV5pOO5ZCN56ewXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdC5maWxlIOaWh+S7tuWvueixoe+8jOS+i+Wmgu+8mmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZUlucHV0XCIpLmZpbGVzWzBdXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdC5yZXF1ZXN0SGVhZGVycyDopoHnrb7lkI3nmoTor7fmsYLlpLRcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXF1ZXN0LnJlcXVlc3RQYXJhbWV0ZXJzIOimgeetvuWQjeeahOivt+axguWPguaVsFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8VXBsb2FkU2lnblJlc3VsdD59IOW3sue7j+aIkOWKn+S4iuS8oOeahOaWh+S7tuS/oeaBr++8jFNlZSB7QGxpbmsgaHR0cHM6Ly9kb2NzLmJpbmdvc29mdC5uZXQvcGFhcy91ZnMvYXBpL3N0b3JhZ2UvX2Jvb2svZGVmaW5pdGlvbnMuaHRtbCN1cGxvYWRzaWducmVzdWx0fVxyXG4gICAgICovXHJcbiAgICBnZW5lcmF0ZVByZXNpZ25lZFVwbG9hZChyZXF1ZXN0KSB7XHJcbiAgICAgICAgbGV0IHVybCA9IGAke3RoaXMudXJsfS9maWxlL3VwbG9hZC9zaWduYDtcclxuICAgICAgICBsZXQgYm9keSA9IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgXCJyZXF1ZXN0SGVhZGVyc1wiOiByZXF1ZXN0LnJlcXVlc3RIZWFkZXJzLFxyXG4gICAgICAgICAgICBcInJlcXVlc3RQYXJhbWV0ZXJzXCI6IHJlcXVlc3QucmVxdWVzdFBhcmFtZXRlcnMsXHJcbiAgICAgICAgICAgIFwic3RvcmFnZVwiOiByZXF1ZXN0LnN0b3JhZ2VcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCh1cmwsIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICBib2R5OiBib2R5XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkuIrkvKDmlofku7Yo5YWI6L+b6KGM562+5ZCNKVxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3Qg5LiK5Lyg6K+35rGC5a+56LGhXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcmVxdWVzdC5zdG9yYWdlIOimgeS9v+eUqOWtmOWCqOW8leaTjuWQjeensFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3QuZmlsZSDmlofku7blr7nosaHvvIzkvovlpoLvvJpkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVJbnB1dFwiKS5maWxlc1swXVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3QuY29udGVudFRwZSDmlofku7blhoXlrrnnsbvlnotcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0LmFjY2Vzc0NvbnRyb2wg5paH5Lu255qE6K6/6Zeu5p2D6ZmQ77yMUFJJVkFUReOAgVBVQkxJQ19SRUFE44CBUFVCTElDX1JFQURXUklURVxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3QubWV0YWRhdGEg5paH5Lu25YWD5pWw5o2uXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdC5yZXF1ZXN0SGVhZGVycyDopoHnrb7lkI3nmoTor7fmsYLlpLRcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXF1ZXN0LnJlcXVlc3RQYXJhbWV0ZXJzIOimgeetvuWQjeeahOivt+axguWPguaVsFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3QucmVzcG9uc2VIZWFkZXJzIOS7peWQjui/m+ihjOaWh+S7tuS4i+i9veaXtu+8jOaWh+S7tueahCBIVFRQIFJlc3BvbnNlIEhlYWRlcnNcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPEZpbGVTdGF0dXM+fSDlt7Lnu4/miJDlip/kuIrkvKDnmoTmlofku7bkv6Hmga/vvIxTZWUge0BsaW5rIGh0dHBzOi8vZG9jcy5iaW5nb3NvZnQubmV0L3BhYXMvdWZzL2FwaS9zdG9yYWdlL19ib29rL2RlZmluaXRpb25zLmh0bWwjZmlsZV9zdGF0dXN9XHJcbiAgICAgKi9cclxuICAgIHVwbG9hZChyZXF1ZXN0KSB7XHJcbiAgICAgICAgcmVxdWVzdCA9IHJlcXVlc3QgfHwge307XHJcbiAgICAgICAgLy/ojrflj5bmlofku7bnrb7lkI1cclxuICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZVByZXNpZ25lZFVwbG9hZChyZXF1ZXN0KVxyXG4gICAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHJlcyA9PSBcInN0cmluZ1wiKXtcclxuICAgICAgICAgICAgICAgICAgICByZXMgPSBKU09OLnBhcnNlKHJlcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLnVybCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOnJlcy5oZWFkZXJzXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8v5LiK5Lyg5paH5Lu2XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwbG9hZEFkYXB0ZXIocmVzLnVybCxvcHRpb25zLHJlcXVlc3QuZmlsZSkudGhlbigoKT0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXMudXBsb2FkSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4odXBsb2FkSWQgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy/mj5DkuqRjb21taXRcclxuICAgICAgICAgICAgICAgIGxldCB1cmwgPSBgJHt0aGlzLnVybH0vZmlsZS91cGxvYWQvY29tbWl0YDtcclxuICAgICAgICAgICAgICAgIGxldCBib2R5ID0gSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZVwiOiByZXF1ZXN0LnN0b3JhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ1cGxvYWRJZFwiOiB1cGxvYWRJZCxcclxuICAgICAgICAgICAgICAgICAgICBcImNvbnRlbnRUeXBlXCI6IHJlcXVlc3QuY29udGVudFR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJhY2Nlc3NDb250cm9sXCI6IHJlcXVlc3QuYWNjZXNzQ29udHJvbCxcclxuICAgICAgICAgICAgICAgICAgICBcInJlc3BvbnNlSGVhZGVyc1wiOiByZXF1ZXN0LnJlc3BvbnNlSGVhZGVycyxcclxuICAgICAgICAgICAgICAgICAgICBcIm1ldGFkYXRhXCI6IHJlcXVlc3QubWV0YWRhdGFcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2godXJsLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgICAgICBib2R5OmJvZHlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOetvuWQjeaWh+S7tuS4i+i9veivt+axgu+8jOW5tui/lOWbnuS6p+eUn+eahOaWh+S7tuS4i+i9vSBVUkzkv6Hmga/vvIhvYmplY3QpXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdCDor7fmsYLkv6Hmga9cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0LmZpbGVJZCDmlofku7YgSURcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXF1ZXN0LnJlcXVlc3RIZWFkZXJzIOimgei/m+ihjOetvuimgeeahCBIVFRQIOivt+axguWktFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3QucmVxdWVzdFBhcmFtZXRlcnMg6KaB6L+b6KGM562+5ZCN55qEIEhUVFAgUVVFUlkg5Y+C5pWwXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdC5yZXNwb25zZUhlYWRlck92ZXJyaWRlcyDkuIvovb3ml7bopoHph43lhpnnmoTmlofku7YgSFRUUCBSZXNwb25zZSBIZWFkZXJzXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxTdHJpbmc+fSDkuIvovb3lnLDlnYAgVVJMXHJcbiAgICAgKi9cclxuICAgIHVybEZvcihyZXF1ZXN0KSB7XHJcbiAgICAgICAgbGV0IHVybCA9IGAke3RoaXMudXJsfS9maWxlL2Rvd25sb2FkL3NpZ25gO1xyXG4gICAgICAgIGxldCBib2R5ID0gSlNPTi5zdHJpbmdpZnkocmVxdWVzdCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2godXJsLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgYm9keTogYm9keVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yig6Zmk5paH5Lu2XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlkIOaWh+S7tiBJRFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2V9IFxyXG4gICAgICovXHJcbiAgICBkZWxldGUoZmlsZUlkKSB7XHJcbiAgICAgICAgbGV0IHVybCA9IGAke3RoaXMudXJsfS9maWxlYDtcclxuICAgICAgICBsZXQgYm9keSA9IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgZmlsZUlkOiBmaWxlSWRcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCh1cmwsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxyXG4gICAgICAgICAgICBib2R5OiBib2R5XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVRlMg5paH5Lu26L2s5o2i5a6i5oi356uvXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ29udmVydENsaWVudCB7XHJcbiAgICAvKipcclxuICAgICAqICDmnoTpgKDlh73mlbBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVUZTIOacjeWKoeWZqCBVUkxcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhcHBJZCDlupTnlKggSURcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIOmAiemhuVxyXG4gICAgICogQHBhcmFtIHsoc3RyaW5nfGZ1bmN0aW9uKX0gb3B0aW9ucy5hY2Nlc3NUb2tlbiDorr/pl67ku6TniYxcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IodXJsLCBhcHBJZCwgb3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgICAgIHRoaXMuYXBwSWQgPSBhcHBJZDtcclxuICAgICAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5hY2Nlc3NUb2tlbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IG9wdGlvbnMuYWNjZXNzVG9rZW47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlj5HpgIHor7fmsYJcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwg6K+35rGCVVJMXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyDpgInpoblcclxuICAgICAqL1xyXG4gICAgZmV0Y2godXJsLCBvcHRpb25zKSB7XHJcbiAgICAgICAgbGV0IGhlYWRlcnMgPSB7XHJcbiAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6XCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgIFwiQXV0aG9yaXphdGlvblwiOlwiQmVhcmVyIFwiICsgdGhpcy5hY2Nlc3NUb2tlbixcclxuICAgICAgICAgICAgXCJ4LWFwcElkXCI6IHRoaXMuYXBwSWRcclxuICAgICAgICB9O1xyXG4gICAgICAgIG9wdGlvbnMuaGVhZGVycyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMuaGVhZGVycywgaGVhZGVycyk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoQWRhcHRlcih1cmwsb3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqDmlofku7bovazmjaLkvZzkuJrvvIxTZWUge0BsaW5rIGh0dHBzOi8vZG9jcy5iaW5nb3NvZnQubmV0L3BhYXMvdWZzL2FwaS9jb252ZXJ0L19ib29rL2RlZmluaXRpb25zLmh0bWwjY29udmVydHJlcXVlc3R9XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdCDor7fmsYLkv6Hmga9cclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPENvbnZlcnRTdGF0dXM+fSAgU2VlIHtAbGluayBodHRwczovL2RvY3MuYmluZ29zb2Z0Lm5ldC9wYWFzL3Vmcy9hcGkvY29udmVydC9fYm9vay9kZWZpbml0aW9ucy5odG1sI2NvbnZlcnRzdGF0dXN9XHJcbiAgICAgKi9cclxuICAgIGVucXVldWUocmVxdWVzdCkge1xyXG4gICAgICAgIGxldCB1cmwgPSBgJHt0aGlzLnVybH0vY29udmVydGA7XHJcbiAgICAgICAgbGV0IGJvZHkgPSBKU09OLnN0cmluZ2lmeShyZXF1ZXN0KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCh1cmwsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgYm9keTogYm9keVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5oyH5a6a55qE6L2s5o2i5L2c5Lia5oOF5Ya1XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlkIOaWh+S7tiBJRFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtpbmQg6L2s5o2i56eN57G7XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSDovazmjaLlkI3np7BcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPENvbnZlcnRTdGF0dXM+fSAgU2VlIHtAbGluayBodHRwczovL2RvY3MuYmluZ29zb2Z0Lm5ldC9wYWFzL3Vmcy9hcGkvY29udmVydC9fYm9vay9kZWZpbml0aW9ucy5odG1sI2NvbnZlcnRzdGF0dXN9XHJcbiAgICAgKi9cclxuICAgIHN0YXR1cyhmaWxlSWQsIGtpbmQsIG5hbWUpIHtcclxuICAgICAgICBsZXQgdXJsID0gYCR7dGhpcy51cmx9L2NvbnZlcnQ/ZmlsZUlkPSR7ZmlsZUlkfSZraW5kPSR7a2luZH0mbmFtZT0ke25hbWV9YDtcclxuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCh1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Lyw566X6L2s5o2i5L2c5Lia6ICX5pe2XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZUlkIOaWh+S7tiBJRFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtpbmQg6L2s5o2i56eN57G7XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1zIOi9rOaNouWPguaVsFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8bnVtYmVyPn0g6ICX5pe277yI5q+r56eS77yJXHJcbiAgICAgKi9cclxuICAgIGVzdGltYXRlZFRpbWUoZmlsZUlkLCBraW5kLCBwYXJhbXMpIHtcclxuICAgICAgICBsZXQgdXJsID0gIGAke3RoaXMudXJsfS9jb252ZXJ0L2VzdGltYXRlVGltZT9maWxlSWQ9JHtmaWxlSWR9JmtpbmQ9JHtraW5kfWA7XHJcbiAgICAgICAgaWYgKHBhcmFtcykge1xyXG4gICAgICAgICAgICB1cmwgKz0gXCImcGFyYW1zPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoKHVybCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vd2VleOS4i3dpbmRvd+aKpemUmVxyXG50cnl7XHJcbiAgICBpZiAod2luZG93ICYmICF3aW5kb3dbXCJ1ZnNcIl0pIHtcclxuICAgICAgICB3aW5kb3cudWZzID0ge1xyXG4gICAgICAgICAgICBTdG9yYWdlQ2xpZW50OiBTdG9yYWdlQ2xpZW50LFxyXG4gICAgICAgICAgICBDb252ZXJ0Q2xpZW50OiBDb252ZXJ0Q2xpZW50XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5jYXRjaChleCl7XHJcbiAgICAvL3RvZG9cclxufVxyXG5cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==