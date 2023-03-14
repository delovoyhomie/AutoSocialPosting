//////////////////// init Database
const mysql = require('mysql')

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"quickpost" 
});

db.connect( err => {
    if (err){
        return err;
    }
    else{
        console.log("Database connected");
    }
});
// db.query( "TRUNCATE `users`", (err, result, field) =>{   //раскомментить это если при каждом запуске сервера надо очищать данные с таблиц users и sessions
            
// });
// db.query( "DELETE FROM `sessions`", (err, result, field) =>{
    
// });
db.query( "CREATE TABLE IF NOT EXISTS users (id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, email VARCHAR(30) NOT NULL, password VARCHAR(30) NOT NULL, accounts VARCHAR(2000), reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)", (err, result, field) =>{
            
});

db.query( "CREATE TABLE IF NOT EXISTS sessions (email VARCHAR(30) NOT NULL, password VARCHAR(30) NOT NULL, ip VARCHAR(30) NOT NULL)", (err, result, field) =>{
            
});


////////////////////////////////////////////////
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



const app = express()
const PORT = 5000

app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
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

app.get('/getip', (req, res)=>{ ///get user's IP adress
    if (req.url == '/getip'){

        db.query( "SELECT * FROM `sessions`", (err, result, field) =>{
            
            let curIP = req.socket.remoteAddress
            let ans = false
            for (let i = 0; i < result.length; ++i){
                if (result[i]["ip"] == curIP){
                    ans = true
                    break
                }
            }
            res.send({ok: ans})
        });
        
        
    }
    else if (req.url.split('=')[1] == 'true'){
        console.log('LEAVE')
        db.query( "SELECT * FROM `sessions`", (err, result, field) =>{
            
            let curIP = req.socket.remoteAddress
            let ans = false
            
            db.query( "DELETE FROM `sessions` WHERE ip =" + "'" + curIP +"'", (err, result, field) =>{
                
                if (err == null){
                    console.log('found')
                    ans = true
                }
                
                res.send({ok: ans})
            });
                
                               
        });

        
    }
})

app.get('/getaccount', (req, res)=>{

    db.query( "SELECT * FROM `sessions`", (err, result, field) =>{
            
        
        let curIP = req.socket.remoteAddress
        let ans = ''
        for (let i = 0; i < result.length; ++i){
            if (result[i]["ip"] == curIP){
                ans = result[i]["email"]
                break
            }
        }
        let ansToSend = null
    
        db.query( "SELECT * FROM `users`", (err, result1, field) =>{
            for (let i = 0; i < result1.length; ++i){
                if (result1[i]['email'] == ans){
                    
                    ansToSend = JSON.parse(result1[i]['accounts'])
                    console.log(ansToSend)
                }
            }
        
            res.send({accounts: ansToSend})
        
        });
    
    });

    
    
})

app.get('/auth', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'static', 'auth.html'))
})

app.post('/auth', (req, res) => {
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
            

            for (let i = 0; i < result.length; ++i){
                if (result[i]["email"] == email &&
                    result[i]["password"] == password){
                    
                    
                    ans = true
                    break
                }
            }
            
            if (ans == true){
                db.query("INSERT INTO `sessions`(`email`, `password`, `ip`) VALUES ('" + email + "','" + password + "','" + req.socket.remoteAddress + "')", (err, result, field) =>{
                    
                
                });
            }
            res.send({ok: ans})
        });
        
    })
})

app.get('/reg', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'static', 'reg.html'))
})

app.post('/reg', (req, res) => {
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
                    // console.log(err);
                });
                db.query("INSERT INTO `sessions`(`email`, `password`, `ip`) VALUES ('" + email + "','" + password + "','" + req.socket.remoteAddress + "')", (err, result, field) =>{
                    
                    
                }); 
            }
            res.send({ok: ans})
        });
        
        
        
    })
})

app.get('/getdata', (req, res) => {
    let ip = req.socket.remoteAddress
    let email = ''
    db.query( "SELECT * FROM `sessions`", (err, result, field) =>{
        
        
        for (let i = 0; i < result.length; ++i){
            if (result[i]["ip"] == ip){
                email = result[i]["email"]
                break
            }
        }
        res.send({email: email})
    });
    
    
})

app.get('/upload', (req, res)=>{
    res.send("UPLOADING")
})

app.post('/upload', (req, res) => {
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

        let curIP = req.socket.remoteAddress

        db.query( "SELECT * FROM `sessions`", (err, result, field) =>{
            let ans = ''
            for (let i = 0; i < result.length; ++i){
                if (result[i]["ip"] == curIP){
                    ans = result[i]["email"]
                    break
                }
            }
            let accounts = null


            db.query( "SELECT * FROM `users`", (err, local, field) =>{
                let index = -1
                for (let i = 0; i < local.length; ++i){
                    if (local[i]['email'] == ans){
                        accounts = JSON.parse(local[i]['accounts'])
                        index = i
                    }
                }
                console.log(accounts, 318)

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
         
    })
})



function checkTG(id, curIP){
    return new Promise((resolve, reject)=> {
        db.query( "SELECT * FROM `sessions`", (err, result, field) =>{
            let ans = ''
            for (let i = 0; i < result.length; ++i){
                if (result[i]["ip"] == curIP){
                    ans = result[i]["email"]
                    break
                }
            }
            let accounts = null


            db.query( "SELECT * FROM `users`", (err, local, field) =>{
                for (let i = 0; i < local.length; ++i){
                    if (local[i]['email'] == ans){
                        accounts = JSON.parse(local[i]['accounts'])
                    }
                }
                // console.log(accounts, 407)
    
                let adr = 'https://api.telegram.org/bot'+accounts[0]["adminBotToken"]+'/getChatAdministrators?chat_id='+id
                //console.log(adr)
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
            
            
        });
                
        
    })
}

function getNameTG(id, curIP){
    return new Promise((resolve, reject)=> {
        db.query( "SELECT * FROM `sessions`", (err, result, field) =>{
            let ans = ''
            for (let i = 0; i < result.length; ++i){
                if (result[i]["ip"] == curIP){
                    ans = result[i]["email"]
                    break
                }
            }
            let accounts = null

            db.query( "SELECT * FROM `users`", (err, local, field) =>{
                for (let i = 0; i < local.length; ++i){
                    if (local[i]['email'] == ans){
                        accounts = JSON.parse(local[i]['accounts'])
                    }
                }
                let adr = 'https://api.telegram.org/bot'+accounts[0]["adminBotToken"]+'/getChat?chat_id='+id
                //console.log(adr)
                const options = {
                    url: adr,
                    method: 'GET'
                }
                request(options, (err, res, body) => {
                    if (err){
                        resolve(false)
                    }
                    //console.log(JSON.parse(body)['result']['title'])
                    resolve(JSON.parse(body)['result']['title'])
                })
                
            });

            
            
        });
             
        
    })
}

function equalTG(oldGr, newGr){
    if (oldGr['site'] == 'TG'){
        if (oldGr['token'] == newGr['token'] &&
            oldGr['chat_id'] == newGr['chat_id'] &&
            oldGr['name'] == newGr['name']){
                return true
            }
    }
    return false
}

app.post('/uploadTG', (req, res) => {
    let body = ''
    req.on("data", function(data){
        body += data
    })
    req.on("end", function(){
        let id = JSON.parse(body)["chatID"]
        console.log(id, 503)
        console.log(req.socket.remoteAddress, 504)
        Promise.all([checkTG(id, req.socket.remoteAddress)]).then(results => {
            if (results[0]){
                db.query( "SELECT * FROM `sessions`", (err, result, field) =>{
                
                    let curIP = req.socket.remoteAddress
                    let ans = ''
                    for (let i = 0; i < result.length; ++i){
                        if (result[i]["ip"] == curIP){
                            ans = result[i]["email"]
                            break
                        }
                    }
                    let accounts = null
                    db.query( "SELECT * FROM `users`", (err, local, field) =>{
                        let ind = 0
                        for (let i = 0; i < local.length; ++i){
                            if (local[i]['email'] == ans){
                                accounts = JSON.parse(local[i]['accounts'])
                                ind = i
                            }
                        }
                        checkTG(id, req.socket.remoteAddress)
                        Promise.all([getNameTG(id, req.socket.remoteAddress)]).then(names => {
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
                                    console.log(549, err)
                                });
                                
                                res.send({ok: true})
                            }
                            else{
                                res.send({ok: false})
                            }
                        })
                        
    
                    });

                });
                       
                
            }
            else{
                res.send({ok: false})
            }
        })
    })
})