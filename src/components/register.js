import React, {Component} from 'react'
import authentication from '../services/authentication';
import queryString from 'query-string'
import apiService from '../services/api-service';
import * as urlConstant from './shared/url-constants';
import SnackbarMessage from '../services/snackbar-message';

class Register extends Component{

    constructor(props) {
        super(props)
        this.state = {
            user:{
                name:"",
                email:"",
                password:"",
                instaHandle:"",
                mobile:"",
                token:"",
            },
            confirm_password:"",
            snackbarProps: { open: false, message: "Hello World", variant: "success" }
        }
    }

    componentDidMount() {
        const values = queryString.parse(this.props.location.search);
        if(!values.token && !values.email){
            window.location.href="/login";
        }
        this.setState(prevState=>({user:{...prevState.user,name:values.name,token:values.token,email:values.email}}));
    }

    verifyPassword=(event)=>{
        console.log(event);
    }

    registerUser=()=>{
        if(this.state.user.password!==this.state.confirm_password){
            alert("password didn't match");
        }
        console.log(this.state.user);
    }

    setUserData=(key,value)=>{
        this.setState(prevState=>({user:{...prevState.user,[key]:value}}));
    }

    registerUser = () =>{
        if(this.state.user.password!==this.state.confirm_password){
            this.setState({snackbarProps:{open: true,message: "password didn't match", variant: "error"}});
            return;
        }
        this.setState({snackbarProps:{open: true,message: "processing registration request", variant: "loading"}});
        apiService.postData(urlConstant.USER_REGISTRATION,this.state.user).then(data=>{
            if(!data.success){
                this.setState({snackbarProps:{open: true,message: data["error"]["message"], variant: "error"}});
            }else{
                authentication.setUserData(data.data);
                this.setState({snackbarProps:{open: true,message: "User registered in successfully", variant: "success"}});
                setTimeout(()=>{
                    window.location.href="/dashboard";
                },1000);
            }
        }).catch((error)=>{
            console.log(error);
            this.setState({snackbarProps:{open: true,message: "error while processing request", variant: "error"}});
        });  
    }

    render(){
        return(
            <React.Fragment>
                {this.state.snackbarProps.open && <SnackbarMessage onClose={this.handleCloseSnackbar} {...this.state.snackbarProps}></SnackbarMessage>}
                <div class="signup-form row">
                    <form onSubmit={(e) => {this.registerUser(); e.preventDefault();}} class="col-md-5 col-11 m-auto">
                        <h3>Register</h3>
                        <div class="form-group">
                            <input onChange={(e)=>this.setUserData("name",e.target.value)} value={this.state.user.name} type="text" class="form-control" name="name" placeholder="Name" required="required"/>
                        </div>
                        <div class="form-group">
                            <input disabled value={this.state.user.email} type="email" class="form-control" name="email" placeholder="Email"/>
                        </div>
                        <div class="form-group">
                            <input onChange={(e)=>this.setUserData("mobile",e.target.value)} type="mobile" class="form-control" name="mobile" placeholder="Mobile number" />
                        </div>
                        <div class="form-group">
                            <input onChange={(e)=>this.setUserData("instaHandle",e.target.value)} type="text" class="form-control" name="instaHandle" placeholder="Instagram profile ID" />
                        </div>
                        <div class="form-group">
                            <input onChange={(e)=>this.setUserData("password",e.target.value)} type="password" class="form-control" name="password" placeholder="Password" required="required"/>
                        </div>
                        <div class="form-group">
                            <input onChange={event=>this.setState({confirm_password:event.target.value})} type="password" class="form-control" name="confirm_password" placeholder="Confirm Password" required="required"/>
                        </div> 
                        {/* <div class="input-group mb-3">
                            <input type="text" class="form-control" name="otp" placeholder="Otp number" required="required"/>
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="button">Send OTP</button>
                            </div>
                        </div> */}
        
                        <div class="form-group">
                            <button type="submit" class="btn btn-success btn-lg btn-block">Register Now</button>
                        </div>
                        <div class="text-center">Already have an account? <a href="/login">Sign in</a></div>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

export default Register;
