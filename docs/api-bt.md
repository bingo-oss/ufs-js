<a name="ufs"></a>

## ufs
**Kind**: global class  

* [ufs](#ufs)
    * [new ufs()](#new_ufs_new)
    * [.upload(options, success, error)](#ufs.upload)
    * [.urlFor(options, success, error)](#ufs.urlFor)
    * [.delete(options, success, error)](#ufs.delete)
    * [.status(options, success, error)](#ufs.status)
    * [.getResponseHeaders(options, success, error)](#ufs.getResponseHeaders)
    * [.getMetadata(options, success, error)](#ufs.getMetadata)

<a name="new_ufs_new"></a>

### new ufs()
UFS BingoTouch Plugin 适用于BingoTouch，BUI中使用

<a name="ufs.upload"></a>

### ufs.upload(options, success, error)
上传文件

**Kind**: static method of [<code>ufs</code>](#ufs)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | 参数信息 |
| options.server | <code>string</code> | UFS部署的地址 |
| options.token | <code>string</code> | 验证令牌 |
| options.file | <code>string</code> | 文件路径，拍照或者选择文件后的物理路径 |
| options.storage | <code>string</code> | 要使用存储引擎名称 |
| options.commitStorage | <code>string</code> | 提交时候要使用的存储引擎名称，默认使用storage |
| options.accessControl | <code>string</code> | 文件的访问权限，PRIVATE、PUBLIC_READ、PUBLIC_READWRITE |
| success | <code>function</code> | 成功回调 |
| error | <code>function</code> | 失败回调 |

<a name="ufs.urlFor"></a>

### ufs.urlFor(options, success, error)
获取文件url

**Kind**: static method of [<code>ufs</code>](#ufs)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | 参数信息 |
| options.server | <code>string</code> | UFS部署的地址 |
| options.fileId | <code>string</code> | 文件ID |
| options.token | <code>string</code> | 验证令牌 |
| options.storage | <code>string</code> | 要使用存储引擎名称 |
| options.requestHeaders | <code>object</code> | 要进行签要的 HTTP 请求头 |
| options.requestParameters | <code>object</code> | 要进行签名的 HTTP QUERY 参数 |
| options.responseHeaderOverrides | <code>object</code> | 下载时要重写的文件 HTTP Response Headers |
| success | <code>function</code> | 成功回调 |
| error | <code>function</code> | 失败回调 |

<a name="ufs.delete"></a>

### ufs.delete(options, success, error)
删除文件

**Kind**: static method of [<code>ufs</code>](#ufs)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | 参数信息 |
| options.server | <code>string</code> | UFS部署的地址 |
| options.fileId | <code>string</code> | 文件ID |
| options.token | <code>string</code> | 验证令牌 |
| success | <code>function</code> | 成功回调 |
| error | <code>function</code> | 失败回调 |

<a name="ufs.status"></a>

### ufs.status(options, success, error)
获取文件状态

**Kind**: static method of [<code>ufs</code>](#ufs)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | 参数信息 |
| options.server | <code>string</code> | UFS部署的地址 |
| options.fileId | <code>string</code> | 文件ID |
| options.token | <code>string</code> | 验证令牌 |
| success | <code>function</code> | 成功回调 |
| error | <code>function</code> | 失败回调 |

<a name="ufs.getResponseHeaders"></a>

### ufs.getResponseHeaders(options, success, error)
获取header

**Kind**: static method of [<code>ufs</code>](#ufs)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | 参数信息 |
| options.server | <code>string</code> | UFS部署的地址 |
| options.fileId | <code>string</code> | 文件ID |
| options.token | <code>string</code> | 验证令牌 |
| success | <code>function</code> | 成功回调 |
| error | <code>function</code> | 失败回调 |

<a name="ufs.getMetadata"></a>

### ufs.getMetadata(options, success, error)
获取文件元数据

**Kind**: static method of [<code>ufs</code>](#ufs)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | 参数信息 |
| options.server | <code>string</code> | UFS部署的地址 |
| options.fileId | <code>string</code> | 文件ID |
| options.token | <code>string</code> | 验证令牌 |
| success | <code>function</code> | 成功回调 |
| error | <code>function</code> | 失败回调 |

