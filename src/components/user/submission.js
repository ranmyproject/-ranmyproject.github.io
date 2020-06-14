import React,  {useState}  from 'react'
import apiService from '../../services/api-service';
import * as urlConstant from '../shared/url-constants';

export default function Submission(props){

    const [submissionData, setSubmissionData] = useState("");
    function postPanktiyaan(){
        apiService.postData(urlConstant.POST_PANKTIYAAN,{text:submissionData}).then(data=>{
            if(data["success"]){
                props.add_post_message(data.data["message"],true);
            }else{
                props.add_post_message(data.data["message"],false);
            }
        });    
    }

    return(
        <React.Fragment>
                <div className="neumorphism">
                    <div>
                        <textarea onChange={(e)=>setSubmissionData(e.target.value)} name="entry" id="entry-text" required></textarea>
                    </div>
                    <div className="submit">
                        <input className="submit-entry" name="submit" type="button" value="Submit" onClick={postPanktiyaan}/>
                    </div>
                </div>
        </React.Fragment>
    )
}