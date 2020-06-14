import React from 'react'
import "../../services/sessions";
import Authentication from '../../services/authentication';

export default function Header(){

    function logOut(event){
        event.preventDefault();
        window.location.href="/login"; 
        sessionStorage.clear();
    }

    return(
        <nav className="navbar navbar-expand-md navbar-light bg-light">
            <a href="/" className="navbar-brand">
                <img src="/images/logo.png" height="28" alt="CoolBrand"/>
            </a>
            <button id="navDropdown" type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                <span className="navbar-toggler-icon"></span>
            </button>
        
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <div className="navbar-nav">
                    <a href="/" className={window.location.pathname==="/"?"active nav-item nav-link":"nav-item nav-link"}>Home</a>
                    <a href="/dashboard" className={window.location.pathname==="/dashboard"?"active nav-item nav-link":"nav-item nav-link"}>Dashboard</a>
                </div>
                <div className="navbar-nav ml-auto">
                    <a href="/" onClick={logOut} className="nav-item nav-link">{Authentication.isAuthenticated()?'Logout':'Login'}</a>
                </div>
            </div>
        </nav>
    )
}