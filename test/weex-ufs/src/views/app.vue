<template>
  <div class="center">
    <bui-image src="/image/logo.png" width="120px" height="120px"></bui-image>
    <text class="h2">BUI-Weex</text>
    <bui-button @click="choose()">选择文件</bui-button>
    <bui-image :src="filePath" style="width:200px; height:200px;"></bui-image>
    <bui-button @click="upload()">上传文件</bui-button>
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
    };
  },
  mounted() {
    globalEvent.addEventListener("androidback", e => {
      this.$pop();
    });
    this.$alert(typeof exports === 'object' && typeof module === 'object');
  },
  methods: {
    choose: function() {
      let params = {};
      linkapi.chooseFile(res => {
        this.$alert(res);
        this.filePath = res;
      });
    },
    upload: function() {
      if(this.filePath == '') return;
      // 获取文件名
      let fileName = this.filePath.substring(this.filePath.lastIndexOf('/')+1);
      // 设置ufs服务地址 和 token(token来自sso)
      let token = "bG9jYWw6NjY1MTc1ZGYtMGRkMy00OTc5LWJmNzYtNzQxZjM1M2YyMmM0";
      let apiServer = "http://10.200.21.128:31065/api";
      let storage = new ufs.StorageClient(apiServer,{
        accessToken: token
      });
      storage.upload({
        file: this.filePath,
        accessControl:'PUBLIC_READ_WRITE'
      }).then((data,resp)=>{
          this.$alert(data);
          let fileId = data.id;
          storage.urlFor({
            fileId: fileId,
            responseHeaderOverrides:{
              'Content-Disposition':`attachment; filename=${fileName}`
            }
          }).then(res => {
            this.$alert(res.url);
            // this.filePath =res.url;
          });
      }).catch(err=>{
         this.$alert(err);
      })
    }
  }
};
</script>