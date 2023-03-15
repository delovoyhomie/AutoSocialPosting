import React from 'react';
import '../main/App.css';
import lkLogo from '../media/lk.png';
import '../toLk/toLk.css';
import {Link} from 'react-router-dom';

function toAuth(){
    return(
        <Link to = "/auth">
            <div className='maintoLk'>
                <img src = {lkLogo} alt = 'lk' className='lkImg'  />
            </div>
        </Link>
    );
}

export default toAuth;