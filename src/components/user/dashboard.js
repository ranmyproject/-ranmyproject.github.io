import React, {Component} from 'react'
import apiService from '../../services/api-service';
import * as urlConstant from '../shared/url-constants';
import authentication from '../../services/authentication';
import SnackbarMessage from '../../services/snackbar-message';
import { Button ,Modal} from 'react-bootstrap';

const list_length=10;

class Dashboard extends Component{
    constructor(props) {
        super(props)
        this.state = {
            name:"",
            user_type:"",
            showSubmissions:false,
            filterValue:"ALL",
            panktiyaan_list:[],
            post_count:{},
            from:0,
            to:list_length,
            total:0,
            filtered_panktiyaan_list:[],
            snackbarProps: { open: false, message: "Hello World", variant: "success" },
            newPost:"",
            modeShow:false,
            card_list:[]
        }
    }

    componentDidMount(){
        document.title = 'Panktiyaan | Dashboard';
        this.setState({name:authentication.getUserData()["name"],user_type:authentication.getUserData()["type"]});
        this.loadData();
    }

    getCardObj=(status,status_enum,text,count)=>{
        return {
            status:status,
            status_enum:status_enum,
            text:text,
            count:count,
        }
    }

    createObject=(post_count)=>{
        let data = [];
        if(authentication.isNormalUser()){
            data.push(this.getCardObj("Submissions","ALL","Submitted posts count by user",post_count["submission"]));
            data.push(this.getCardObj("Approved","APPROVED,POSTED","Approved posts count by Panktiyaan team",post_count["approved"]));
        }else if(authentication.isAdmin()){
            data.push(this.getCardObj("Pending","PENDING","Pending post count available for action",post_count["submission"]));
            data.push(this.getCardObj("Approved","APPROVED","Approved posts count by Panktiyaan team",post_count["approved"]));
        }else{
            data.push(this.getCardObj("Submissions","APPROVED","Submitted posts count by user",post_count["approved"]));
            data.push(this.getCardObj("Posted","POSTED","Posts count published on homepage",post_count["posted"]));
        }
        this.setState({card_list:data});
    }


    loadData=()=>{
        console.log('data loading');
        apiService.getData(authentication.isAdmin()?urlConstant.ADMIN_GET_POST_COUNT:(authentication.isSuperAdmin()?urlConstant.SUPER_ADMIN_POST_COUNT:urlConstant.USER_POST_COUNT)).then(data=>{
            this.setState({post_count:data.data});
            this.createObject(data.data);
        });
    }

    redirectToPost=(count,filter)=>{
        if(count===0){
            this.setState({snackbarProps:{open: true,message: "No post found for this status", variant: "info"}});
            return;
        }
        window.location.href="/post?filter="+filter;
    }

    handleShow=()=>{
        this.setState({modeShow:true});
    }

    handleClose=()=>{
        this.setState({modeShow:false});
    }

    handleCloseSnackbar = () =>{
        this.setState({snackbarProps:{open: false,message: "", variant: "success"}});
    }

    handleChangePostText=(event)=>{
        let value = event.target.value;
        this.setState({newPost:value});
    }

    submitPankti=()=>{
        this.setState({snackbarProps:{open: true,message: "processing post submission request", variant: "loading"}});
        apiService.postData(urlConstant.POST_PANKTIYAAN,{text:this.state.newPost}).then(data=>{
            if(data["success"]){
                this.setState({snackbarProps:{open: true,message: "post updated successfully", variant: "success"}});
                let count = this.state.post_count["submission"]+1;
                this.setState(prevState=>({post_count:{...prevState.post_count,submission:count}}));
                this.createObject(this.state.post_count);
            }else{
                this.setState({snackbarProps:{open: true,message: data["error"]["message"], variant: "error"}});
            }
            this.handleClose();
        }).catch((err)=>{
            console.log(err);
        });
    }
    
    render(){
            return(
                <React.Fragment>
                    {this.state.snackbarProps.open && <SnackbarMessage onClose={this.handleCloseSnackbar} {...this.state.snackbarProps}></SnackbarMessage>}
                    <div className="col-md-5 mx-auto">
                        <div className="mt-2 alert alert-success mt-2">
                            <div className="text-center">Welcome <b>{this.state.name}</b></div>
                        </div>
                        {this.state.user_type === "NORMAL" &&
                            <div className="dashboard_info alert-info alert mt-2">
                                <div className="text-center">
                                    <p>{this.state.post_count["pending"]!==0?"Your latest submission is in pending state.\n Please wait for new submission":(this.state.post_count["submission"]!==0?"Your last submission is approved":"Create your first submission")}</p>
                                    {this.state.post_count["pending"]===0 &&<button className="btn btn-success" onClick={this.handleShow}>Create New Submission</button>}
                                </div>
                            </div>
                        }  
    
                        <div id="post-count" className="row col-11 mx-auto justify-content-center">
                            {this.state.card_list.map((item, index) => (
                                <div className="card col-md-5 m-2" onClick={()=>this.redirectToPost(item.count,item.status_enum)}>
                                    <div className="card-body">
                                        <h5 className="card-title text-center">{item.count}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">{item.status}</h6>
                                        <p className="card-text">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Modal show={this.state.modeShow} onHide={this.handleClose} animation={false}>
                        <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="form-group">
                                    <label for="recipient-name" className="col-form-label">User:</label>
                                    <input disabled type="text" className="form-control" id="recipient-name" value={this.state.name}/>
                                </div>
                                <div className="form-group">
                                    <label for="message-text" className="col-form-label">Message:</label>
                                    <textarea onChange={(event)=>this.handleChangePostText(event)} className="form-control" id="message-text" rows="5">{this.state.newPost}</textarea>
                                </div>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.submitPankti}>
                            Submit
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </React.Fragment>
            )
        // let dashboard_condition = (!this.props.submission && !this.props.submission_list && !this.state.showSubmissions);
        // return(
        //     <React.Fragment>
        //         <div id={dashboard_condition?"dashboard":""} className="container">
        //             {this.state.snackbarProps.open && <SnackbarMessage onClose={this.handleCloseSnackbar} {...this.state.snackbarProps}></SnackbarMessage>}
        //             {this.props.submission ? 
        //                 <Submission add_post_message={this.addPostMessage}></Submission>:
        //                 this.state.showSubmissions || this.props.submission_list ? 
        //                     <SubmissionList submit_post={this.submitPost} action_submission={this.actionSubmission} total={this.state.total} from={this.state.from} to={this.state.to} show_range_list={this.showRangeList} filter_value={this.state.filterValue} update_list={this.updatePanktiyaanList} panktiyaan_list={this.state.filtered_panktiyaan_list}/>:                        
        //                     authentication.isAdmin()?
        //                     <React.Fragment>
        //                         <div className="top-block">
        //                             <div className="user-heading">
        //                                 <p>{authentication.getUserName()}</p>
        //                             </div>
        //                         </div>
        //                         <div className="middle-blocks">
        //                             <div onClick={this.showSubmissions} className="block-1">
        //                                 <div className="entry-count">{this.state.post_count.submission}</div>
        //                                 <div className="submissions">Assigned</div>
        //                             </div>
        //                             <div onClick={this.showSubmissions} className="block-2">
        //                                 <div className="entry-count">{this.state.post_count.pending}</div>
        //                                 <div className="submissions">Pending</div>
        //                             </div>
        //                         </div>          
        //                     </React.Fragment>:
        //                     (
        //                         authentication.isSuperAdmin()?
        //                         <React.Fragment>
        //                             <div className="top-block">
        //                                 <div className="user-heading">
        //                                     <p>{authentication.getUserName()}</p>
        //                                 </div>
        //                             </div>
        //                             <div className="middle-blocks">
        //                                 <div onClick={this.showSubmissions} className="block-1">
        //                                     <div className="entry-count">{this.state.post_count.approved}</div>
        //                                     <div className="submissions">Approved</div>
        //                                 </div>
        //                                 <div onClick={this.showSubmissions} className="block-2">
        //                                     <div className="entry-count">{this.state.post_count.posted}</div>
        //                                     <div className="submissions">Posted</div>
        //                                 </div>
        //                             </div>          
        //                         </React.Fragment>:
        //                         <React.Fragment>
        //                             <div className="top-block">
        //                                 <div className="user-heading">
        //                                     <p>{authentication.getUserName()}</p>
        //                                 </div>
        //                             </div>
        //                             <div className="middle-blocks">
        //                                 <div onClick={this.showSubmissions} className="block-1">
        //                                     <div className="entry-count">{this.state.post_count.submission}</div>
        //                                     <div className="submissions">Submissions</div>
        //                                 </div>
        //                                 <div onClick={this.showSubmissions} className="block-2">
        //                                     <div className="entry-count">{this.state.post_count.approved}</div>
        //                                     <div className="submissions">Approved</div>
        //                                 </div>
        //                             </div>          
        //                             <div className="block-3">
        //                                 <div className="submission-status">
        //                                     Your latest submission is : <span className="status-color">{this.state.post_count.pending===0 ? "Approved":"Pending"}</span>
        //                                 </div>    
        //                             </div>

        //                             {this.state.post_count.pending===0 ?
        //                                 <div className="block-4-submitted">
        //                                     <input onClick={this.openSubmissions} className="submission-block" name="submit" type="submit" value="Make another submission"/>
        //                                 </div>:
        //                                 <div className="block-4">
        //                                     <div className="submission-status">
        //                                         <span className="orange-color">Sorry you cannot make another submission now</span> 
        //                                     </div>
        //                                 </div>
        //                             }  
        //                         </React.Fragment>
        //                     )
        //             }
        //         </div>
        //         {(this.props.submission || (this.state.showSubmissions || this.props.submission_list)) &&
        //             <div className="back-to-dashboard">
        //                 <a onClick={this.backToDashboard}>
        //                     Back to Dashboard
        //                 </a>
        //             </div>
        //         }
        //     </React.Fragment>
        // )
    }
}

export default Dashboard;
