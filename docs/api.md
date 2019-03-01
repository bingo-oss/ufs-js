## Classes

<dl>
<dt><a href="#StorageClient">StorageClient</a></dt>
<dd><p>UFS 文件存储客户端 适用于 Web和Weex</p>
</dd>
<dt><a href="#ConvertClient">ConvertClient</a></dt>
<dd><p>UFS 文件转换客户端 适用于 Web和Weex</p>
</dd>
</dl>

<a name="StorageClient"></a>

## StorageClient
UFS 文件存储客户端 适用于 Web和Weex

**Kind**: global class  

* [StorageClient](#StorageClient)
    * [new exports.StorageClient(url, options)](#new_StorageClient_new)
    * [.fetch(url, options)](#StorageClient+fetch)
    * [.status(fileId)](#StorageClient+status) ⇒ <code>Promise.&lt;FileStatus&gt;</code>
    * [.getResponseHeaders(fileId)](#StorageClient+getResponseHeaders)
    * [.getMetadata(fileId)](#StorageClient+getMetadata)
    * [.generatePresignedUpload(request)](#StorageClient+generatePresignedUpload) ⇒ <code>Promise.&lt;UploadSignResult&gt;</code>
    * [.upload(request)](#StorageClient+upload) ⇒ <code>Promise.&lt;FileStatus&gt;</code>
    * [.urlFor(request)](#StorageClient+urlFor) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.delete(fileId)](#StorageClient+delete) ⇒ <code>Promise</code>

<a name="new_StorageClient_new"></a>

### new exports.StorageClient(url, options)
构造函数


| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | 服务器 URL |
| options | <code>Object</code> | 选项 |
| options.accessToken | <code>string</code> \| <code>function</code> | 访问令牌 |

<a name="StorageClient+fetch"></a>

### storageClient.fetch(url, options)
发送请求

**Kind**: instance method of [<code>StorageClient</code>](#StorageClient)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | 请求URL |
| options | <code>Object</code> | 选项 |

<a name="StorageClient+status"></a>

### storageClient.status(fileId) ⇒ <code>Promise.&lt;FileStatus&gt;</code>
获取指定的文件信息

**Kind**: instance method of [<code>StorageClient</code>](#StorageClient)  
**Returns**: <code>Promise.&lt;FileStatus&gt;</code> - See [https://docs.bingosoft.net/paas/ufs/api/storage/_book/definitions.html#file_status](https://docs.bingosoft.net/paas/ufs/api/storage/_book/definitions.html#file_status)  

| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | 文件 ID |

<a name="StorageClient+getResponseHeaders"></a>

### storageClient.getResponseHeaders(fileId)
获取指定文件的响应头信息

**Kind**: instance method of [<code>StorageClient</code>](#StorageClient)  

| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | 文件 ID |

<a name="StorageClient+getMetadata"></a>

### storageClient.getMetadata(fileId)
获取指定文件的元数据信息

**Kind**: instance method of [<code>StorageClient</code>](#StorageClient)  

| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | 文件 ID |

<a name="StorageClient+generatePresignedUpload"></a>

### storageClient.generatePresignedUpload(request) ⇒ <code>Promise.&lt;UploadSignResult&gt;</code>
上传签名

**Kind**: instance method of [<code>StorageClient</code>](#StorageClient)  
**Returns**: <code>Promise.&lt;UploadSignResult&gt;</code> - 已经成功上传的文件信息，See [https://docs.bingosoft.net/paas/ufs/api/storage/_book/definitions.html#uploadsignresult](https://docs.bingosoft.net/paas/ufs/api/storage/_book/definitions.html#uploadsignresult)  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Object</code> | 要进行签名的上传请求 |
| request.storage | <code>string</code> | 要使用存储引擎名称 |
| request.file | <code>Object</code> | 文件对象，例如：document.getElementById("fileInput").files[0] |
| request.requestHeaders | <code>Object</code> | 要签名的请求头 |
| request.requestParameters | <code>Object</code> | 要签名的请求参数 |

<a name="StorageClient+upload"></a>

### storageClient.upload(request) ⇒ <code>Promise.&lt;FileStatus&gt;</code>
上传文件(先进行签名)

**Kind**: instance method of [<code>StorageClient</code>](#StorageClient)  
**Returns**: <code>Promise.&lt;FileStatus&gt;</code> - 已经成功上传的文件信息，See [https://docs.bingosoft.net/paas/ufs/api/storage/_book/definitions.html#file_status](https://docs.bingosoft.net/paas/ufs/api/storage/_book/definitions.html#file_status)  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Object</code> | 上传请求对象 |
| request.storage | <code>string</code> | 要使用存储引擎名称 |
| request.commitStorage | <code>string</code> | 提交时候要使用的存储引擎名称，解决跨网上传问题，默认使用storage |
| request.file | <code>Object</code> | 文件对象，例如：document.getElementById("fileInput").files[0] |
| request.contentType | <code>string</code> | 文件内容类型 |
| request.accessControl | <code>string</code> | 文件的访问权限，PRIVATE、PUBLIC_READ、PUBLIC_READWRITE |
| request.metadata | <code>Object</code> | 文件元数据 |
| request.requestHeaders | <code>Object</code> | 要签名的请求头 |
| request.requestParameters | <code>Object</code> | 要签名的请求参数 |
| request.responseHeaders | <code>Object</code> | 以后进行文件下载时，文件的 HTTP Response Headers |

<a name="StorageClient+urlFor"></a>

### storageClient.urlFor(request) ⇒ <code>Promise.&lt;String&gt;</code>
签名文件下载请求，并返回产生的文件下载 URL信息（object)

**Kind**: instance method of [<code>StorageClient</code>](#StorageClient)  
**Returns**: <code>Promise.&lt;String&gt;</code> - 下载地址 URL  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Object</code> | 请求信息 |
| request.fileId | <code>string</code> | 文件 ID |
| request.storage | <code>string</code> | 要使用存储引擎名称 |
| request.requestHeaders | <code>Object</code> | 要进行签要的 HTTP 请求头 |
| request.requestParameters | <code>Object</code> | 要进行签名的 HTTP QUERY 参数 |
| request.responseHeaderOverrides | <code>Object</code> | 下载时要重写的文件 HTTP Response Headers |

<a name="StorageClient+delete"></a>

### storageClient.delete(fileId) ⇒ <code>Promise</code>
删除文件

**Kind**: instance method of [<code>StorageClient</code>](#StorageClient)  

| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | 文件 ID |

<a name="ConvertClient"></a>

## ConvertClient
UFS 文件转换客户端 适用于 Web和Weex

**Kind**: global class  

* [ConvertClient](#ConvertClient)
    * [new exports.ConvertClient(url, appId, options)](#new_ConvertClient_new)
    * [.fetch(url, options)](#ConvertClient+fetch)
    * [.enqueue(request)](#ConvertClient+enqueue) ⇒ <code>Promise.&lt;ConvertStatus&gt;</code>
    * [.status(fileId, kind, name)](#ConvertClient+status) ⇒ <code>Promise.&lt;ConvertStatus&gt;</code>
    * [.estimatedTime(fileId, kind, params)](#ConvertClient+estimatedTime) ⇒ <code>Promise.&lt;number&gt;</code>

<a name="new_ConvertClient_new"></a>

### new exports.ConvertClient(url, appId, options)
构造函数


| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | UFS 服务器 URL |
| appId | <code>string</code> | 应用 ID |
| options | <code>Object</code> | 选项 |
| options.accessToken | <code>string</code> \| <code>function</code> | 访问令牌 |

<a name="ConvertClient+fetch"></a>

### convertClient.fetch(url, options)
发送请求

**Kind**: instance method of [<code>ConvertClient</code>](#ConvertClient)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | 请求URL |
| options | <code>Object</code> | 选项 |

<a name="ConvertClient+enqueue"></a>

### convertClient.enqueue(request) ⇒ <code>Promise.&lt;ConvertStatus&gt;</code>
添加文件转换作业，See [https://docs.bingosoft.net/paas/ufs/api/convert/_book/definitions.html#convertrequest](https://docs.bingosoft.net/paas/ufs/api/convert/_book/definitions.html#convertrequest)

**Kind**: instance method of [<code>ConvertClient</code>](#ConvertClient)  
**Returns**: <code>Promise.&lt;ConvertStatus&gt;</code> - See [https://docs.bingosoft.net/paas/ufs/api/convert/_book/definitions.html#convertstatus](https://docs.bingosoft.net/paas/ufs/api/convert/_book/definitions.html#convertstatus)  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Object</code> | 请求信息 |

<a name="ConvertClient+status"></a>

### convertClient.status(fileId, kind, name) ⇒ <code>Promise.&lt;ConvertStatus&gt;</code>
获取指定的转换作业情况

**Kind**: instance method of [<code>ConvertClient</code>](#ConvertClient)  
**Returns**: <code>Promise.&lt;ConvertStatus&gt;</code> - See [https://docs.bingosoft.net/paas/ufs/api/convert/_book/definitions.html#convertstatus](https://docs.bingosoft.net/paas/ufs/api/convert/_book/definitions.html#convertstatus)  

| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | 文件 ID |
| kind | <code>string</code> | 转换种类 |
| name | <code>string</code> | 转换名称 |

<a name="ConvertClient+estimatedTime"></a>

### convertClient.estimatedTime(fileId, kind, params) ⇒ <code>Promise.&lt;number&gt;</code>
估算转换作业耗时

**Kind**: instance method of [<code>ConvertClient</code>](#ConvertClient)  
**Returns**: <code>Promise.&lt;number&gt;</code> - 耗时（毫秒）  

| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | 文件 ID |
| kind | <code>string</code> | 转换种类 |
| params | <code>string</code> | 转换参数 |

