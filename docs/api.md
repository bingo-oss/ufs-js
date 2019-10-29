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
<dt><a href="#upload">upload(request)</a> ⇒ <code>Promise.&lt;FileStatus&gt;</code></dt>
<dd><p>上传文件(先进行签名)</p>
</dd>
<dt><a href="#urlFor">urlFor(request)</a> ⇒ <code>Promise.&lt;String&gt;</code></dt>
<dd><p>签名文件下载请求，并返回产生的文件下载 URL信息（object)</p>
</dd>
<dt><a href="#delete">delete(fileId)</a> ⇒ <code>Promise</code></dt>
<dd><p>删除文件</p>
</dd>
<dt><a href="#preview">preview(request, }, }, })</a> ⇒ <code>Promise</code></dt>
<dd><p>预览文件</p>
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
**Returns**: <code>Promise.&lt;FileStatus&gt;</code> - See [https://docs.bingosoft.net/paas/ufs/api/storage/_book/definitions.html#file_status](https://docs.bingosoft.net/paas/ufs/api/storage/_book/definitions.html#file_status)  

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

## upload(request) ⇒ <code>Promise.&lt;FileStatus&gt;</code>
上传文件(先进行签名)

**Kind**: global function  
**Returns**: <code>Promise.&lt;FileStatus&gt;</code> - 已经成功上传的文件信息，See [https://docs.bingosoft.net/paas/ufs/api/storage/_book/definitions.html#file_status](https://docs.bingosoft.net/paas/ufs/api/storage/_book/definitions.html#file_status)  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Object</code> | 上传请求对象 |
| request.storage | <code>string</code> | 要使用存储引擎名称 |
| request.commitStorage | <code>string</code> | 提交时候要使用的存储引擎名称，解决跨网上传问题，默认使用storage |
| request.file | <code>Object</code> | 文件对象，例如：document.getElementById("fileInput").files[0] |
| request.contentType | <code>string</code> | 文件内容类型 |
| request.accessControl | <code>string</code> | 文件的访问权限，PRIVATE、PUBLIC_READ、PUBLIC_READ_WRITE |
| request.metadata | <code>Object</code> | 文件元数据 |
| request.requestHeaders | <code>Object</code> | 要签名的请求头 |
| request.requestParameters | <code>Object</code> | 要签名的请求参数 |
| request.responseHeaders | <code>Object</code> | 以后进行文件下载时，文件的 HTTP Response Headers |

<a name="urlFor"></a>

## urlFor(request) ⇒ <code>Promise.&lt;String&gt;</code>
签名文件下载请求，并返回产生的文件下载 URL信息（object)

**Kind**: global function  
**Returns**: <code>Promise.&lt;String&gt;</code> - 下载地址 URL  

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

## preview(request, }, }, }) ⇒ <code>Promise</code>
预览文件

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Object</code> | 请求体 |
| } | <code>String</code> | request.url 预览服务 URL |
| } | <code>String</code> | request.fileId 文件 ID |
| } | <code>String</code> | request.xUfsS 签名信息 |

