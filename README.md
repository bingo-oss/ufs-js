# ufs-js 

该JSSDK支持Web、BT、Weex中使用，内部会自动适配所在框架环境。SDK暂不支持：应用注册、应用注销、预览 API。


# 安装&引入

## npm安装：

```
npm install ufs-js --save
```
代码中引入

```
import {StorageClient,ConvertClient} from "ufs-js";

```

## web安装
假如工程中没有使用npm进行管理，可以直接下载 [dist/ufs.js](https://github.com/bingo-oss/ufs-client-js/blob/master/dist/ufs.js) ,并将其引入到页面:

```JavaScript
<script src="./script/ufs.js"></script>

```
该js会把 ufs 对象暴露在window下面，可以通过 `ufs.StorageClient` / `ufs.ConvertClient `获取相关对象。



# 使用指南


## Web\BT示例(BUI适用）
以选择文件上传为例

```JavaScript
...
<input id="fileInput" type="file">
...


function testUpload() {
		//根据实际情况更换地址
		let apiServer = "http://ufs-dev.bingosoft.net/api/";
		//初始化对象，并传入 AccessToken，可以通过 app.link.getToken获取
		let storageClient = new ufs.StorageClient(apiServer, {
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
}
```

