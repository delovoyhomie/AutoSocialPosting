import React from 'react';
import '../main/App.css';
import homeLogo from '../media/home.png'
import './toHome.css'
import {Link} from 'react-router-dom';

function ToHome(){
    return(
        <Link to = "/">
            <div className='mainH'>
                <img src = {homeLogo} alt = 'Home' className='homeImg'  />
            </div>
        </Link>
    );
}

export default ToHome;