## Classes

<dl>
<dt><a href="#StorageClient">StorageClient</a></dt>
<dd></dd>
<dt><a href="#ConvertClient">ConvertClient</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#status">status(fileId)</a> ⇒ <code>Promise.&lt;FileStatus&gt;</code></dt>
<dd><p>获取指定的文件信息</p>
</dd>
<dt><a href="#getResponseHeaders">getResponseHeaders(fileId)</a></dt>
<dd><p>获取指定文件的响应头信息</p>
</dd>
<dt><a href="#getMetadata">getMetadata(fileId)</a></dt>
<dd><p>获取指定文件的元数据信息</p>
</dd>
<dt><a href="#upload">upload(request, options)</a> ⇒ <code>Promise</code></dt>
<dd><p>上传文件，包含签名上传提交过程</p>
</dd>
<dt><a href="#urlFor">urlFor(request)</a> ⇒ <code>Promise</code></dt>
<dd><p>获取下载文件信息</p>
</dd>
<dt><a href="#delete">delete(fileId)</a> ⇒ <code>Promise</code></dt>
<dd><p>删除文件</p>
</dd>
<dt><a href="#preview">preview(request)</a> ⇒ <code>Promise</code></dt>
<dd><p>预览文件</p>
</dd>
<dt><a href="#multiFileDownload">multiFileDownload(fileIds, options)</a></dt>
<dd><p>多文件下载，并生成zip(仅支持web端，weex端暂不支持)</p>
</dd>
</dl>

<a name="StorageClient"></a>

## StorageClient
**Kind**: global class  
<a name="new_StorageClient_new"></a>

### new StorageClient()
ufs存储客户端

<a name="ConvertClient"></a>

## ConvertClient
**Kind**: global class  
<a name="status"></a>

## status(fileId) ⇒ <code>Promise.&lt;FileStatus&gt;</code>
获取指定的文件信息

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | 文件 ID |

<a name="getResponseHeaders"></a>

## getResponseHeaders(fileId)
获取指定文件的响应头信息

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | 文件 ID |

<a name="getMetadata"></a>

## getMetadata(fileId)
获取指定文件的元数据信息

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | 文件 ID |

<a name="upload"></a>

## upload(request, options) ⇒ <code>Promise</code>
上传文件，包含签名上传提交过程

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Object</code> | 上传请求对象 |
| request.storage | <code>String</code> | 要使用存储引擎名称 |
| request.commitStorage | <code>String</code> | 提交时候要使用的存储引擎名称，解决跨网上传问题，默认使用storage |
| request.file | <code>Object</code> | 文件对象，例如：document.getElementById("fileInput").files[0] |
| request.filename | <code>String</code> | 文件名称 |
| request.filesize | <code>Integer</code> | 文件大小 |
| request.contentType | <code>String</code> | 文件内容类型 |
| request.accessControl | <code>String</code> | 文件的访问权限 |
| request.metadata | <code>Object</code> | 文件元数据 |
| request.requestHeaders | <code>Object</code> | 要签名的请求头 |
| request.requestParameters | <code>Object</code> | 要签名的请求参数 |
| request.responseHeaders | <code>Object</code> | 以后进行文件下载时，文件的 HTTP Response Headers，commit阶段使用 |
| options | <code>Object</code> | 其他参数 |
| options.onProgress | <code>function</code> | 进度回调方法 |
| options.headers | <code>Object</code> | http请求头 |

<a name="urlFor"></a>

## urlFor(request) ⇒ <code>Promise</code>
获取下载文件信息

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Object</code> | 请求信息 |
| request.fileId | <code>String</code> | 文件 ID |
| request.storage | <code>String</code> | 要使用存储引擎名称 |
| request.requestHeaders | <code>Object</code> | 要进行签要的 HTTP 请求头 |
| request.requestParameters | <code>Object</code> | 要进行签名的 HTTP QUERY 参数 |
| request.responseHeaderOverrides | <code>Object</code> | 下载时要重写的文件 HTTP Response Headers |
| request.expires | <code>String</code> | 过期时间，单位是秒，设置-1获取永久地址 |

<a name="delete"></a>

## delete(fileId) ⇒ <code>Promise</code>
删除文件

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | 文件 ID |

<a name="preview"></a>

## preview(request) ⇒ <code>Promise</code>
预览文件

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Object</code> | 请求体 |
| request.url | <code>String</code> | 预览服务 URL |
| request.fileId | <code>String</code> | 文件 ID |
| request.xUfsS | <code>String</code> | 签名信息 |
| request.appId | <code>String</code> | 应用Id |

<a name="multiFileDownload"></a>

## multiFileDownload(fileIds, options)
多文件下载，并生成zip(仅支持web端，weex端暂不支持)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| fileIds | <code>Array.&lt;String&gt;</code> | 文件Id |
| options | <code>Object</code> | 下载文件的参数 |
| options.zipName | <code>String</code> | 下载文件的名称 |
| options.zipFolder | <code>String</code> | zip解压后的文件夹 |
| options.fileNameReplaceRegExp | <code>String</code> | 文件名称替换表达式，根据表达式替换掉内容 |
| options.autoDownload | <code>Boolean</code> | 是否自动保存下载 |
| options.storage | <code>String</code> | 要使用存储引擎名称 |
| options.requestHeaders | <code>Object</code> | 要进行签要的 HTTP 请求头 |
| options.requestParameters | <code>Object</code> | 要进行签名的 HTTP QUERY 参数 |
| options.responseHeaderOverrides | <code>Object</code> | 下载时要重写的文件 HTTP Response Headers |
| options.expires | <code>String</code> | 过期时间，单位是秒，设置-1获取永久地址 |

