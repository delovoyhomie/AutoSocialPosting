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

function App(){
    const [page, setPage] = useState({
        linker: null
    })

    function onl (){
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
        if (data && (page.linker == <ToAuth/> || page.linker == null)){
            console.log('LOADED LK PAGE')
            // window.location.assign('/lk ')
            setPage({
                linker: <ToLk/>
            })
        }
        if (!data && (page.linker == <ToLk/> || page.linker == null)){
            console.log('LOADED AUTH PAGE')
            // window.location.assign('/auth')
            setPage({
                linker: <ToAuth/>
            })
        }
    })
    }
    onl()

    return (
        <div className = 'main'>
            <div className = 'board'>
                <ToHome/>
                {/* <ToArhiv/> */}
                {/* <ToTest/> */}
                {page.linker}
            </div>
            <div className = 'content'>
                <Routes>
                    <Route path = "/" element = {<Home/>} />
                    {/* <Route path = "/arhiv" element = {<Arhiv/>} /> */}
                    {/* <Route path = "/test" element = {<Test/>} /> */}
                    {/* <Route path = {page.adr} element = {page.pg} /> */}
                    <Route path = "/auth" element = {<Auth/>} />
                    <Route path = "/reg" element = {<Reg/>} />
                    <Route path = "/lk" element = {<Lk/>} />
                </Routes>
            </div>
            {/* <div className = "contacts">
                (c) Бойко Г.А. 2022 <br></br>
            </div> */}
        </div>
    );
}

export default App;