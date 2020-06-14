import React, {useState,useEffect} from 'react'
import authentication from '../services/authentication';

export default function OtpVerify(props){
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");

    return(
        <React.Fragment>
            <div className="_login_neumorphism">
                 
                {props.otp_field ?
                    (<div className="login-heading"> 
                        <p>Enter OTP sent to</p>
                        <p><span className="id">{authentication.getMobileNumber()}</span></p>
                    </div>):
                    (<div className="login-heading"> 
                        <p>Please Enter password</p>
                    </div>)
                }

                <div className="login-entry">
                    <div>
                        <ul>
                            <li>
                                {props.otp_field?
                                    <input onChange={(e)=>setOtp(e.target.value)} className="username" name="otp" type="text" placeholder="Enter OTP" maxLength="10" required/>:
                                    <input onChange={(e)=>setPassword(e.target.value)} className="username" name="password" type="password" placeholder="Enter Password" maxLength="10" required/>
                                }
                            </li>
                            <li><input className="login" name="login" type="submit" value="Login" onClick={props.login_user.bind(this,otp,password)}/></li>
                        </ul>
                    </div>
                    <br/>
                </div>
                
                { !props.otp_field &&
                    <div>
                        <div className="hr-style">
                            <div className="hr-1">
                                <hr/>
                            </div>
                            <div className="or-dash">
                                <p>OR</p>
                            </div>
                            <div className="hr-2">
                                <hr/>
                            </div>
                        </div>

                        <div className="login-entry">
                            <input className="login" onClick={props.send_otp_for_login.bind(this,true)} name="Sent Otp" type="submit" value="Sent Otp"/>
                        </div>
                    </div>
                }
            </div>
        </React.Fragment>
    )
}