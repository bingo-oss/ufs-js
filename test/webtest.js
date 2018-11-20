import {StorageClient,ConvertClient} from "../src/ufs";

const apiServer = "http://ufs-dev.bingosoft.net/api/";
const ssoServer = "http://10.201.78.206/sso";
const username = "admin";
const password = "cj123456";
const clientId = "apigw";
const clientSecret = "apigw";

//打印日志
let printLog =(log,clear)=>{
    if(!clear){
        let oLog = document.getElementById("result").innerHTML;
        log = (oLog===''?`${log}`:`${oLog}</br>${log}`);
    }
    document.getElementById("result").innerHTML = log;
}

//拿到accesstoken
let prepare = () => {
    let formData = `grant_type=password&username=${username}&password=${password}&client_id=${clientId}&client_secret=${clientSecret}`;
    return fetch(`${ssoServer}/oauth2/token`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    }).then(function (response) {
        return response.json()
    }).then(function (body) {
        let config = {
            url: apiServer,
            accessToken: body.access_token
        }
        printLog(`AccessToken: ${body.access_token}`);
        //构建client
        return new StorageClient(config.url, {
            accessToken: config.accessToken
        });
    }).catch(err=>{
        printLog(err);
    });
}

//执行上传
let uploadTest = (file) => {
    prepare().then(storageClient => {
        if(!storageClient)return;
        storageClient.upload({
            file: file
        }).then(fileStatus => {
            printLog(`上传结果: ${JSON.stringify(fileStatus)}`);
    
            return storageClient.urlFor({
                fileId: fileStatus.id
            }).then(res => {
                printLog(`文件路径: ${res.url}`);
            });
        });
    });
}

if (window) {
    window.ufsUploadTest = uploadTest;
}