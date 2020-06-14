import React, {Component} from 'react'
import SnackbarMessage from '../services/snackbar-message';
import * as urlConstant from './shared/url-constants';
import authentication from '../services/authentication';
import apiService from '../services/api-service';
import GoogleLogin from 'react-google-login';

class Login extends Component{

    constructor(props) {
        super(props)
        this.state = {
          user:{
              mobile:"",
              password:"",
              otp:"",
              otpLogin:false
          },
          snackbarProps: { open: false, message: "Hello World", variant: "success" }
        }
    }

    componentDidMount(){
        document.title = 'Panktiyaan | Login';
    }

    handleCloseSnackbar = () =>{
        this.setState({snackbarProps:{open: false,message: "", variant: "success"}});
        console.log(this.state);
    }

    logginUser=(otp,password)=>{
        
    }

    signupOrLoginIn(res) {
        const googleresponse = {
            name: res.profileObj.givenName+" "+res.profileObj.familyName,
            email: res.profileObj.email,
            token: res.accessToken,
            Image: res.profileObj.imageUrl,
            ProviderId: 'Google'
        };

        apiService.postData(urlConstant.VERIFY_GOOGLE_AUTH,{token:googleresponse.token}).then(data=>{
            if(data["success"]){
                if(data["data"]["newUser"]){
                    window.location.href = '/register?name='+googleresponse.name+'&email='+googleresponse.email+'&token='+googleresponse.token;
                }else{
                    authentication.setUserData(data.data);
                    this.setState({snackbarProps:{open: true,message: "User logged in successfully", variant: "success"}});
                    setTimeout(()=>{
                        window.location.href="/dashboard";
                    },1000);
                }
            }
        }).catch(error=>{
            this.setState({snackbarProps:{open: true,message: "error while processing request", variant: "error"}});
        });
    };

    loginUser = () =>{
        this.setState({snackbarProps:{open: true,message: "processing login request", variant: "loading"}});
        apiService.postData(urlConstant.VERIFY_OTP_PASSWORD,this.state.user).then(data=>{
            if(!data.success){
                this.setState({loggedIn:false});
                this.setState({snackbarProps:{open: true,message: data["error"]["message"], variant: "error"}});
            }else{
                authentication.setUserData(data.data);
                this.setState({snackbarProps:{open: true,message: "User logged in successfully", variant: "success"}});
                setTimeout(()=>{
                    window.location.href="/dashboard";
                },1000);
            }
        }).catch((error)=>{
            console.log(error);
            this.setState({snackbarProps:{open: true,message: "error while processing request", variant: "error"}});
        });  
    }

    setUserData=(key,value)=>{
        this.setState(prevState=>({user:{...prevState.user,[key]:value}}));
    }

    render(){

        const responseGoogle = (response) => {
          this.signupOrLoginIn(response);
        }

        return(
            <React.Fragment>
                {this.state.snackbarProps.open && <SnackbarMessage onClose={this.handleCloseSnackbar} {...this.state.snackbarProps}></SnackbarMessage>}
                <div class="signup-form row">
                    <form onSubmit={(e) => {this.loginUser(); e.preventDefault();}} method="post" class="col-md-5 col-11 m-auto">
                        <h3>Login</h3>
                        <div className="mx-auto table-display" >
                            <GoogleLogin
                                clientId="1087467545086-57aarlb1j1do6g1kdkfvr29casjnsboh.apps.googleusercontent.com"
                                buttonText="Login with Google"
                                onSuccess={responseGoogle}
                                onFailure={responseGoogle} ></GoogleLogin>
                        </div>    
                        <hr/>                
                        <h5 className="header text-center">Login(Using Password)</h5>
                        <div class="form-group">
                            <input onChange={(e)=>this.setUserData("mobile",e.target.value)} type="mobile" class="form-control" name="mobile" placeholder="Mobile number" required="required"/>
                        </div>
                        <div class="form-group">
                            <input onChange={(e)=>this.setUserData("password",e.target.value)} type="password" class="form-control" name="password" placeholder="Password" required="required"/>
                        </div>

                        {/* <div class="form-group ml-auto text-center"><span class="badge badge-pill badge-info text-white">OR</span></div>

                        <div class="input-group mb-3">
                            <input type="text" class="form-control" name="otp" placeholder="Otp number"/>
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="button">Send OTP</button>
                            </div>
                        </div> */}

                        <div class="form-group">
                            <button type="submit" class="btn btn-success btn-lg btn-block">Login</button>
                        </div>
                        {/* <div class="text-center">New User? <a href="/register">Register here</a></div> */}
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

export default Login;
