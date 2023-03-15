import React, { useState } from 'react';
import '../main/App.css';
import ToHome from '../toHome/toHome.js';
// import ToArhiv from '../toArhiv/toArhiv.js';
//import ToTest from '../toTest/toTest.js'
import ToLk from '../toLk/toLk.js';
import { Router, Routes, Route, Link } from 'react-router-dom';
import Home from '../home/home.js';
//import Arhiv from '../arhiv/arhiv.js';
import Lk from '../lk/lk.js';
import Auth from '../auth/auth.js';
import Reg from '../reg/reg.js';
//import Test from '../test/test.js';
import ToAuth from '../toLk/toAuth.js';
import ToAuthHome from '../toLk/toAuthHome.js';

const date = require('../config.json')
const HOST = date['HOST']
const PORT = date['PORT']
const URL = 'http://' + HOST + ':' + PORT

function get_cooks() {
    let cookies = document.cookie;
    if (cookies === '') {
        cookies = 'user= ;passw= '
    }
    cookies = cookies.split(';')
    console.log(cookies)
    let CookiesArr = {}
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let cookieParts = cookie.split("=");
        let cookieName = cookieParts[0].trim();
        let cookieValue = cookieParts[1].trim();
        CookiesArr[cookieName] = cookieValue
    }
    return CookiesArr
}

function App(){
    const [page, setPage] = useState({
        linker: null
    })
    const [page1, setPage1] = useState({
        linker1: null
    })

    function onl (){
        const allCookies = get_cooks()
        fetch(URL + '/auth', {
            method: 'POST',
            body: JSON.stringify({
                mail: allCookies['user'],
                passw: allCookies['passw']
            })
        })
    .then(response => {
        console.log("Success");
        return response.json().then(data => {
            return data["ok"]
        })
    }).then(data => {
        console.log(data)
        if (data && (page.linker == <ToAuth/> || page.linker == null)){
            console.log('LOADED LK PAGE')
            // window.location.assign('/lk ')
            setPage({
                linker: <ToLk/>
            })
            setPage1({
                linker1: <ToHome/>
            })
        }
        if (!data && (page.linker == <ToLk/> || page.linker == null)){
            console.log('LOADED AUTH PAGE')
            // window.location.assign('/auth')
            setPage({
                linker: <ToAuth/>
            })
            setPage1({
                linker1: <ToAuthHome/>
            })
        }
    })
    }
    onl()

    return (
        <div className = 'main'>
            <div className = 'board'>
                {page1.linker1}
                {page.linker}
            </div>
            <div className = 'content'>
                <Routes>
                    <Route path = "/" element = {<Home/>} />
                    <Route path = "/auth" element = {<Auth/>} />
                    <Route path = "/reg" element = {<Reg/>} />
                    <Route path = "/lk" element = {<Lk/>} />
                </Routes>
            </div>
        </div>
    );
}

export default App;