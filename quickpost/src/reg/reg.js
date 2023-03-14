import React, { useEffect } from 'react';
import { useState } from 'react';
import './reg.css'
import { Link } from 'react-router-dom';

const Reg = () => {
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
            if (data){
                console.log('LOADED LK PAGE')
                window.location.assign('/lk ')
            }
        })
    }
    onl()

    const [enterError, setEnterError] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailDirty, setEmailDirty] = useState(false)
    const [passwordDirty, setPasswordDirty] = useState(false)
    const [emailError, setEmailError] = useState('Электронная почта не может быть пустой')
    const [passwordError, setpasswordError] = useState('Пароль не может быть пустым')
    const [formValid, setFormValid] = useState(false)

    useEffect(()=>{
        if (emailError || passwordError){
            setFormValid(false)
        }
        else{
            setFormValid(true)
        }
    }, [emailError, passwordError])

    const blurHandler = (e) => {
        switch (e.target.name){
            case 'email':
                setEmailDirty(true)
                break
            case 'password':
                setPasswordDirty(true)
                break
        }
    }

    const emailHandler = (e) => {
        setEnterError('')
        setEmail(e.target.value)
        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!re.test(String(e.target.value).toLowerCase())){
            setEmailError('Некорректная электронная почта')
        }
        else{
            setEmailError('')
        }
    }

    const passwordHandler = (e) => {
        setEnterError('')
        setPassword(e.target.value)
        if (e.target.value.length < 3 || e.target.value.length > 25){
            setpasswordError('Пароль должен быть длиннее 3 и короче 25 символов')
            if (!e.target.value){
                setpasswordError('Пароль не может быть пустым')
            }
        }
        else{
            setpasswordError('')
        }
    }

    const upload = (e) => {
        console.log(email)
        console.log('uploading data to server')
        fetch('http://localhost:5000/reg',{
            method: 'POST',
            body: JSON.stringify({
                mail: email,
                passw: password
            })
        })
        .then(response => {
            console.log("Success");
            return response.json().then(data => {
                return data["ok"]
            })
        }).then(data => {
            console.log(data)
            if (data){
                console.log('REDIRECTING TO LK')
                window.location.assign('/lk ')
            }
            else{
                console.log('this email is already used')
                setEnterError('Эта почта занята')
            }
        })
        e.preventDefault()
    }

    return(
        <div className='mainReg'>
            <form className='regForm'>
                <div> Регистрация </div>
                {
                    (emailDirty && emailError) &&
                    <div className='errorEmailOrPass'> {emailError} </div>
                }
                {
                    (enterError) &&
                    <div className='errorEmailOrPass'> {enterError} </div>
                }
                <input onChange={e => emailHandler(e)} value = {email} onBlur={e => blurHandler(e)} className='emReg' name = 'email' type = 'text' placeholder='Введите ваш email'/>
                {
                    (passwordDirty && passwordError) &&
                    <div className='errorEmailOrPass'> {passwordError} </div>
                }
                <input onChange={e => passwordHandler(e)} value = {password} onBlur={e => blurHandler(e)} className='pswReg' name = 'password' type = 'password' placeholder='Введите ваш пароль'/>
                <button onClick={e => upload(e)} disabled = {!formValid} className='subReg' type='submit'> Зарегистрироваться </button>
                <Link to='/auth' className='toAuth'> Есть аккаунт? Войти </Link>
            </form>
        </div>
    );
}

export default Reg;