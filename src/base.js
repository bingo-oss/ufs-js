import { fetchAdapter, uploadAdapter } from "./common";

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
function rebuildUrlIfNecessary(url, options) {
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
     * @param {(string|function)} options.accessToken 访问令牌
     */
    constructor(url, options) {
        this.url = url;
        if (options) {
            if (options.accessToken) {
                this.accessToken = options.accessToken;
            }
            if(options.appId) {
                this.appId = options.appId
            }
        }
    }

    /**
     * 发送请求
     * @param {string} url 请求URL
     * @param {Object} options 选项
     */
    fetch(url, options) {
        let headers = {};
        headers["Content-Type"] = "application/json";
        headers["Authorization"] = "Bearer " + this.accessToken;
        if (this.appId) {
            headers["x-ufs-appId"] = this.appId
            };
        }
        options.headers = Object.assign({}, options.headers, headers);
        return fetchAdapter(url,options);
    }

  /**
   * 获取指定的文件信息
   * @method status
   * @param {string} fileId 文件 ID
   * @returns {Promise<FileStatus>}  See {@link https://docs.bingosoft.net/paas/ufs/api/storage/_book/definitions.html#file_status}
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
   *  上传签名
   * @param {Object} request 要进行签名的上传请求
   * @param {string} request.storage 要使用存储引擎名称
   * @param {Object} request.file 文件对象，例如：document.getElementById("fileInput").files[0]
   * @param {Object} request.requestHeaders 要签名的请求头
   * @param {Object} request.requestParameters 要签名的请求参数
   * @returns {Promise<UploadSignResult>} 已经成功上传的文件信息，See {@link https://docs.bingosoft.net/paas/ufs/api/storage/_book/definitions.html#uploadsignresult}
   */
  generatePresignedUpload(request) {
    let url = `${this.url}/file/upload/sign`;
    let body = JSON.stringify({
      requestHeaders: request.requestHeaders,
      requestParameters: request.requestParameters,
      storage: request.storage,
      filename: request.file.name || '',
      filesize: request.file.size || ''
    });
    return this.fetch(url, {
      method: "POST",
      body: body
    });
  }

  /**
   * 上传文件(先进行签名)
   * @method upload
   * @param {Object} request 上传请求对象
   * @param {string} request.storage 要使用存储引擎名称
   * @param {string} request.commitStorage 提交时候要使用的存储引擎名称，解决跨网上传问题，默认使用storage
   * @param {Object} request.file 文件对象，例如：document.getElementById("fileInput").files[0]
   * @param {string} request.contentType 文件内容类型
   * @param {string} request.accessControl 文件的访问权限，PRIVATE、PUBLIC_READ、PUBLIC_READ_WRITE
   * @param {Object} request.metadata 文件元数据
   * @param {Object} request.requestHeaders 要签名的请求头
   * @param {Object} request.requestParameters 要签名的请求参数
   * @param {Object} request.responseHeaders 以后进行文件下载时，文件的 HTTP Response Headers
   * @returns {Promise<FileStatus>} 已经成功上传的文件信息，See {@link https://docs.bingosoft.net/paas/ufs/api/storage/_book/definitions.html#file_status}
   */
  upload(request, options) {
    request = request || {};
    options = options || {};
    options.headers = options.headers || {};

    //获取文件签名
    return this.generatePresignedUpload(request)
      .then(res => {
        if (typeof res == "string") {
          res = JSON.parse(res);
        }
        if (res.url) {
          options.headers = Object.assign(options.headers, res.headers);
          //兼容相对路径地址
          if (!res.url.startsWith("http") && options.baseUrl) {
            res.url = rebuildUrlIfNecessary(res.url, options);
          }
          //上传文件
          return uploadAdapter(res.url, options, request.file).then(() => {
            return new Promise((resolve, reject) => {
              resolve(res.uploadId);
            });
          });
        }
      })
      .then(uploadId => {
        const responseHeaders = { 
            'Content-Disposition': "inline; filename=" + "'" + request.file.metadata.filename + "'"
        }
        //提交commit
        let url = `${this.url}/file/upload/commit`;
        let body = JSON.stringify({
            "storage": request.commitStorage || request.storage, 
            "uploadId": uploadId,
            "contentType": request.contentType,
            "accessControl": request.accessControl,
            "responseHeaders": responseHeaders,
            "metadata": request.file.metadata
        });
        return this.fetch(url, {
            method: "POST",
            body:body
        });
      });
  }

  /**
   * 签名文件下载请求，并返回产生的文件下载 URL信息（object)
   * @method urlFor
   * @param {Object} request 请求信息
   * @param {String} request.fileId 文件 ID
   * @param {String} request.storage 要使用存储引擎名称
   * @param {Object} request.requestHeaders 要进行签要的 HTTP 请求头
   * @param {Object} request.requestParameters 要进行签名的 HTTP QUERY 参数
   * @param {Object} request.responseHeaderOverrides 下载时要重写的文件 HTTP Response Headers
   * @param {String} request.expires 过期时间，单位是秒，设置-1获取永久地址
   * @returns {Promise<String>} 下载地址 URL
   */
  urlFor(request) {
    let url = `${this.url}/file/download/sign`;
    let body = JSON.stringify(request);
    return this.fetch(url, {
      method: "POST",
      body: body
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
      fileId: fileId
    });
    return this.fetch(url, {
      method: "DELETE",
      body: body
    });
  }

    /**
     * 预览文件
     * {Object} request 请求体
     * {String}} request.fileId 文件 ID
     * @returns {Promise} 
     */
    preview(request, options) {
        request = request || {};
        options = options || {};
        options.headers=options.headers||{};
        //获取文件签名
        let url = `http://10.201.33.79:31064/preview/preview/oweb365/file?x-ufs-s=5d366449734bcfdcea60508aaec6a012a65a52a8e0b550b7b7538418ca93b9a61`;
        let body = JSON.stringify({
            "fileId": request.fileId
        });
        return this.fetch(url, {
            method: "POST",
            body:body
        });
    }
}

/**
 * @class ConvertClient
 */
export class ConvertBase {
  /**
   *  构造函数
   * @param {string} url UFS 服务器 URL
   * @param {string} appId 应用 ID
   * @param {Object} options 选项
   * @param {(string|function)} options.accessToken 访问令牌
   */
  constructor(url, appId, options) {
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
  fetch(url, options) {
    let headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.accessToken,
      "x-appId": this.appId
    };
    options.headers = Object.assign({}, options.headers, headers);
    return fetchAdapter(url, options);
  }

  /**
   * 添加文件转换作业
   * @param {Object} request 请求信息
   * @returns {Promise<ConvertStatus>}
   */
  enqueue(request) {
    let url = `${this.url}/convert`;
    let body = JSON.stringify(request);
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
  status(fileId, kind, name) {
    let url = `${this.url}/convert?fileId=${fileId}&kind=${kind}&name=${name}`;
    return this.fetch(url);
  }

  /**
   * 估算转换作业耗时
   * @param {string} fileId 文件 ID
   * @param {string} kind 转换种类
   * @param {string} params 转换参数
   * @returns {Promise<number>} 耗时（毫秒）
   */
  estimatedTime(fileId, kind, params) {
    let url = `${this.url}/convert/estimateTime?fileId=${fileId}&kind=${kind}`;
    if (params) {
      url += "&params=" + encodeURIComponent(params);
    }
    return this.fetch(url);
  }
}
