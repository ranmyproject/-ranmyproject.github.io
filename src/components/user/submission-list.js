import React,  {Component}  from 'react'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import authentication from '../../services/authentication';
import { Button ,Modal} from 'react-bootstrap';
import apiService from '../../services/api-service';
import * as urlConstant from '../shared/url-constants';
import SnackbarMessage from '../../services/snackbar-message';

const list_length=4;
class SubmissionList extends Component{

    constructor(props) {
        super(props)
        this.state = {
            modeShow:false,
            availableFilter:["APPROVED","PENDING","REJECTED","POSTED","ALL"],
            selectedPost:{},
            panktiyaan_list:[],
            filtered_panktiyaan_list:[],
            category:[],
            from:0,
            total:0,
            to:list_length,
            snackbarProps: { open: false, message: "Hello World", variant: "success" },
        }
    }

    submit=(data)=>{
        const options = {
            title: 'Are you sure?',
            message: <p>You want to <b>{data.action}</b> this pankti submitted by <b>{data.item.name}</b>?</p>,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.takeAction(data.action,data.item.postId)
                },
                {
                    label: 'No',
                }
            ],
            willUnmount: () => {}
        }
        confirmAlert(options);
    };

    takeAction=(action,item)=>{
        apiService.postData(urlConstant.ADMIN_POST_ACTION,{postId:item,stage:action}).then(data=>{
            if(data["success"]){
                this.setState({snackbarProps:{open: true,message: "Post "+action+" successfully", variant: "success"}});
                let list = this.state.panktiyaan_list;
                for(let i=0;i<list.length;i++){
                    if(list[i].postId===item){
                        list[i].stage=action;
                    }
                }
                this.setState({panktiyaan_list:list});
            }else{
                this.setState({snackbarProps:{open: true,message: data["data"]["message"], variant: "error"}});
            }
        }).catch((err)=>{
            this.setState({snackbarProps:{open: true,message: "error occured while processing request", variant: "error"}});
        });
    }

    componentDidMount(){
        document.title = 'Panktiyaan | Post';
        let filter = new URLSearchParams(window.location.search).get("filter").split(",");

        if(!this.state.availableFilter.some(r=> filter.includes(r.toUpperCase()))){
            window.location.href="/dashboard";
            return;
        }

        apiService.getData(authentication.isAdmin()?urlConstant.ADMIN_GET_POST:(authentication.isSuperAdmin()?urlConstant.GET_SUPER_ADMIN_POST:urlConstant.USER_POST)).then(data=>{
            if(data.success){
                let panktiyaan_list = data.data.posts;
                let filtered_list = filter=="ALL"?panktiyaan_list:panktiyaan_list.filter(item=>filter.includes(item.stage.toUpperCase()));
                this.setState({panktiyaan_list:filtered_list,filtered_panktiyaan_list:filtered_list.slice(this.state.from,this.state.to),total:filtered_list.length});
            }else{

            }
        });
    }

    handleShow=(post)=>{
        this.setState({selectedPost:post,category:post.category});
        this.setState({modeShow:true});
    }

    handleClose=()=>{
        this.setState({modeShow:false});
    }

    postPankti=()=>{
        var selectedPost = {...this.state.selectedPost}
        selectedPost.category = this.state.category;

        this.setState({snackbarProps:{open: true,message: "processing post submission request", variant: "loading"}});
        apiService.postData(urlConstant.UPDATE_POST_DETAIL,selectedPost).then(data=>{
            if(data["success"]){
                this.setState({snackbarProps:{open: true,message: "post updated successfully", variant: "success"}});
                let pList = this.state.panktiyaan_list;
                for(let i=0;i<pList.length;i++){
                    if(pList[i]["postId"]===selectedPost["postId"]){
                        pList[i] = selectedPost;
                    }
                }
                this.setState({panktiyaan_list:pList});
            }else{
                this.setState({snackbarProps:{open: true,message: data["data"]["message"], variant: "error"}});
            }
        }).catch((err)=>{
            console.log(err);
        });

        this.setState({modeShow:false});
    }

    handleChangePostText=(event)=>{
        let value = event.target.value;
        this.setState(prevState => ({
            selectedPost:{
              ...prevState.selectedPost,
              text: value
            }
        }));
    }

    handleCategoryChange = (event) =>{
        this.setState({category: [...event.target.selectedOptions].map(o => o.value)}); 
    }

    showRangeList=(direction)=>{
        let from = direction==="prev" ? this.state.from-list_length:this.state.to;
        let to = direction==="prev" ? this.state.from:this.state.to+list_length;
        let data = this.state.panktiyaan_list;
        this.setState({filtered_panktiyaan_list:data.slice(from,to),from:from,to:(to>this.state.total?this.state.total:to)});
    }

    handleCloseSnackbar = () =>{
        this.setState({snackbarProps:{open: false,message: "", variant: "success"}});
    }
    
    render(){
        return(
            <React.Fragment>
                {this.state.snackbarProps.open && <SnackbarMessage onClose={this.handleCloseSnackbar} {...this.state.snackbarProps}></SnackbarMessage>}
                <div id="submission_list">
                    {this.state.filtered_panktiyaan_list.map((item, index) => (
                         <div className="card col-md-5 col-11 m-auto-horizontal">
                         <div className="card-body">
                             <div className="card-title">
                                 <h5>{item.name}</h5>

                                {(authentication.isAdmin() || authentication.isSuperAdmin()) &&
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-sm btn-success mx-1" onClick={this.submit.bind(this,({item:item,action:"APPROVED"}))}>Approve</button>
                                        <button className="btn btn-sm btn-danger mx-1" onClick={this.submit.bind(this,({item:item,action:"REJECTED"}))}>Reject</button>
                                        {authentication.isSuperAdmin() && <button className="btn btn-sm btn-info mx-1" onClick={this.handleShow.bind(this,item)}>Edit</button>}
                                    </div>
                                }
                             </div>
                             <h6 className="card-subtitle mb-2 text-muted">Status : {item.stage}</h6>
                             <p className="card-text">
                                 {item.text}
                             </p>
                         </div>
                     </div>)
                    )}
                    <div className="mx-auto col-md-5 d-flex justify-content-center">
                        {this.state.from > 0 && <button className="btn btn-primary mx-1" onClick={this.showRangeList.bind(this,"prev")}>Previous</button>}
                        {this.state.to < this.state.total && <button className="btn btn-primary mx-1" onClick={this.showRangeList.bind(this,"next")}>Next</button>}
                    </div>
                </div>

                {this.state.selectedPost &&
                    <Modal show={this.state.modeShow} onHide={this.handleClose} animation={false}>
                        <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="form-group">
                                    <label for="recipient-name" className="col-form-label">User:</label>
                                    <input disabled type="text" className="form-control" id="recipient-name" value={this.state.selectedPost.name}/>
                                </div>
                                <div className="form-group">
                                    <label for="message-text" className="col-form-label">Message:</label>
                                    <textarea onChange={(event)=>this.handleChangePostText(event)} className="form-control" id="message-text" rows="5">{this.state.selectedPost.text}</textarea>
                                </div>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <label className="input-group-text" for="inputGroupSelect01">Options</label>
                                    </div>
                                    <select onChange={(event)=>this.handleCategoryChange(event)} className="custom-select" value={this.state.category} multiple>
                                        <option value="HINDI">HINDI</option>
                                        <option value="SPORT">SPORT</option>
                                        <option value="TECH">TECH</option>
                                        <option value="GAME">GAME</option>
                                    </select>
                                </div>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.postPankti}>
                            Post
                        </Button>
                        </Modal.Footer>
                    </Modal>
                }
            </React.Fragment>


            // <React.Fragment>
            //     {editPost ?
            //         <EditPost submit_post={props.submit_post} post={editPost}/>:
            //         <div className="neumorphism">
            //             <div className="status-list">
            //                 <select onChange={props.update_list.bind(this)}  value={props.filter_value} className="selection-box" name="options">
            //                     <option value="ALL">All</option>
            //                     <option id="bg" value="PENDING">Pending</option>
            //                     <option id="bg" value="APPROVED">Approved</option>
            //                 </select>
            //             </div>
                        
            //             {props.panktiyaan_list.map((item, index) => (
            //                 <React.Fragment>
            //                     {(authentication.isAdmin() || authentication.isSuperAdmin()) &&
            //                         <div className="heading">
            //                             <div className="user-heading">
            //                                 <p>
            //                                     @<a className="link-remove" href="#">{item.name}</a>
            //                                 </p>
            //                                 <p className={item.stage==="APPROVED"?"green-text":(item.stage==="REJECTED"?"red-text":"grey-text")}>{item.stage}</p>
            //                             </div>
            //                             <div className="user-heading admin-action">
            //                                 {authentication.isAdmin() && 
            //                                     <React.Fragment>
            //                                         <button className="button success" onClick={submit.bind(this,({item:item,action:"APPROVED"}))}>Approve</button>
            //                                         <button className="button danger" onClick={submit.bind(this,({item:item,action:"REJECTED"}))}>Reject</button>
            //                                     </React.Fragment>
            //                                 }
            //                                 {authentication.isSuperAdmin() && 
            //                                     <button className="button grey" onClick={setEditPost.bind(this,item)}>Edit</button>
            //                                 }
            //                             </div>
            //                         </div>
            //                     }
            //                     {editPost===index ? 
            //                         <textarea name="entry" id="entry-text" required>{item.text}</textarea>:
            //                         <div key={index} className="content">
            //                             <div className="text text-wrap">
            //                                 {item.text}
            //                             </div>
            //                         </div>
            //                     }
            //                 </React.Fragment>
            //             ))}
            //             <div className="end-buttons">
            //                 {
            //                     props.from > 0 && 
            //                     <div className="previous-button">
            //                         <button className="button" onClick={props.show_range_list.bind(this,"prev")} >Previous</button>
            //                     </div>
            //                 }
            //                 {
            //                     props.to<props.total &&
            //                     <div className="next-button">
            //                         <button className="button" onClick={props.show_range_list.bind(this,"next")}>Next</button>
            //                     </div>
            //                 }
                        
            //             </div>    
            //         </div>
            //     }
            // </React.Fragment>
        )
    }
}

export default SubmissionList;