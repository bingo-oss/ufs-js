import {
  fetchAdapter,
  uploadAdapter,
  rebuildUrlIfNecessary,
  getQuery
} from "./common";
import jszip from "jszip";
import saveAs from "./fileSaver";
/**
 * ufs存储客户端
 * @class StorageClient
 */
export class StorageBase {
  /**
   *  构造函数
   * @param {string} url 服务器 URL
   * @param {Object} options 选项
   * @param {String} options.appId 应用ID
   * @param {String} options.accessToken 访问令牌
   */
  constructor(url, options) {
    this.url = url;
    if (options) {
      if (options.accessToken) {
        this.accessToken = options.accessToken;
      }
      if (options.appId) {
        this.appId = options.appId;
      }
    }
  }

  /**
   * 发送请求
   * @param {string} url 请求URL
   * @param {Object} options 选项
   */
  fetch(url, options = {}) {
    let headers = {};
    headers["Content-Type"] = "application/json";
    headers["Authorization"] = "Bearer " + this.accessToken;
    if (this.appId) {
      headers["x-ufs-appId"] = this.appId;
    }
    options.headers = Object.assign({}, options.headers, headers);
    return fetchAdapter(url, options);
  }

  /**
   * 获取指定的文件信息
   * @method status
   * @param {string} fileId 文件 ID
   * @returns {Promise<FileStatus>}
   */
  status(fileId) {
    let url = `${this.url}/file/${fileId}`;
    return this.fetch(url);
  }

  /**
   * 获取指定文件的响应头信息
   * @method getResponseHeaders
   * @param {string} fileId 文件 ID
   */
  getResponseHeaders(fileId) {
    let url = `${this.url}/file/${fileId}/responseHeaders`;
    return this.fetch(url);
  }

  /**
   * 获取指定文件的元数据信息
   * @method getMetadata
   * @param {string} fileId 文件 ID
   */
  getMetadata(fileId) {
    let url = `${this.url}/file/${fileId}/metadata`;
    return this.fetch(url);
  }

  /**
   * 获取上传的签名
   * @param {Object} request 要进行签名的上传请求
   * @param {string} request.storage 要使用存储引擎名称
   * @param {Object} request.file 文件对象，例如：document.getElementById("fileInput").files[0]
   * @param {String} request.filename 文件名称
   * @param {Integer} request.filesize 文件大小
   * @param {Object} request.requestHeaders 要签名的请求头
   * @param {Object} request.requestParameters 要签名的请求参数
   * @returns {Promise}
   */
  generateUploadSign(request) {
    let url = `${this.url}/file/upload/sign`;
    let filename = request.filename || request.file.name;
    let filesize = request.filesize || request.file.size;
    let body = JSON.stringify({
      requestHeaders: request.requestHeaders,
      requestParameters: request.requestParameters,
      storage: request.storage,
      filename: filename,
      filesize: filesize,
    });
    return this.fetch(url, {
      method: "POST",
      body: body,
    });
  }

  /**
   * 上传文件，包含签名上传提交过程
   * @method upload
   * @param {Object} request 上传请求对象
   * @param {String} request.storage 要使用存储引擎名称
   * @param {String} request.commitStorage 提交时候要使用的存储引擎名称，解决跨网上传问题，默认使用storage
   * @param {Object} request.file 文件对象，例如：document.getElementById("fileInput").files[0]
   * @param {String} request.filename 文件名称
   * @param {Integer} request.filesize 文件大小
   * @param {String} request.contentType 文件内容类型
   * @param {String} request.accessControl 文件的访问权限
   * @param {Object} request.metadata 文件元数据
   * @param {Object} request.requestHeaders 要签名的请求头
   * @param {Object} request.requestParameters 要签名的请求参数
   * @param {Object} request.responseHeaders 以后进行文件下载时，文件的 HTTP Response Headers，commit阶段使用
   * @returns {Promise}
   */
  upload(request, options) {
    request = request || {};
    options = options || {};
    options.headers = options.headers || {};

    // 获取文件签名
    return this.generateUploadSign(request)
      .then((res) => {
        if (typeof res == "string") {
          res = JSON.parse(res);
        }
        if (res.url) {
          options.headers = Object.assign(options.headers, res.headers);
          // 兼容相对路径地址
          if (!res.url.startsWith("http") && options.baseUrl) {
            res.url = rebuildUrlIfNecessary(res.url, options);
          }
          // 执行上传操作
          return uploadAdapter(res.url, options, request.file).then(() => {
            return new Promise((resolve, reject) => {
              resolve(res.uploadId);
            });
          });
        }
      })
      .then((uploadId) => {
        // 提交commit
        let url = `${this.url}/file/upload/commit`;
        let filename = request.filename || request.file.name;
        let filesize = request.filesize || request.file.size;
        let responseHeaders = request.responseHeaders || {};
        responseHeaders = Object.assign(responseHeaders, {
          "Content-Disposition": `inline; filename=${filename}`,
        });
        let defaultMeta = {
          filename: filename
        };
        let body = JSON.stringify({
          storage: request.commitStorage || request.storage,
          uploadId: uploadId,
          contentType: request.contentType,
          accessControl: request.accessControl,
          responseHeaders: responseHeaders,
          metadata: Object.assign(defaultMeta, request.metadata || {}),
          filename: filename,
          filesize: filesize,
        });
        return this.fetch(url, {
          method: "POST",
          body: body,
        });
      });
  }

  /**
   * 获取下载文件信息
   * @method urlFor
   * @param {Object} request 请求信息
   * @param {String} request.fileId 文件 ID
   * @param {String} request.storage 要使用存储引擎名称
   * @param {Object} request.requestHeaders 要进行签要的 HTTP 请求头
   * @param {Object} request.requestParameters 要进行签名的 HTTP QUERY 参数
   * @param {Object} request.responseHeaderOverrides 下载时要重写的文件 HTTP Response Headers
   * @param {String} request.expires 过期时间，单位是秒，设置-1获取永久地址
   * @returns {Promise}
   */
  urlFor(request) {
    let url = `${this.url}/file/download/sign`;
    let body = JSON.stringify(request);
    return this.fetch(url, {
      method: "POST",
      body: body,
    });
  }

  /**
   * 删除文件
   * @method delete
   * @param {string} fileId 文件 ID
   * @returns {Promise}
   */
  delete(fileId) {
    let url = `${this.url}/file`;
    let body = JSON.stringify({
      fileId: fileId,
    });
    return this.fetch(url, {
      method: "DELETE",
      body: body,
    });
  }

  /**
   * 预览文件
   * @method preview
   * @param {Object} request 请求体
   * @param {String} request.url 预览服务 URL
   * @param {String} request.fileId 文件 ID
   * @param {String} request.xUfsS 签名信息
   * @param {String} request.appId 应用Id
   * @returns {Promise}
   */
  preview(request = {}) {
    let url = `${request.url}/preview/oweb365/file?x-ufs-s=${request.xUfsS}`;
    let body = JSON.stringify({
      fileId: request.fileId,
    });
    return this.fetch(url, {
      method: "POST",
      body: body,
      headers: {
        "x-ufs-appId": request.appId || this.appId,
      },
    });
  }

  /**
   * 多文件下载，并生成zip(仅支持web端，weex端暂不支持)
   * @method multiFileDownload
   * @param { Array<String> } fileIds 文件Id
   * @param {Object} options 下载文件的参数
   * @param {String} options.zipName 下载文件的名称
   * @param {String} options.zipFolder zip解压后的文件夹
   * @param {String} options.fileNameReplaceRegExp 文件名称替换表达式，根据表达式替换掉内容
   * @param {Boolean} options.autoDownload 是否自动保存下载
   * @param {String} options.storage 要使用存储引擎名称
   * @param {Object} options.requestHeaders 要进行签要的 HTTP 请求头
   * @param {Object} options.requestParameters 要进行签名的 HTTP QUERY 参数
   * @param {Object} options.responseHeaderOverrides 下载时要重写的文件 HTTP Response Headers
   * @param {String} options.expires 过期时间，单位是秒，设置-1获取永久地址
   */
  multiFileDownload(fileIds, options) {
    let zip = new jszip();
    // 压缩文件名称
    let zipFileName = `${options.zipName || new Date().getTime()}.zip`;
    let zipFolder = `${options.zipFolder || "file"}`;
    let zipFiles = zip.folder(zipFolder);

    let urlPromiseArr = [];
    let filePromiseArr = [];
    let urlArr = [];

     // 从url获取文件名，默认用时间无后缀
    let getFileName = function(url) {
      let fileName = getQuery("response-content-disposition", url);
      if (fileName) {
        fileName = fileName.substr(fileName.indexOf("=") + 1);
      } else {
        fileName = new Date().getTime();
      }
      // 获取到的文件名可能需要进一步出来，例如filename中带了 UTF-8,需要去掉
      if(options.fileNameReplaceRegExp) {
        fileName = fileName.replace(options.fileNameReplaceRegExp,"");
      }
      return fileName;
    }

    // 获取每一个fileId对应的文件下载路径
    // TODO: 后面支持直接传入url或者从ufs中批量获取下载路径
    fileIds.forEach((id) => {
      let request = Object.assign({ fileId: id }, options);
      urlPromiseArr.push(this.urlFor(request));
    });

    return Promise.all(urlPromiseArr).then((urlObj) => {
      // 获取每一个文件
      urlObj.forEach((file) => {
        // url暂存
        urlArr.push(file.url);
        // 请求必须返回 arraybuffer 否则压缩后无法打开
        let getRemoteFile = fetchAdapter(file.url, { jsonParse: false, responseType: "arraybuffer" });
        filePromiseArr.push(getRemoteFile);
      });

      return Promise.all(filePromiseArr).then((fileList) => {
        fileList.forEach((fileData, index) => {
          let fileName = getFileName(urlArr[index]);
          zipFiles.file(fileName, fileData, { binary: true});
        });
        return zip.generateAsync({ type: "blob" }).then((content) => {
          options.autoDownload && saveAs(content, zipFileName);
          return Promise.resolve(content);
        });
      })
    });
  }
}

/**
 * @class ConvertClient
 */
export class ConvertBase {
  /**
   *  构造函数
   * @param {string} url 服务器 URL
   * @param {Object} options 选项
   * @param {String} options.appId 应用ID
   * @param {String} options.accessToken 访问令牌
   */
  constructor(url, options) {
    this.url = url;
    if (options) {
      if (options.accessToken) {
        this.accessToken = options.accessToken;
      }
      if (options.appId) {
        this.appId = options.appId;
      }
    }
  }

  /**
   * 发送请求
   * @param {string} url 请求URL
   * @param {Object} options 选项
   * @returns {Promise}
   */
  fetch(url, options) {
    let headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.accessToken,
      "x-appId": this.appId,
    };
    options.headers = Object.assign({}, options.headers, headers);
    return fetchAdapter(url, options);
  }

  /**
   * 添加文件转换作业
   * @param {Object} request 请求信息
   * @returns {Promise}
   */
  enqueue(request) {
    let url = `${this.url}/convert`;
    let body = JSON.stringify(request);
    return this.fetch(url, {
      method: "POST",
      body: body,
    });
  }

  /**
   * 获取指定的转换作业情况
   * @param {string} fileId 文件 ID
   * @param {string} kind 转换种类
   * @param {string} name 转换名称
   * @returns {Promise}
   */
  status(fileId, kind, name) {
    let url = `${this.url}/convert?fileId=${fileId}&kind=${kind}&name=${name}`;
    return this.fetch(url);
  }

  /**
   * 估算转换作业耗时
   * @param {string} fileId 文件 ID
   * @param {string} kind 转换种类
   * @param {string} params 转换参数
   * @returns {Promise}
   */
  estimatedTime(fileId, kind, params) {
    let url = `${this.url}/convert/estimateTime?fileId=${fileId}&kind=${kind}`;
    if (params) {
      url += "&params=" + encodeURIComponent(params);
    }
    return this.fetch(url);
  }
}
