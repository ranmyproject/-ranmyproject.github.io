import React, {Component} from 'react'
import * as urlConstant from '../shared/url-constants';
import apiService from '../../services/api-service';
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const list_length=10;
class Home extends Component{

    constructor(props){
        super(props)
        this.state={
            panktiyaan_list:[],
            filtered_panktiyaan_list:[],
            from:0,
            total:0,
            to:list_length,
            loading: true,
        }
    }

    componentDidMount(){
        document.title = 'Panktiyaan | Home';
        this.loadData();
    }

    showRangeList=(direction)=>{
        let from = direction==="prev" ? this.state.from-list_length:this.state.to;
        let to = direction==="prev" ? this.state.from:this.state.to+list_length;
        let data = this.state.panktiyaan_list;
        this.setState({filtered_panktiyaan_list:data.slice(from,to),from:from,to:(to>this.state.total?this.state.total:to)});
    }

    loadData=()=>{
        apiService.getData(urlConstant.HOME_POST_API).then(data=>{
            let panktiyaan_list = data.data.posts;
            this.setState({loading:false, panktiyaan_list:panktiyaan_list,filtered_panktiyaan_list:panktiyaan_list.slice(this.state.from,this.state.to),total:panktiyaan_list.length});
        });
    }

    render(){
        return(
            <div id="submission_list">
                {this.state.loading &&
                    <div className="sweet-loading mt-5">
                        <BounceLoader
                            css={override}
                            size={50}
                            color={"#123abc"}
                            loading={this.state.loading}
                        />
                    </div>
                }
                {(!this.state.loading && this.state.filtered_panktiyaan_list.length===0) &&
                    <div class="alert alert-info col-4 mx-auto mt-2" role="alert">
                         No post approved yet
                    </div>
                }
                {this.state.filtered_panktiyaan_list.map((item, index) => (
                        <div class="card col-md-5 col-11 m-auto-horizontal">
                            <div class="card-body">
                                <div class="card-title">
                                    <h5>@ {item.name}</h5>
                                </div>
                                <p class="card-text">
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
        );
    }

}

export default Home;
