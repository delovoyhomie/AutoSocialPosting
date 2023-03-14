import React from 'react';
import '../main/App.css';
import lkLogo from '../media/lk.png';
import '../toLk/toLk.css';
import {Link} from 'react-router-dom';

function toAuth(){
    const onl = (e)=>{
        fetch('http://localhost:5000/getip',{
        method: 'GET'
        })
        .then(response => {
            console.log("Success!!");
            return response.json().then(data => {
                return data["ok"]
            })
        }).then(data => {
            console.log(data)
            if (data){
                console.log('!!!')
                window.location.assign('/lk ')
            }
            else{
                window.location.assign('/auth')
            }
        })
    }
    return(
        <Link onClick={e => onl(e)} to = "/auth">
            <div className='maintoLk'>
                <img src = {lkLogo} alt = 'lk' className='lkImg'  />
            </div>
        </Link>
    );
}

export default toAuth;