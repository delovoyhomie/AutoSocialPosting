import React, { useState } from "react";
import './lk.css'

function Lk(){
    const [TgAddOk, setTgAddOk] = useState('tg0')
    const [TgAddText, setTgText] = useState('Не привязан')

    const leave = (e) => {
        fetch('http://localhost:5000/getip/?' + new URLSearchParams({leave: true}).toString(),{
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
                console.log('LOADED AUTH PAGE')
                window.location.assign('/auth')
            }
        })
    }

    const [email, setEmail] = useState('')

    function onl(){
        fetch('http://localhost:5000/getdata',{
            method: 'GET'
        })
        .then(response => {
            console.log("Success");
            return response.json().then(data => {
                return data["email"]
            })
        }).then(data => {
            setEmail(data)
        })
    }
    onl()

    function checkId(s) {
        if (s){
        for (let i = 0; i < s.length; ++i){
            if ((s[i] >= '0' && s[i] <= '9') || s[i] == '-'){
                continue
            }
            else{
                return false
            }
        }
        return true
        }
        else{
            return false
        }
    }
    const loadChatIdTg = () => {
        if (checkId(document.getElementsByClassName("idInput")[0].value.split('/')[document.getElementsByClassName("idInput")[0].value.split('/').length-2]) === true){
            let id = '-100' + document.getElementsByClassName("idInput")[0].value.split('/')[document.getElementsByClassName("idInput")[0].value.split('/').length-2]
            console.log(id)
            fetch("http://localhost:5000/uploadTG",{
                method: "POST",
                body: JSON.stringify({
                    "chatID": id
                })
            })
            .then(success => {
                return success.json().then(data => {
                    console.log(data)
                    if (data['ok'] === true){
                        console.log('success')
                        setTgAddOk('tg1')
                        setTgText('Успешно')
                    }
                    else{
                        console.log('wrong')
                        setTgAddOk('tg2')
                        setTgText('Ошибка')
                    }
                    })
                }
            ) 
        }
        else{
            setTgAddOk('tg2')
            setTgText('Ошибка')
        }
    }
    return(
        <div className="lkMain">
            <div className='greetingLk'> 
                Личный кабинет
            </div>
            <button className='leaveBtn' onClick={(e)=>leave(e)}> Выйти </button>
            <div className='userData'>
                <div className='emailData'>
                    Email: {email}
                </div>
                <div className='subscribeData'>
                    Подписка: стандарт, до 31.12.2023
                </div>
            </div>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <div className='linkAccText'>
                    Привяжите аккаунты для автопостинга!
                </div>
                <div className='tgTutor'>
                    Телеграм
                </div>
                <div className='tgTutor' id = "text">
                    1) Добавьте в канал нашего бота&nbsp; <a href="https://t.me/TestMyChannelPostingBot" target="_blank" id = 'hrefToBot'>@TestMyChannelPostingBot</a>
                </div>
                <div className='tgTutor' id = "text">
                    2) Назначьте его администратором
                </div>
                <div className='tgTutor' id = "text">
                    3) Отправьте нам ссылку на любое сообщение из канала
                </div>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <textarea className="idInput" type = "text"/>
                    <button className="idInputSub" onClick={loadChatIdTg}> Отправить </button>
                </div>
                <div className="isTgAddOK" id={TgAddOk}>
                    {TgAddText}
                </div>
                <div className="vkTutor">
                    ВКонтакте
                </div>
                <div style={{marginTop: "7px"}} id = 'text'>
                    1) Добавьте приложение в группу ВК
                </div>
            </div>
        </div>
    );
}

export default Lk;