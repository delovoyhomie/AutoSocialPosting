const http = require('http');
const url = require('url');
const qs = require('querystring');
const fs = require('fs')
const multiparty = require('multiparty');
const PythonShell = require('python-shell').PythonShell;

http.createServer((request, response) => {
    console.log("server work");
    console.log(request.method);
    if (request.method == "POST"){
        let body = "";
        request.on("data", function(data) {
            body += data;
        })
        request.on("end", function(){
            //console.log(body);
            let urlRec = url.parse(request.url, true);
            if (urlRec.query.upload == "0"){
                console.log("isPosting");
                let params = JSON.parse(body);
                if (JSON.stringify(params["photoPath"]) != "[]"){
                    queryStr = params["photoPath"];
                    queryStr[0]["caption"] = params["name"];
                    console.log(queryStr);
                    if (params["tg"]){
                        makePostMain(params["name"], queryStr);
                    }
                    if (params["vk"]){
                        let q = "";
                        for (let i = 0; i < params["photoPath"].length; ++i){
                            q += params["photoPath"][i]["media"] + " ";
                        }
                        while (q[q.length-1] == ' '){
                            q = q.substring(0, q.length-1);
                        }
                        console.log(q);
                        console.log(q[q.length-1]);
                        let options = {
                            args: [params["name"], "None", "None", q]
                        };
                        PythonShell.run('scriptVK.py', options, function (err) {})
                    }
                    if (params["ok"]){
                        let q = "";
                        for (let i = 0; i < params["photoPath"].length; ++i){
                            q += params["photoPath"][i]["media"] + " ";
                        }
                        while (q[q.length-1] == ' '){
                            q = q.substring(0, q.length-1);
                        }
                        console.log(q);
                        console.log(q[q.length-1]);
                        let optionsOdn = {
                            args: [params["name"], q]
                        };
                        console.log(optionsOdn);
                        PythonShell.run('scriptOK.py', optionsOdn, function (err) {})
                    }
                }
                else{
                    if (JSON.stringify(params["name"])){
                        console.log("not error(success)");
                        console.log(JSON.stringify(params["name"]));
                        if (params["tg"]){
                            makePostWithOutPhoto(params["name"]);
                        }
                        if (params["vk"]){
                            let q = "";
                            for (let i = 0; i < params["photoPath"].length; ++i){
                                q += params["photoPath"][i]["media"] + " ";
                            }
                            while (q[q.length-1] == ' '){
                                q = q.substring(0, q.length-1);
                            }
                            console.log(q);
                            let options = {
                                args: [params["name"], "None", "None", q]
                            };
                            PythonShell.run('scriptVK.py', options, function (err) {})
                        }
                        if (params["ok"]){
                            let q = "";
                            for (let i = 0; i < params["photoPath"].length; ++i){
                                q += params["photoPath"][i]["media"] + " ";
                            }
                            while (q[q.length-1] == ' '){
                                q = q.substring(0, q.length-1);
                            }
                            console.log(q);
                            console.log(q[q.length-1]);
                            let optionsOdn = {
                                args: [params["name"], q]
                            };
                            console.log(optionsOdn);
                            PythonShell.run('scriptOK.py', optionsOdn, function (err) {})
                        }
                    }
                    else{
                        console.log("error");
                    }
                }
            }
            if (urlRec.query.upload == "1") {
                console.log("isUploading picture");
            }
            response.end('ok');
        })
    }
}).listen(3000);

const ACCESS_TOKEN = "";
const CHAT_ID = "";

const TelegramBot = require('node-telegram-bot-api');
const FileSaver = require('file-saver');
const bot = new TelegramBot(ACCESS_TOKEN, { polling: true })

function makePostMain(text, photoUrl){
    bot.sendMediaGroup(CHAT_ID, photoUrl, {
        "caption": text
    });
}

function makePostWithOutPhoto(text){
    bot.sendMessage(CHAT_ID, text);
}
