import { StorageClient } from "../src/ufs";

let apiServer = "https://dfuse.bingosoft.net/ufsapi";
let ssoServer = "https://dfuse.bingosoft.net/sso";
let previewUrl = "https://dfuse.bingosoft.net/ufsview";
let appId = "d0FweHJXdU1jUkpTNTM2UnV4WEtmQw";
let username = "pengwei001";
let password = "111111";
let clientId = "app1";
let clientSecret = "app1";

// 打印日志
let log = (log, clear) => {
  if (!clear) {
    let oLog = document.getElementById("result").innerHTML;
    log = oLog === "" ? `${log}` : `${oLog}</br>${log}`;
  }
  document.getElementById("result").innerHTML = log;
};

// 全局对象
window.storageClient = null;
window.file = null;
window.fileId = null;

window.resetEnv = () => {
   document.getElementById("apiServer").value = apiServer;
   document.getElementById("ssoServer").value = ssoServer;
   document.getElementById("previewUrl").value = previewUrl;
   document.getElementById("appId").value = appId;
   document.getElementById("username").value = username;
   document.getElementById("password").value = password;
   document.getElementById("ssoServer").value = ssoServer;
   document.getElementById("clientId").value = clientId;
   document.getElementById("clientSecret").value = clientSecret;
}

let getEnv = () => {
   apiServer = document.getElementById("apiServer").value;
   ssoServer = document.getElementById("ssoServer").value;
   previewUrl = document.getElementById("previewUrl").value;
   appId = document.getElementById("appId").value;
   username = document.getElementById("username").value;
   password = document.getElementById("password").value;
   clientId = document.getElementById("clientId").value;
   clientSecret = document.getElementById("clientSecret").value;
}

resetEnv();

// 初始化基础环境，拿到AccessToken 和初始化StorageClient
window.initEnv = () => {
  getEnv();
  let formData = `grant_type=password&username=${username}&password=${password}&client_id=${clientId}&client_secret=${clientSecret}`;
  return fetch(`${ssoServer}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(result) {
      let options = {
        accessToken: result.access_token,
        appId: appId,
        version: "1.4.1" // 1.3.2版本之后需要传版本
      };
      log(`AccessToken: ${result.access_token}`);
      storageClient = new StorageClient(apiServer, options);
    })
    .catch(err => {
      log(err);
    });
};

// 执行上传
window.testUpload = file => {
  if (!storageClient) return;
  window.file = file;
  return storageClient
    .upload({
      file: file
    })
    .then(result => {
      log(`上传结果: ${JSON.stringify(result)}`);
      window.fileId = result.id;
      document.getElementById("fileId").value = result.id;
    });
};

// 获取文件下载信息
window.getDownloadInfo = () => {
  if (!storageClient) return;
  return storageClient
    .urlFor({
      fileId: window.fileId,
      responseHeaderOverrides: {
        // "Content-Disposition": `attachment; filename=${window.file.name}`
        // "Content-Disposition": "form-data; name=file",
        // "Content-Type": "image/png"
      }
    })
    .then(res => {
      log(`下载文件路径: ${res.url}`);
    });
};

// 获取文件信息
window.getFileInfo = () => {
  if (!storageClient) return;
  return storageClient.status(window.fileId).then(res => {
    log(`文件信息: ${JSON.stringify(res)}`);
  });
};

// 获取文件header
window.getFileHeaderInfo = () => {
  if (!storageClient) return;
  return storageClient.getResponseHeaders(window.fileId).then(res => {
    log(`Header: ${JSON.stringify(res)}`);
  });
};

// 获取文件元数据
window.getFileMetaInfo = () => {
  if (!storageClient) return;
  return storageClient.getMetadata(window.fileId).then(res => {
    log(`Metadata: ${JSON.stringify(res)}`);
  });
};

window.getPreviewSign = () => {
  let fileId = document.getElementById("fileId").value;
  if (!storageClient) return;
  let request = {
    url: previewUrl,
    fileId: fileId
  }
  return storageClient.generatePreviewSign(request).then(res => {
    log(`Metadata: ${JSON.stringify(res)}`);
  });
}

// 预览文件Office365
window.preViewFile = () => {
  let xUfsS = document.getElementById("xUfsS").value;
  let fileId = document.getElementById("fileId").value;
  if(xUfsS == "") return;
  if (!storageClient) return;
  let request = {
      url: previewUrl,
      fileId: fileId,
      xUfsS: xUfsS
  }
  return storageClient.preview(request).then(res => {
    log(`预览结果: ${JSON.stringify(res)}`);
  });
};

window.preViewImage = () => {
  let xUfsS = "d33a61f37c6902cc6fffed0343363fb875a303dd02b890af427acfe6e6fc4f66"; // document.getElementById("xUfsS").value;
  let fileId = "6743069151961473024"; // document.getElementById("fileId").value;
  if(xUfsS == "") return;
  if (!storageClient) return;
  let request = {
      url: previewUrl,
      fileId: fileId,
      xUfsS: xUfsS,
      outputFormat: "jpg"
  }
  console.log(storageClient);
  return storageClient.previewImage(request).then(res => {
    log(`预览结果: ${JSON.stringify(res)}`);
  });
}

window.fileDownloadZip = () => {
  if (!storageClient) return;
  let fileIds = [ window.fileId, "6683611312621686784","6683611621720920064","6683611912440713216","6683612292314632192" ];
  storageClient.multiFileDownload(fileIds, {
    zipName: "Example",
    zipFolder: "temp",
    autoDownload: true
  }).then(res => {
    console.log(typeof res);
    console.log(res);
  })
}