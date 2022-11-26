const http = require('http');
const url = require('url');
const qs = require('querystring');
const fs = require('fs')

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
                console.log(params["photoPath"]);
                if (JSON.stringify(params["photoPath"]) != "[]"){
                    queryStr = params["photoPath"];
                    queryStr[0]["caption"] = params["name"];
                    makePostMain(params["name"], queryStr);
                }
                else{
                    makePostWithOutPhoto(params["name"]);
                }
            }
            // if (urlRec.query.upload == "1") {
            //     console.log("isUploading");
            //     console.log(body);
            // }
            response.end('ok');
        })
    }
}).listen(3000);

const ACCESS_TOKEN = "5431073621:AAEJA8y8KBOroztziVtei_tJQk0gqeD6m6U";
const CHAT_ID = "-1001860362263";

const TelegramBot = require('node-telegram-bot-api');
const { query } = require('express');
const bot = new TelegramBot(ACCESS_TOKEN, { polling: true })

function makePostMain(text, photoUrl){
    // bot.sendPhoto(CHAT_ID, photoUrl, {
    //     "caption": text
    // });
    bot.sendMediaGroup(CHAT_ID, photoUrl, {
        "caption": text
    });
}

function makePostWithOutPhoto(text){
    bot.sendMessage(CHAT_ID, text);
}