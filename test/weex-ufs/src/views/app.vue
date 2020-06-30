<template>
  <div class="center">
    <bui-image src="/image/logo.png" width="120px" height="120px"></bui-image>
    <text class="h2">BUI-Weex</text>
    <bui-button @click="choose">选择文件</bui-button>
    <bui-image :src="filePath" style="width:200px; height:200px;"></bui-image>
    <bui-button @click="upload">上传文件</bui-button>
    <bui-image :src="remoteImageUrl" width="300px" height="300px"></bui-image>
    <text>{{ remoteImageUrl }}</text>
  </div>
</template>

<!--引入bui-weex样式文件-->
<style lang="scss" src="bui-weex/src/css/buiweex.scss"></style>

<script>
const globalEvent = weex.requireModule("globalEvent");
const camera = weex.requireModule("CameraModule");
const linkapi = require("linkapi");
const ufs = require("ufs-client-js");

module.exports = {
  data() {
    return {
      filePath: "",
      remoteImageUrl: ""
    };
  },
  mounted() {
    globalEvent.addEventListener("androidback", e => {
      this.$pop();
    });
  },
  methods: {
    choose: function() {
      let params = {};
      // linkapi.chooseFile(res => {
      //   this.$alert(res);
      //   this.filePath = res;
      // });
      camera.captureImage(params, res => {
        let filePath = res.filePaths[0];
        if (!filePath) {
          this.$toast("上传文件不存在!");
          return;
        }
        this.filePath = filePath;
      });
    },
    upload: function() {
      if (this.filePath == "") return;
      // 获取文件名
      let fileName = this.filePath.substring(
        this.filePath.lastIndexOf("/") + 1
      );
      // 设置ufs服务地址 和 token(token来自sso)
      let token = "YmluZ286MzcwYTVkYTItMDE5OS00MzRhLWE4MjAtYWRkMTRlZjRiMWYw";
      let apiServer = "https://dfuse.bingosoft.net/ufsapi";
      let appId = "d0FweHJXdU1jUkpTNTM2UnV4WEtmQw";
      let storage = new ufs.StorageClient(apiServer, {
        accessToken: token,
        appId: appId
      });
      storage
        .upload({
          file: this.filePath,
          accessControl: "PUBLIC_READ_WRITE"
        }, {
          baseUrl: apiServer
        })
        .then((data, resp) => {
          // this.$alert(data);
          let fileId = data.id;
          storage
            .urlFor({
              fileId: fileId,
              responseHeaderOverrides: {
                "Content-Disposition": "form-data; name=file",
                "Content-Type": "image/png"
              }
            })
            .then(res => {
              this.$alert("xxxx:"+res.url);
              this.remoteImageUrl =  res.url;
            });
        })
        .catch(err => {
          this.$alert(err);
        });
    }
  }
};
</script>