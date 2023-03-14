const mysql = require('mysql')

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"quickpost" 
});

db.connect( err => {
    if (err){
        console.log('error db')
        return err;
    }
    else{
        console.log("Database connected");
    }
});

db.query( "CREATE TABLE IF NOT EXISTS users (id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, email VARCHAR(30) NOT NULL, password VARCHAR(30) NOT NULL, accounts VARCHAR(2000), reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)", (err, result, field) =>{
});

const express = require('express')
const config = require('config')
const path = require('path')
const bodyParser = require('body-parser')
const { urlencoded } = require('express')
const request = require('request')
const fs = require('fs')
const crypto = require('crypto')
const { stringify } = require('querystring');
const { Console } = require('console');
const PythonShell = require('python-shell').PythonShell;

const date = require('../quickpost/src/config.json')

const PORT = date['PORT']

const app = express()

app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", 'Content-Type, Access-Control-Allow-Headers, X-Requested-With');
    next()
})

app.listen(PORT, ()=>{
    console.log('Server started on port', PORT + '...')
})

app.use(express.urlencoded({extended: false}))

app.get('/', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'static', 'index.html'))
})

app.get('/arhiv', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'static', 'arhiv.html'))
})

app.get('/lk', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'static', 'lk.html'))
})

app.get('/auth', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'static', 'auth.html'))
})

app.post('/auth', (req, res) => {
    try{
        let body = ''
        req.on("data", function(data){
            body += data
        })
        req.on("end", function(){
            let ans = false
            let params = JSON.parse(body)
            let email = params["mail"]
            let password = params["passw"]
            db.query( "SELECT * FROM `users`", (err, result, field) =>{
                let accs = []
                for (let i = 0; i < result.length; ++i){
                    if (result[i]["email"] == email &&
                        result[i]["password"] == password){
                            accs = result[i]["accounts"]
                            ans = true
                            break
                    }
                }
                res.send({ok: ans,
                accounts: accs})
            });
        })
    } catch (err){
        console.log(err)
    }
})

app.get('/reg', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'static', 'reg.html'))
})

app.post('/reg', (req, res) => {
    try{
        let body = ''
        req.on("data", function(data){
            body += data
        })
        req.on("end", function(){
            let ans = true
            let params = JSON.parse(body)
            let email = params["mail"]
            let password = params["passw"]
            db.query( "SELECT * FROM `users`", (err, result, field) =>{
                for (let i = 0; i < result.length; ++i){
                    if (result[i]["email"] == email){
                        ans = false
                        break
                    }
                }
                if (ans){
                    let accounts = '[{"adminBotToken": "5431073621:AAEJA8y8KBOroztziVtei_tJQk0gqeD6m6U"}]'
                    db.query("INSERT INTO `users`(`email`, `password`, `accounts`) VALUES ('" + email + "','" + password +"','" + accounts  + "')", (err, result, field) =>{ ////not sure
                    });
                }
                res.send({ok: ans})
            });
        })
    } catch (err){
        console.log(err)
    }
})

app.get('/upload', (req, res)=>{
    res.send("UPLOADING")
})

app.post('/upload', (req, res) => {
    try{
        let body = ''
        req.on("data", function(data){
            body += data
        })
        req.on("end", function(){
            console.log("isPosting");
            let params = JSON.parse(body);
            console.log(params["photos"].length)
            let thisPost = []
            for (let i = 0; i < params["photos"].length; ++i){
                let buffer = params["photos"][i]["media"]
                let fileType = params["photos"][i]["type"]
                let base64Str = buffer.split(';base64,').pop()
                const id = './uploads/'+crypto.randomBytes(16).toString("hex")
                console.log(id + fileType)
                thisPost.push(id + fileType)
                fs.writeFileSync(id + fileType, base64Str, {encoding: 'base64'}, function(err) {
                    console.log('File created')
                });
                params["photos"][i]["media"] = id + fileType
            }
            setTimeout(() => {
                for (let i = 0; i < thisPost.length; ++i){
                    fs.unlinkSync(thisPost[i])
                    console.log("Deleted: ", thisPost[i])
                }
            }, 10000);
            let list_to_post = params["sites"]
            console.log(list_to_post)
            let ans = params['email']            
            let accounts = null
            db.query( "SELECT * FROM `users`", (err, local, field) =>{
                let index = -1
                for (let i = 0; i < local.length; ++i){
                    if (local[i]['email'] == ans){
                        accounts = JSON.parse(local[i]['accounts'])
                        index = i
                    }
                }

                if (params["photos"].length != 0){
                    queryStr = params["photos"];
                    queryStr[0]["caption"] = params["name"];
        
                    let q = "";
                    for (let i = 0; i < params["photos"].length; ++i){
                        q += params["photos"][i]["media"] + " ";
                    }
                    while (q[q.length-1] == ' '){
                        q = q.substring(0, q.length-1);
                    }
        
                    let options = {
                        args: [params["name"], q]
                    };
        
                    for (let i = 0; i < list_to_post.length; ++i){
                        let local = options
                        local.args.push(String(index))
                        local.args.push(String(list_to_post[i]))
                        PythonShell.run('post' + accounts[String(list_to_post[i]+1)]["site"] + '.py', local, function (err) {})
                        local.args.pop();
                        local.args.pop()
                    }
                }
                else{
                    if (JSON.stringify(params["name"])){
                        let options = {
                            args: [params["name"], "None"]
                        }
                        console.log(list_to_post, 350)
                        for (let i = 0; i < list_to_post.length; ++i){
                            let local = options
                            local.args.push(String(index))
                            local.args.push(String(list_to_post[i]))
                            PythonShell.run('post' + accounts[String(list_to_post[i]+1)]["site"] + '.py', local, function (err) {})
                            local.args.pop();
                            local.args.pop();
                        }
                    }
                    else {
                        console.log("error");
                    }
                }
                res.send("posted")
            });
        });
    } catch (err){
        console.log(err)
    }
})

function checkTG(id, email){
    try{
        return new Promise((resolve, reject)=> {
            let ans = email
            let accounts = null
            db.query( "SELECT * FROM `users`", (err, local, field) =>{
                for (let i = 0; i < local.length; ++i){
                    if (local[i]['email'] == ans){
                        accounts = JSON.parse(local[i]['accounts'])
                    }
                }
                let adr = 'https://api.telegram.org/bot'+accounts[0]["adminBotToken"]+'/getChatAdministrators?chat_id='+id
                const options = {
                    url: adr,
                    method: 'GET'
                }
                request(options, (err, res, body) => {
                    if (err){
                        resolve(false)
                    }
                    if (JSON.parse(body)['result']){
                    let len = JSON.parse(body)['result'].length
                    for (let i = 0; i < len; ++i){
                        if (JSON.parse(body)['result'][i]['user']['first_name'] == 'ADMIN_BOT'){
                            resolve(true)
                        }
                        
                    }
                    resolve(false)
                    }
                    else{
                        resolve(false)
                    }
                })
            });
        })
    } catch (err){
        console.log(err)
    }
}

function getNameTG(id, email){
    try{
        return new Promise((resolve, reject)=> {
            let ans = email
            let accounts = null
            db.query( "SELECT * FROM `users`", (err, local, field) =>{
                for (let i = 0; i < local.length; ++i){
                    if (local[i]['email'] == ans){
                        accounts = JSON.parse(local[i]['accounts'])
                    }
                }
                let adr = 'https://api.telegram.org/bot'+accounts[0]["adminBotToken"]+'/getChat?chat_id='+id
                const options = {
                    url: adr,
                    method: 'GET'
                }
                request(options, (err, res, body) => {
                    if (err){
                        resolve(false)
                    }
                    resolve(JSON.parse(body)['result']['title'])
                }) 
            }); 
        })
    } catch (err){
        console.log(err)
    }
}

function equalTG(oldGr, newGr){
    try{
        if (oldGr['site'] == 'TG'){
            if (oldGr['token'] == newGr['token'] &&
                oldGr['chat_id'] == newGr['chat_id'] &&
                oldGr['name'] == newGr['name']){
                    return true
                }
        }
        return false
    } catch (err){
        console.log(err)
    }
}

app.post('/uploadTG', (req, res) => {
    try{
        let body = ''
        req.on("data", function(data){
            body += data
        })
        req.on("end", function(){
            let id = JSON.parse(body)["chatID"]
            Promise.all([checkTG(id, JSON.parse(body)["email"])]).then(results => {
                if (results[0]){
                    let ans = JSON.parse(body)["email"]
                    let accounts = null
                    db.query( "SELECT * FROM `users`", (err, local, field) =>{
                        let ind = 0
                        for (let i = 0; i < local.length; ++i){
                            if (local[i]['email'] == ans){
                                accounts = JSON.parse(local[i]['accounts'])
                                ind = i
                            }
                        }
                        checkTG(id, JSON.parse(body)["email"])
                        Promise.all([getNameTG(id, JSON.parse(body)["email"])]).then(names => {
                            let newGroup = {
                                "token": "5431073621:AAEJA8y8KBOroztziVtei_tJQk0gqeD6m6U",
                                "chat_id": id,
                                "name": names[0],
                                "site": "TG"
                            }
                            let can = true
                            for (let i = 1; i < local.length; ++i){
                                if (equalTG(local[i], newGroup)){
                                    can = false
                                    break
                                }
                            }
                            if (can){
                                accounts.push(newGroup)
                                db.query("UPDATE `users` SET `accounts`='" + (JSON.stringify(accounts)).toString() + "' WHERE email = '" + ans + "';", (err, result, field) =>{
                                });
                                res.send({ok: true})
                            }
                            else{
                                res.send({ok: false})
                            }
                        })
                    });  
                }
                else{
                    res.send({ok: false})
                }
            })
        })
    } catch (err){
        console.log(err)
    }
})