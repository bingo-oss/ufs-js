/**
 * UFS BingoTouch Plugin 适用于BingoTouch，BUI中使用
 * @class ufs
 */
window.ufs = {};

/**
 * 上传文件
 * @method ufs.upload
 * @param {object} options 参数信息
 * @param {string} options.server UFS部署的地址
 * @param {string} options.token 验证令牌
 * @param {string} options.file 文件路径，拍照或者选择文件后的物理路径
 * @param {string} options.storage 要使用存储引擎名称
 * @param {string} options.commitStorage 提交时候要使用的存储引擎名称，默认使用storage
 * @param {string} options.accessControl 文件的访问权限，PRIVATE、PUBLIC_READ、PUBLIC_READWRITE
 * @param {function} success 成功回调
 * @param {function} error 失败回调
 */
ufs.upload = function (options,success,error){
    Cordova.exec(success,error,"UFSPlugin","upload",[options]);
}

/**
 * 获取文件url
 * @method ufs.urlFor
 * @param {object} options 参数信息
 * @param {string} options.server UFS部署的地址
 * @param {string} options.fileId 文件ID
 * @param {string} options.token 验证令牌
 * @param {string} options.storage 要使用存储引擎名称
 * @param {object} options.requestHeaders 要进行签要的 HTTP 请求头
 * @param {object} options.requestParameters 要进行签名的 HTTP QUERY 参数
 * @param {object} options.responseHeaderOverrides 下载时要重写的文件 HTTP Response Headers
 * @param {function} success 成功回调
 * @param {function} error 失败回调
 */
ufs.urlFor = function (options,success,error) {
    Cordova.exec(success,error,"UFSPlugin","urlFor",[options]);
}

/**
 * 删除文件
 * @method ufs.delete
 * @param {object} options 参数信息
 * @param {string} options.server UFS部署的地址
 * @param {string} options.fileId 文件ID
 * @param {string} options.token 验证令牌
 * @param {function} success 成功回调
 * @param {function} error 失败回调
 */
ufs.delete = function (options,success,error){
    Cordova.exec(success,error,"UFSPlugin","delete",[options]);
}

/**
 * 获取文件状态
 * @method ufs.status
 * @param {object} options 参数信息
 * @param {string} options.server UFS部署的地址 
 * @param {string} options.fileId 文件ID
 * @param {string} options.token 验证令牌
 * @param {function} success 成功回调
 * @param {function} error 失败回调
 */
ufs.status = function(options,success,error){
    Cordova.exec(success,error,"UFSPlugin","status",[options]);
}

/**
 * 获取header
 * @method ufs.getResponseHeaders
 * @param {object} options 参数信息
 * @param {string} options.server UFS部署的地址
 * @param {string} options.fileId 文件ID
 * @param {string} options.token 验证令牌
 * @param {function} success 成功回调
 * @param {function} error 失败回调
 */
ufs.getResponseHeaders = function(options,success,error){
    Cordova.exec(success,error,"UFSPlugin","getResponseHeaders",[options]);
}

/**
 * 获取文件元数据
 * @method ufs.getMetadata
 * @param {object} options 参数信息
 * @param {string} options.server UFS部署的地址
 * @param {string} options.fileId 文件ID
 * @param {string} options.token 验证令牌
 * @param {function} success 成功回调
 * @param {function} error 失败回调
 */
ufs.getMetadata = function(options,success,error){
    Cordova.exec(success,error,"UFSPlugin","getMetadata",[options]);
}