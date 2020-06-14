
class Authentication {

    setUserData(data){
        window.sessionStorage.setItem("user",JSON.stringify(data));
    }
    
    getUserData(){
        return JSON.parse(window.sessionStorage.getItem("user"));
    }

    getUserName(){
        return this.getUserData() === null ? "": this.getUserData()["name"];
    }

    mobileNumberProcessed(newUser,mobile){
        window.sessionStorage.setItem("newUser",newUser);
        window.sessionStorage.setItem("mobile",mobile);
        window.sessionStorage.setItem("mobileNumberProcessed",true);
    }

    getMobileNumber(){
        return window.sessionStorage.getItem("mobile");
    }

    isAuthenticated(){
        return window.sessionStorage.getItem("user")!==null;
    }

    getUserId(){
        if(this.getUserData()===null){
            // sessionStorage.clear();
            // window.location.href="/login";
            // return;
        }
        return this.getUserData() === null ? null: this.getUserData()["userId"];
    }


    isNormalUser(){
        return this.getUserData()["type"]==="NORMAL";
    }

    isAdmin(){
        return this.getUserData()["type"]==="ADMIN";
    }

    isSuperAdmin(){
        return this.getUserData()["type"]==="SUPERADMIN";
    }

    getToken(){
        if(this.getUserData()===null){
            // sessionStorage.clear();
            // window.location.href="/login";
            // return;
        }
        return this.getUserData() === null ? "": this.getUserData()["token"];    
    }
}

export default new Authentication();