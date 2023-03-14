import React, { createRef, useState } from 'react';
import './home.css'
import gitLogo from '../media/git.png'
import ToHome from '../toHome/toHome';
import ToLk from '../toLk/toLk';
import tgLogo from '../media/tgLogo.png'
import vkLogo from '../media/vkLogo.png'
import okLogo from '../media/okLogo.png'

let postBtn, photoDelBtn, loadLabel

function readFile(i){
    return new Promise((resolve, reject) => {
        let file = document.getElementsByName("pict[]")[0].files[i];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(
                {
                    "type": '.' + file.name.split('.').pop(),
                    "media": reader.result
                }
            )
        }
        reader.onerror = function() {
            console.log(reader.error);
        };
    })
}

function clearPhoto(){
    loadLabel.innerHTML = 'Загрузить фото : 0';
    document.getElementsByName("pict[]")[0].value = "";
}

function loadAll(){
    loadLabel = document.getElementsByClassName("loadL")[0];
    loadLabel.innerHTML = 'Загрузить фото : 0';
    document.getElementsByName("pict[]")[0].addEventListener("change", ()=>{
        loadLabel.innerHTML = 'Загрузить фото : ' + document.getElementsByName("pict[]")[0].files.length;
    });
}

class AccountLabel extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            used: false
        }
    }
    render(){
        let name = this.props.name
        let site = this.props.site
        let icon = null
        if (site == 'VK'){
            icon = vkLogo
        }
        if (site == 'TG'){
            icon = tgLogo
        }
        if (site == 'OK'){
            icon = okLogo
        }
        return (
            <label className='accountLabel' for = {name+site}>
                <input class = "tgI" name = {name+site} type = "checkbox" onChange={
                    (event)=>{
                        this.setState({
                            used: event.target.checked
                        })
                    }
                }/>
                <img class = "smallLogo" src={icon}/>
                {' '+name}
            </label>
        )
    }
}

class Home extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            usedLables: [], 
            allowId: 'normal'
        }
    }

    componentDidMount(){
        fetch('http://localhost:5000/getip',{
            method: 'GET'
        })
        .then(response => {
            console.log("Success");
            return response.json().then(data => {
                return data["ok"]
            })
        }).then(data => {
            console.log(data)
            if (data){
                console.log('LOADED HOME PAGE')
            }
            else{
                window.location.assign('/auth ')
            }
        })
        fetch("http://localhost:5000/getaccount", {
            method: "GET"
        }).then(response => {
            return response.json().then(data => {
                // JSON.parse(data)
                data = data['accounts']
                let lables = []
                for (let i = 1; i < data.length; ++i){
                    lables.push(
                        <AccountLabel name={data[i]["name"]} site={data[i]["site"]}/>
                    )
                }
                if (lables.length == 0){
                    this.setState({
                        usedLables: this.state.usedLables,
                        allowId: 'hide'
                    })
                }
                else{
                    this.setState({
                        usedLables: lables,
                        allowId: 'normal'
                    })
                }
            })
        })
    }

    render(){
        const makePost = () => {
            let MESSAGE = document.getElementsByName("msg")[0].value;
            let paths = []
            let promises = [];
            for (let i = 0; i < document.getElementsByName("pict[]")[0].files.length; ++i) {
                promises.push(readFile(i));
            }
            Promise.all(promises)
            .then(results => {
                for (let result of results) {
                    paths.push(result)
                }
                console.log(paths);
                let sitesNumbers = []
                for (let i = 0; i < this.state.usedLables.length; ++i){
                    if (document.getElementsByName(this.state.usedLables[i].props.name+this.state.usedLables[i].props.site)[0].checked){
                        sitesNumbers.push(i)
                    }
                }
                fetch("http://localhost:5000/upload",{
                    method: "POST",
                    body: JSON.stringify({
                        "name": MESSAGE, 
                        "photos": paths,
                        "sites": sitesNumbers
                    })
                })
                .then(success => {
                    console.log("Success");
                }, error => {
                    console.log("Error");
                });  
            })
        }

        return(
        <div onLoad={loadAll} class = "boss">
            <div class = "main" style={{display: "flex", justifyContent: "center"}}>
                <div class = "getData">
                    <div>
                        <div class = "getText" style={{width: "550px", display: "flex"}}>
                            <textarea name = "msg" type = "text" class = "textarea"></textarea>
                            <div class = "allow" id = {this.state.allowId}>
                                {this.state.usedLables}
                            </div>
                        </div>
                    </div>
                    <div class = "getPict">
                        <label class = "loadL" for = "photo-upload"></label>
                        <input id = "photo-upload" name = "pict[]" type="file" title = "тест" class = "pictBtn" multiple/>
                        <button class = "photo-remove" onClick={clearPhoto}> Удалить фото </button>
                    </div>
                    {/* <div class="allow">
                        <label class="tgL" for = "tg">
                            <input class = "tgI" name = "tg" type = "checkbox"/> Telegram
                        </label>
                    
                        <label class="vkL" for = "vk">
                            <input class = "vkI" name = "vk" type = "checkbox"/> VK
                        </label>
                    
                        <label class="okL" for = "ok">
                            <input class = "okI" name = "ok" type = "checkbox"/> OK
                        </label>
                    </div> */}
                    <div class = "confirm">
                        <button id = "POST" class = "acceptBtn" onClick={makePost}> Опубликовать </button>
                    </div>
                </div>
            </div>
            <div class="footer">
                <a class="github" target="_blank" href="https://github.com/delovoyhomie/AutoSocialPosting">
                    <div class="image" id="image-git">
                        <img src={gitLogo} alt="GitHub"/>
                    </div>
                    <div class="footer-text">
                        Наш GitHub
                    </div>
                </a>
            </div>
        </div>
        )
    }
}


export default Home;
