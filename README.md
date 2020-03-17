# ufs-client-js 

该JSSDK支持在Web、BT、Weex中使用，内部会自动适配所在框架环境。SDK暂不支持：应用注册、应用注销、预览 API。


# 安装&引入

## npm安装：

```javascript
npm install ufs-client-js --save
```

导入模块：

```javascript
// web模块化工程中引入
import { StorageClient } from "ufs-client-js";

// weex中引入
const ufs = require("ufs-client-js");

```

## BUI安装
假如是BT或者BUI的工程，可以直接下载 [src/ufs-bt-plugin.js](https://github.com/bingo-oss/ufs-js/blob/master/src/ufs-bt-plugin.js),并将其引入页面：

```html
<script src="./script/ufs-bt-plugin.js"></script>
```
该js会把 ufs 对象暴露在window下面，可以通过 `ufs.upload` 进行直接操作。


# 使用指南


## Web 示例
以选择文件上传为例, BUI中如果使用input type='file'选择的文件也可以通过这种方式操作。

```html
<input id="fileInput" type="file">
```

```JavaScript

function testUpload() {
    //根据实际情况更换地址
    let apiServer = "http://ufs-dev.bingosoft.net/api/";
    //初始化对象，并传入 AccessToken，可以通过app.link.getToken获取
    let storageClient = new StorageClient(apiServer, {
        accessToken: "ead89b24-4fe1-48cd-813f-1947c0bca62f"
    });
    //获取文件对象
    let files = document.getElementById("fileInput").files;
    if(files.length==0){
        alert("请先选择文件");
        return;
    }
    //执行上传
    storageClient.upload({
        file: files[0]
    }).then((data, resp) => {
        alert(JSON.stringify(data));
        //上传完成并得到路径
        storageClient.urlFor({
            fileId: data.id
        }).then(urlInfo => {
            alert(JSON.stringify(urlInfo));
        });
    }).catch((err) => {
        alert(JSON.stringify(err));
    });
}

```

## Weex示例

以拍照上传为例：

```JavaScript
testUpload(){
    //根据实际情况更换地址
    let apiServer = "http://ufs-dev.bingosoft.net/api/";
    let storageClient = new StorageClient(apiServer,{
        accessToken:"ead89b24-4fe1-48cd-813f-1947c0bca62f"
    });
        //使用Camera模块
    let camera = weex.requireModule("CameraModule");
    let params ={};

    //场景：拍照上传
    camera.captureImage(params, (res)=>{
        let filePath = res.filePaths[0];
        if(!filePath){this.$toast("上传文件不存在!");return;}
        
        //压缩图片再上传
        camera.compressImage({
            sourcePath:filePath,
            quality:50
        },(res)=>{
            filePath = res.filePaths[0];
            this.$alert(filePath);
            
            //执行上传文件
            storageClient.upload({
                file:filePath
            }).then((data,resp)=>{
                this.$alert(data);
                
                //上传完成并得到路径
                storageClient.urlFor({
                    fileId: data.id
                }).then(url => {
                    this.$alert(url);
                });
            }).catch((resp)=>{
                this.$alert(resp);
            });
        });

    });
}
```


## BT/BUI示例

```JavaScript

//选择图片或者拍照
navigator.camera.getPicture(function (imageURI) {
        window.resolveLocalFileSystemURI(imageURI, gotFileEntry, onFileFail);
        function gotFileEntry(fileEntry) {
            filePath = fileEntry.fullPath;
            //得到图片路径并上传
            upload(filePath);
        }
        function onFileFail(err) {
            app.alert(err);
        }
    },
    function (message) {
        app.alert('get picture failed');
    }, {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    }
);

function upload(filePath) {
    //执行上传
    ufs.upload({
        server:apiServer,
        token:token,
        file:filePath
    },(res)=>{
        var fileId = res.id;
        app.alert("fileId:"+res.id);

        //根据fileId获取上传后的路径
        ufs.urlFor({
            server:"http://ufs-dev.bingosoft.net/api/",//替换成实际的
            token:"95945422-a5a9-43c8-b126-51aea17367f3", //替换成实际的
            fileId:fileId
        },(res)=>{
            app.alert(res);
        },(err)=>{
            app.alert(err);
        });
    },(err)=>{
        alert(err);
    });
}
```


# API 参考

更多API的接口，请参考:

Web & Weex => [UFS API](https://github.com/bingo-oss/ufs-js/blob/master/docs/api.md)

BUI => [UFS-BT API](https://github.com/bingo-oss/ufs-js/blob/master/docs/api-bt.md)